import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://cuqcimfkvvjrlkbwbrhf.supabase.co'
const DEFAULT_SUPABASE_PUBLIC_KEY = 'sb_publishable_BSfnyVAzO9e1nCWPw-LTMw_CeYACM2o'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  DEFAULT_SUPABASE_PUBLIC_KEY
const supabaseServerKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabasePublicKey
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Browser client (dùng trong client components)
export const supabase = createClient(supabaseUrl, supabasePublicKey)

// Server client (dùng trong API routes / Server Components)
export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseServerKey)
}

export function createPrivilegedSupabase() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

// Kiểm tra Supabase có được cấu hình chưa
export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !!supabasePublicKey
  )
}

export function isServiceRoleConfigured(): boolean {
  return !!supabaseServiceRoleKey
}
