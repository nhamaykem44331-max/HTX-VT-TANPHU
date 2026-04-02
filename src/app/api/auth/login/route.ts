import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, createToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body as { username: string; password: string }

    if (!username || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin đăng nhập' }, { status: 400 })
    }

    const valid = await verifyCredentials(username, password)
    if (!valid) {
      return NextResponse.json({ error: 'Sai tên đăng nhập hoặc mật khẩu' }, { status: 401 })
    }

    const token = createToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
