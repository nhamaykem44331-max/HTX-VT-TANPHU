import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_RECOVERY_EMAIL,
  createDatabaseAdminUser,
  getCurrentAdminSession,
  getDatabaseAdminByUsername,
  listAdminUsers,
  validateEmail,
  validatePassword,
  validateUsername,
} from '@/lib/auth'
import { ensurePasswordResetSchema } from '@/lib/password-reset'
import { isAdminDatabaseConfigured } from '@/lib/admin-db'

async function ensureSchemaIfPossible() {
  if (!isAdminDatabaseConfigured()) return
  try {
    await ensurePasswordResetSchema()
  } catch (error) {
    // Không chặn màn hình tài khoản chỉ vì chưa tạo được cột email
    console.error('[auth/users] ensurePasswordResetSchema failed', error)
  }
}

export async function GET() {
  const session = await getCurrentAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  try {
    await ensureSchemaIfPossible()
    const users = await listAdminUsers()

    let currentEmail: string | null = null
    if (isAdminDatabaseConfigured()) {
      const dbUser = await getDatabaseAdminByUsername(session.username)
      currentEmail = dbUser?.email || null
    }
    if (!currentEmail && ADMIN_RECOVERY_EMAIL) {
      currentEmail = ADMIN_RECOVERY_EMAIL
    }

    return NextResponse.json({
      users,
      currentUser: session,
      currentEmail,
      legacyMode: session.authSource === 'env',
      databaseConfigured: isAdminDatabaseConfigured(),
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
    const email = String(body.email || '').trim()
    const password = String(body.password || '')

    const usernameError = validateUsername(username)
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 })
    }

    if (email) {
      const emailError = validateEmail(email)
      if (emailError) {
        return NextResponse.json({ error: emailError }, { status: 400 })
      }
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

    await ensureSchemaIfPossible()
    const user = await createDatabaseAdminUser({
      username,
      displayName,
      email: email || undefined,
      password,
    })

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Tên đăng nhập hoặc email này đã tồn tại.' }, { status: 409 })
    }

    return NextResponse.json({ error: error?.message || 'Không thể tạo tài khoản mới' }, { status: 500 })
  }
}
