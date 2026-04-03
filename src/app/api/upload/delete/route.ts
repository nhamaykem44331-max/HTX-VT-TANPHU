import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Kiểm tra auth
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase chua duoc cau hinh tren production' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { path } = body

    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 })
    }

    // Xóa từ Supabase Storage
    const supabase = createServerSupabase()
    const { error } = await supabase.storage
      .from('website-images')
      .remove([path])

    if (error) {
      throw new Error(error.message || 'Khong the xoa anh tren Supabase Storage')
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Delete failed' },
      { status: 500 }
    )
  }
}
