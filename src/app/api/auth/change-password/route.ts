import { NextRequest, NextResponse } from 'next/server'
import {
  changeAdminPassword,
  COOKIE_NAME,
  createToken,
  getCurrentAdminSession,
  validatePassword,
} from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getCurrentAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const currentPassword = String(body.currentPassword || '')
    const newPassword = String(body.newPassword || '')

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ thông tin mật khẩu.' }, { status: 400 })
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

    const nextSession = await changeAdminPassword(session, currentPassword, newPassword)
    const response = NextResponse.json({
      success: true,
      message:
        session.authSource === 'env'
          ? 'Đã chuyển tài khoản hiện tại sang hệ thống tài khoản database và cập nhật mật khẩu mới.'
          : 'Đã đổi mật khẩu thành công.',
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
    return NextResponse.json({ error: error?.message || 'Không thể đổi mật khẩu' }, { status: 500 })
  }
}
