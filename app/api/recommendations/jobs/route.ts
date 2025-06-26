// app/api/recommendations/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import supabaseAdmin from '@/lib/supabaseClient'

// --- Interfaces for type safety ---
interface UserProfile {
  user_id: string
  skills: string[]
  interests: string[]
  experience_level: string
  location_preference: string | null
}
interface Job {
  id: number | string
  title: string
  company: string | null
  location: string | null
  salary: string | null
  experience: string | null
  tags: string[]
  recommendationScore?: number
}

// --- Helper: Infer User Experience Level from graduation year ---
function inferUserExperienceLevel(profile: any): string {
  if (!profile || !profile.year_of_study) return 'fresher'
  const yearMatch = profile.year_of_study.match(/\d{4}/)
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 0
  const currentYear = new Date().getFullYear()
  const yearsSinceGrad = year > 1980 && year <= currentYear ? currentYear - year : 0
  if (yearsSinceGrad >= 8) return '8+ years'
  if (yearsSinceGrad >= 5) return '5-8 years'
  if (yearsSinceGrad >= 3) return '3-5 years'
  if (yearsSinceGrad >= 1) return '1-3 years'
  return 'fresher'
}

// --- Fetch User Profile from Supabase ---
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) return null
  const { data, error } = await supabaseAdmin
    .from('career_forms')
    .select('user_id, skills, interests, year_of_study, location_preference')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    console.error(`[API Rec Jobs] Supabase error or no profile for ${userId}:`, error)
    return null
  }

  const userProfile: UserProfile = {
    user_id: data.user_id,
    skills: data.skills || [],
    interests: data.interests || [],
    location_preference: data.location_preference?.toLowerCase() || null,
    experience_level: inferUserExperienceLevel(data),
  }
  return userProfile
}

// --- Recommendation Scoring Logic ---
function calculateJobScore(userProfile: UserProfile | null, job: Job | null): number {
  if (!userProfile || !job) return 0
  let score = 0
  const userSkills = new Set(userProfile.skills.map(s => s.toLowerCase().trim()))
  const userInterests = new Set(userProfile.interests.map(i => i.toLowerCase().trim()))
  const jobTags = new Set(job.tags.map(t => t.toLowerCase().trim()))
  const jobTitleLower = job.title.toLowerCase()

  userSkills.forEach(skill => {
    if (jobTags.has(skill) || jobTitleLower.includes(skill)) score += 5
  })
  userInterests.forEach(interest => {
    if (jobTags.has(interest) || jobTitleLower.includes(interest)) score += 3
  })

  const jobExpLower = job.experience?.toLowerCase() || ''
  if (jobExpLower.includes(userProfile.experience_level)) score += 4
  else if (userProfile.experience_level === 'fresher' && (jobExpLower.includes('0-1') || jobExpLower.includes('1-3'))) {
    score += 2
  }

  const jobLocationLower = job.location?.toLowerCase() || ''
  if (userProfile.location_preference && jobLocationLower.includes(userProfile.location_preference)) {
    score += 5
  } else if (jobLocationLower.includes('remote')) {
    score += 3
  }

  return score
}

// --- API Route Handler ---
export async function GET(req: NextRequest) {
  const { userId } = getAuth(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userProfile = await getUserProfile(userId)
    if (!userProfile) {
      return NextResponse.json({ recommendations: [], message: 'Complete profile for job recommendations.' }, { status: 404 })
    }

    const { data: allJobs, error: jobsError } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('posted_date', { ascending: false })
      .limit(300)

    if (jobsError) throw jobsError
    if (!allJobs || allJobs.length === 0) {
      return NextResponse.json({ recommendations: [], message: 'No jobs available.' })
    }

    const scoredJobs = allJobs
      .map(job => ({ ...job, recommendationScore: calculateJobScore(userProfile, job as Job) }))
      .filter(job => job.recommendationScore > 0)

    scoredJobs.sort((a, b) => (b.recommendationScore ?? 0) - (a.recommendationScore ?? 0))

    const limit = 10
    const topRecommendations = scoredJobs.slice(0, limit)
    console.log(`[API Rec Jobs] Returning top ${topRecommendations.length} recommendations for user ${userId}.`)
    return NextResponse.json({ recommendations: topRecommendations })
  } catch (error: any) {
    console.error('[API Rec Jobs] Error:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations.', details: error.message }, { status: 500 })
  }
}