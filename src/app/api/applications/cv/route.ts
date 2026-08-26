import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase'

const CV_BUCKET = 'cv-uploads'
const SIGNED_URL_TTL_SECONDS = 60 * 5

/**
 * CV nằm trong bucket riêng tư nên không mở được bằng URL trực tiếp.
 * Route này kiểm tra đăng nhập rồi mới cấp link tạm 5 phút.
 */
export async function GET(request: NextRequest) {
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase chưa được cấu hình' }, { status: 500 })
  }

  const path = request.nextUrl.searchParams.get('path')
  if (!path) {
    return NextResponse.json({ error: 'Thiếu đường dẫn CV' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase.storage
    .from(CV_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)

  if (error || !data?.signedUrl) {
    console.error('CV signed url error:', error)
    return NextResponse.json({ error: 'Không mở được file CV' }, { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
