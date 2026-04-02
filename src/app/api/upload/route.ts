import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Kiểm tra auth
  const authed = await isAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate: chỉ chấp nhận ảnh, max 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, SVG)' }, { status: 400 })
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File quá lớn (tối đa 5MB)' }, { status: 400 })
    }

    // Tạo tên file unique: folder/timestamp-originalname
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${folder}/${timestamp}-${safeName}`

    // Upload lên Supabase Storage
    const supabase = createServerSupabase()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('website-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    // Lấy public URL
    const { data: { publicUrl } } = supabase.storage
      .from('website-images')
      .getPublicUrl(data.path)

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
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
