import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  'placeholder-public-key'
const supabaseServerKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabasePublicKey

// Browser client (dùng trong client components)
export const supabase = createClient(supabaseUrl, supabasePublicKey)

// Server client (dùng trong API routes / Server Components)
export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseServerKey)
}

// Kiểm tra Supabase có được cấu hình chưa
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    (!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)
  )
}
