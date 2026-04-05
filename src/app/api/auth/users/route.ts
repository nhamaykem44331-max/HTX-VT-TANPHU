import { NextRequest, NextResponse } from 'next/server'
import {
  createDatabaseAdminUser,
  getCurrentAdminSession,
  listAdminUsers,
  validatePassword,
  validateUsername,
} from '@/lib/auth'

export async function GET() {
  const session = await getCurrentAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  try {
    const users = await listAdminUsers()
    return NextResponse.json({
      users,
      currentUser: session,
      legacyMode: session.authSource === 'env',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Không thể tải danh sách tài khoản' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getCurrentAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const username = String(body.username || '')
    const displayName = String(body.displayName || '')
    const password = String(body.password || '')

    const usernameError = validateUsername(username)
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 })
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

    const user = await createDatabaseAdminUser({
      username,
      displayName,
      password,
    })

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Tên đăng nhập này đã tồn tại.' }, { status: 409 })
    }

    return NextResponse.json({ error: error?.message || 'Không thể tạo tài khoản mới' }, { status: 500 })
  }
}
