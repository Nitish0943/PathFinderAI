// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Service Role Key in environment variables.')
}

// Create a single, reusable client instance for server-side operations.
// The service_role key has the power to bypass Row Level Security,
// so it should only be used on the server.
const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export default supabaseAdmin