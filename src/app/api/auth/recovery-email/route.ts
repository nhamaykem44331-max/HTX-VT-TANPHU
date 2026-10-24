import { NextRequest, NextResponse } from 'next/server'
import {
  COOKIE_NAME,
  createToken,
  getCurrentAdminSession,
  updateAdminRecoveryEmail,
  validateEmail,
} from '@/lib/auth'
import { ensurePasswordResetSchema } from '@/lib/password-reset'
import { isAdminDatabaseConfigured } from '@/lib/admin-db'

export async function POST(request: NextRequest) {
  const session = await getCurrentAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  try {
    if (!isAdminDatabaseConfigured()) {
      return NextResponse.json(
        { error: 'Chưa cấu hình SUPABASE_DB_URL nên chưa thể lưu email khôi phục.' },
        { status: 503 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const email = String(body.email || '')
    const currentPassword = String(body.currentPassword || '')

    const emailError = validateEmail(email)
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 })
    }

    if (!currentPassword) {
      return NextResponse.json({ error: 'Vui lòng nhập mật khẩu hiện tại để xác nhận.' }, { status: 400 })
    }

    await ensurePasswordResetSchema()
    const nextSession = await updateAdminRecoveryEmail(session, currentPassword, email)

    const response = NextResponse.json({
      success: true,
      message: 'Đã lưu email khôi phục. Khi quên mật khẩu, liên kết đặt lại sẽ được gửi tới email này.',
    })

    response.cookies.set(COOKIE_NAME, createToken(nextSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Email này đã được dùng cho tài khoản khác.' }, { status: 409 })
    }

    return NextResponse.json({ error: error?.message || 'Không thể lưu email khôi phục' }, { status: 500 })
  }
}
