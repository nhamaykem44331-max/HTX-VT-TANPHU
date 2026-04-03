import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase'

const MAX_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Chi chap nhan file anh JPEG, PNG, WebP hoac SVG' },
        { status: 400 }
      )
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File qua lon. Vui long chon anh toi da 4MB.' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${folder}/${timestamp}-${safeName}`

    const supabase = createServerSupabase()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('website-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      throw new Error(error.message || 'Khong the upload anh len Supabase Storage')
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('website-images').getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: data.path,
      fileName: file.name,
      size: file.size,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
