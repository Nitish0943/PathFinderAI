// app/api/profile/status/route.ts
import supabaseAdmin from '@/lib/supabaseClient'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('[API Profile Status] Received GET request.')
  const { userId } = getAuth(req)

  if (!userId) {
    console.log('[API Profile Status] Unauthorized: No userId found.')
    return NextResponse.json({ error: 'Unauthorized - Invalid session or token' }, { status: 401 })
  }

  console.log(`[API Profile Status] Authorized for userId: ${userId}`)

  try {
    // Use the Supabase client to check for the user's profile
    const { data, error } = await supabaseAdmin
      .from('career_forms')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle() // This is an efficient way to get one or null, without throwing an error if not found.

    // Handle any actual database errors
    if (error) {
      console.error('[API Profile Status] Supabase error:', error)
      throw error
    }

    // If data is not null, the profile exists.
    const exists = !!data
    console.log(`[API Profile Status] Profile exists check result for user ${userId}: ${exists}`)

    return NextResponse.json({ exists })
  } catch (error: any) {
    console.error('[API Profile Status] Error checking profile status:', error)
    return NextResponse.json({ error: 'Failed to check profile status in database.', details: error.message }, { status: 500 })
  }
}