import { NextRequest, NextResponse } from 'next/server'
import { validatePassword } from '@/lib/auth'
import { getValidPasswordReset, resetPasswordWithToken } from '@/lib/password-reset'

/** Kiểm tra token còn hiệu lực để trang đặt lại mật khẩu hiển thị đúng trạng thái. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || ''

  try {
    const reset = await getValidPasswordReset(token)
    if (!reset) {
      return NextResponse.json(
        { valid: false, error: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ valid: true, username: reset.username })
  } catch (error: any) {
    console.error('[reset-password:GET]', error)
    return NextResponse.json({ valid: false, error: error?.message || 'Lỗi server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = String(body.token || '')
    const password = String(body.password || '')
    const passwordConfirm = String(body.passwordConfirm || '')

    if (!token) {
      return NextResponse.json({ error: 'Thiếu mã đặt lại mật khẩu.' }, { status: 400 })
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

    if (password !== passwordConfirm) {
      return NextResponse.json({ error: 'Mật khẩu nhập lại chưa khớp.' }, { status: 400 })
    }

    const result = await resetPasswordWithToken(token, password)

    return NextResponse.json({
      success: true,
      username: result.username,
      message: 'Đã đặt lại mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.',
    })
  } catch (error: any) {
    console.error('[reset-password:POST]', error)
    return NextResponse.json({ error: error?.message || 'Không thể đặt lại mật khẩu' }, { status: 400 })
  }
}
