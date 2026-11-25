import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin, COOKIE_NAME, createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body as { username: string; password: string }

    if (!username || !password) {
      return NextResponse.json({ error: 'Thiếu thông tin đăng nhập' }, { status: 400 })
    }

    const session = await authenticateAdmin(username, password)
    if (!session) {
      return NextResponse.json({ error: 'Sai tên đăng nhập hoặc mật khẩu' }, { status: 401 })
    }

    const token = createToken(session)
    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    // Khong tra loi goc (vd loi ket noi Postgres) ra man hinh dang nhap cong khai;
    // chi tiet nam trong runtime log cua Vercel.
    console.error('[api/auth/login] loi khi xac thuc admin:', error)
    return NextResponse.json({ error: 'Lỗi hệ thống khi đăng nhập. Vui lòng thử lại sau.' }, { status: 500 })
  }
}
