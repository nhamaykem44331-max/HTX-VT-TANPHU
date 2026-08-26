import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase, isSupabaseConfigured } from '@/lib/supabase'

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024

const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const CV_BUCKET = 'cv-uploads'

/** Chống spam đơn giản: giới hạn số lần nộp theo IP trong bộ nhớ tiến trình. */
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const submissions = new Map<string, number[]>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(ip, recent)
    return true
  }

  recent.push(now)
  submissions.set(ip, recent)
  return false
}

function text(form: FormData, key: string) {
  const value = form.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Hệ thống lưu hồ sơ chưa sẵn sàng. Vui lòng gọi hotline 0208.383.2608.' },
        { status: 503 }
      )
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Bạn đã gửi quá nhiều hồ sơ. Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      )
    }

    const form = await request.formData()

    const fullName = text(form, 'fullName')
    const phone = text(form, 'phone')
    const email = text(form, 'email')
    const coverLetter = text(form, 'coverLetter')
    const jobId = text(form, 'jobId')
    const jobTitle = text(form, 'jobTitle')
    const jobDepartment = text(form, 'jobDepartment')

    if (fullName.length < 2) {
      return NextResponse.json({ error: 'Vui lòng nhập họ tên.' }, { status: 400 })
    }

    if (!/^[0-9+\s.()-]{9,15}$/.test(phone)) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 })
    }

    if (!jobTitle) {
      return NextResponse.json({ error: 'Thiếu vị trí ứng tuyển.' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Upload CV (nếu có) vào bucket riêng tư trước khi ghi bản ghi,
    // để hồ sơ đã lưu luôn trỏ tới file có thật.
    let cvPath = ''
    let cvFileName = ''
    const cv = form.get('cv')

    if (cv instanceof File && cv.size > 0) {
      if (!ALLOWED_CV_TYPES.includes(cv.type)) {
        return NextResponse.json(
          { error: 'CV chỉ nhận file PDF, DOC hoặc DOCX.' },
          { status: 400 }
        )
      }

      if (cv.size > MAX_CV_SIZE_BYTES) {
        return NextResponse.json({ error: 'CV tối đa 5MB.' }, { status: 400 })
      }

      const safeName = cv.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const path = `${new Date().getFullYear()}/${Date.now()}-${safeName}`
      const buffer = Buffer.from(await cv.arrayBuffer())

      const { data, error } = await supabase.storage
        .from(CV_BUCKET)
        .upload(path, buffer, { contentType: cv.type, upsert: false })

      if (error) {
        console.error('CV upload error:', error)
        return NextResponse.json(
          { error: 'Không tải được file CV lên. Vui lòng thử lại hoặc gửi hồ sơ qua email.' },
          { status: 500 }
        )
      }

      cvPath = data.path
      cvFileName = cv.name
    }

    const { error } = await supabase.from('job_applications').insert({
      job_id: jobId || null,
      job_title: jobTitle,
      job_department: jobDepartment,
      full_name: fullName,
      phone,
      email,
      cover_letter: coverLetter,
      cv_path: cvPath,
      cv_file_name: cvFileName,
    })

    if (error) {
      console.error('Application insert error:', error)

      // Không để lại file CV mồ côi khi bản ghi không lưu được.
      if (cvPath) {
        await supabase.storage.from(CV_BUCKET).remove([cvPath])
      }

      return NextResponse.json(
        { error: 'Không lưu được hồ sơ. Vui lòng thử lại hoặc gọi hotline 0208.383.2608.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Apply route error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
