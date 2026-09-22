import { NextRequest, NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/seo'
import { requestPasswordReset } from '@/lib/password-reset'

/**
 * Link trong email phải trỏ về đúng tên miền thật. Không lấy theo Host header
 * trên production để tránh bị chèn tên miền lạ (host header poisoning).
 */
function getResetBaseUrl(request: NextRequest) {
  const configured = (process.env.PASSWORD_RESET_BASE_URL || '').trim()
  if (configured) return configured
  if (process.env.NODE_ENV === 'production') return SITE_URL
  return request.nextUrl.origin
}

const GENERIC_MESSAGE =
  'Nếu tài khoản tồn tại và có email khôi phục, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (kể cả mục Spam).'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const identifier = String(body.identifier || '').trim()

    if (!identifier) {
      return NextResponse.json({ error: 'Vui lòng nhập tên đăng nhập hoặc email.' }, { status: 400 })
    }

    const result = await requestPasswordReset(identifier, getResetBaseUrl(request))

    return NextResponse.json({
      success: true,
      message: GENERIC_MESSAGE,
      // Chỉ trả email đã che khi thật sự gửi, để người dùng biết cần mở hộp thư nào
      maskedEmail: result.sent ? result.maskedEmail : null,
    })
  } catch (error: any) {
    console.error('[forgot-password]', error)
    return NextResponse.json(
      { error: error?.message || 'Không thể gửi email khôi phục. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
