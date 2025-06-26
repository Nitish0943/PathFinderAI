// app/api/career-form/route.ts
import supabaseAdmin from '@/lib/supabaseClient'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Helper function to convert a comma-separated string to a string array for JSONB columns
const toArray = (str: string | undefined | null): string[] => {
  if (!str || typeof str !== 'string') return []
  return str.split(',').map(item => item.trim()).filter(item => item.length > 0)
}

export async function POST(req: NextRequest) {
  console.log('\n--- Request to /api/career-form ---')
  const { userId } = getAuth(req)

  if (!userId) {
    console.error('[API Career Form] Unauthorized - userId missing from getAuth.')
    return NextResponse.json({ error: 'Unauthorized - Invalid session or token.' }, { status: 401 })
  }

  console.log(`[API Career Form] Authorized for userId: ${userId}`)

  try {
    const formData = await req.json()
    console.log('[API Career Form] Received formData:', formData)

    // Basic validation
    if (!formData.name || !formData.email || !formData.interests || !formData.skills) {
      console.log('[API Career Form] Missing required fields.')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Prepare data for Supabase. JSONB columns should receive arrays.
    const dataToUpsert = {
      user_id: userId,
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age, 10) || null,
      education: formData.education || null,
      year_of_study: formData.year_of_study || null,
      gpa: !isNaN(parseFloat(formData.gpa)) ? parseFloat(formData.gpa) : null,
      interests: toArray(formData.interests),
      skills: toArray(formData.skills),
      soft_skills: toArray(formData.soft_skills),
      certifications: formData.certifications || null,
      goals: toArray(formData.goals),
      study_hours: formData.study_hours || null,
      timeline: formData.timeline || null,
      learning_type: formData.learning_type || null,
      language: formData.language || null,
      feedback: formData.feedback || null,
      // `updated_at` will be handled by the database trigger.
    }

    // Use Supabase's 'upsert' method.
    // It will INSERT if user_id doesn't exist, or UPDATE if it does.
    const { error } = await supabaseAdmin
      .from('career_forms')
      .upsert(dataToUpsert, { onConflict: 'user_id' }) // Specify the primary key for conflict resolution

    if (error) {
      console.error('[API Career Form] Supabase upsert error:', error)
      throw error // Let the catch block handle it
    }

    console.log(`[API Career Form] Form data upserted successfully for user: ${userId}`)
    return NextResponse.json({ success: true, message: 'Form submitted successfully!' }, { status: 201 })
  } catch (err: any) {
    console.error('[API Career Form] Error saving form data:', err)
    let statusCode = 500
    let errorMessage = 'An unexpected error occurred while saving the form.'
    if (err instanceof SyntaxError) {
      statusCode = 400
      errorMessage = 'Invalid request body format.'
    } else if (err.message) {
      errorMessage = err.message
    }
    return NextResponse.json({ error: 'Failed to save form data.', details: errorMessage }, { status: statusCode })
  }
}