// app/api/recommendations/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import supabaseAdmin from '@/lib/supabaseClient'

// --- Interfaces for type safety ---
interface UserProfile {
  user_id: string
  skills: string[]
  interests: string[]
  goals: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  learning_type: string | null
  education: string | null
}
interface Course {
  id: number | string
  title: string
  description: string | null
  level: string | null
  provider: string | null
  rating: number | null
  students: number | null
  price: number | null
  tags: string[] // Supabase client automatically parses JSONB to an array
  recommendationScore?: number
}

// --- Helper: Infer User Level from Profile Data ---
function inferUserLevel(profile: any): 'beginner' | 'intermediate' | 'advanced' {
  if (!profile) return 'beginner'
  const skillsCount = profile.skills?.length || 0
  if (profile.education?.toLowerCase().includes('master') || profile.education?.toLowerCase().includes('phd') || skillsCount > 10) {
    return 'advanced'
  }
  if (skillsCount > 5) {
    return 'intermediate'
  }
  return 'beginner'
}

// --- Fetch User Profile from Supabase ---
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) return null
  const { data, error } = await supabaseAdmin
    .from('career_forms')
    .select('user_id, skills, interests, goals, education, learning_type')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    console.error(`[API Rec Courses] Supabase error or no profile for ${userId}:`, error)
    return null
  }

  // Process the raw data into our UserProfile interface
  const userProfile: UserProfile = {
    user_id: data.user_id,
    skills: data.skills || [],
    interests: data.interests || [],
    goals: data.goals || [],
    learning_type: data.learning_type,
    education: data.education,
    level: inferUserLevel(data),
  }
  return userProfile
}

// --- Recommendation Scoring Logic (No changes needed) ---
function calculateCourseScore(userProfile: UserProfile | null, course: Course | null): number {
  if (!userProfile || !course) return 0
  let score = 0
  const userSkills = new Set(userProfile.skills?.map(s => s.toLowerCase().trim()) || [])
  const userInterests = new Set(userProfile.interests?.map(i => i.toLowerCase().trim()) || [])
  const userGoals = userProfile.goals?.map(g => g.toLowerCase().trim()) || []
  const courseTags = new Set(course.tags?.map(t => t.toLowerCase().trim()) || [])
  const courseTitleLower = course.title?.toLowerCase() || ''
  const userLevel = userProfile.level?.toLowerCase()
  const courseLevel = course.level?.toLowerCase()

  userSkills.forEach(skill => {
    if (courseTags.has(skill) || courseTitleLower.includes(skill)) score += 5
  })
  userInterests.forEach(interest => {
    if (courseTags.has(interest) || courseTitleLower.includes(interest)) score += 3
  })
  userGoals.forEach(goal => {
    if (courseTags.has(goal) || courseTitleLower.includes(goal)) score += 2
  })

  if (userLevel && courseLevel) {
    if (userLevel === courseLevel) score += 2
  }

  score += Math.min(2, Math.floor(((course.rating ?? 0) - 4.0) * 2))
  score += Math.min(2, Math.floor((course.students ?? 0) / 10000))
  if (userProfile.learning_type && courseTags.has(userProfile.learning_type.toLowerCase())) {
    score += 1
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
      return NextResponse.json({ recommendations: [], message: 'Complete profile for recommendations.' }, { status: 404 })
    }

    // Fetch all courses from Supabase to create a pool for scoring
    const { data: allCourses, error: coursesError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .limit(200) // Limit to a reasonable number to avoid performance issues

    if (coursesError) throw coursesError

    // Score all fetched courses against the user's profile
    const scoredCourses = allCourses
      .map(course => ({
        ...course,
        recommendationScore: calculateCourseScore(userProfile, course as Course),
      }))
      .filter(course => course.recommendationScore > 0)

    // Sort by the calculated score in descending order
    scoredCourses.sort((a, b) => (b.recommendationScore ?? 0) - (a.recommendationScore ?? 0))

    const limit = 8 // Number of recommendations to return
    const topRecommendations = scoredCourses.slice(0, limit)

    console.log(`[API Rec Courses] Returning ${topRecommendations.length} recommendations for user ${userId}.`)
    return NextResponse.json({ recommendations: topRecommendations })
  } catch (error: any) {
    console.error('[API Rec Courses] Error generating recommendations:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations.', details: error.message }, { status: 500 })
  }
}