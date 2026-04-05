import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { isAdminDatabaseConfigured, queryAdminDb } from '@/lib/admin-db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
const COOKIE_NAME = 'htx-admin-token'
const ENV_ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase()

export type AdminAuthSource = 'database' | 'env'

export interface AdminSession {
  role: 'admin'
  userId: string | null
  username: string
  displayName: string | null
  authSource: AdminAuthSource
}

interface AdminUserRow {
  id: string
  username: string
  display_name: string | null
  password_hash: string
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

interface TokenPayload {
  role?: string
  userId?: string | null
  username?: string
  displayName?: string | null
  authSource?: AdminAuthSource
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

async function getDatabaseAdminByUsername(username: string): Promise<AdminUserRow | null> {
  if (!isAdminDatabaseConfigured()) return null

  const result = await queryAdminDb<AdminUserRow>(
    `
      SELECT id, username, display_name, password_hash, is_active, created_at, updated_at
      FROM public.admin_users
      WHERE username = $1
      LIMIT 1
    `,
    [normalizeUsername(username)]
  )

  const user = result.rows[0] || null
  if (!user || !user.is_active) return null
  return user
}

async function verifyEnvCredentials(username: string, password: string): Promise<boolean> {
  if (normalizeUsername(username) !== ENV_ADMIN_USERNAME) return false

  const passwordHash = process.env.ADMIN_PASSWORD_HASH || ''
  if (!passwordHash) return password === 'admin123'
  return bcrypt.compare(password, passwordHash)
}

function toSession(row: AdminUserRow): AdminSession {
  return {
    role: 'admin',
    userId: row.id,
    username: row.username,
    displayName: row.display_name || null,
    authSource: 'database',
  }
}

function normalizeTokenPayload(payload: TokenPayload): AdminSession | null {
  if (payload.role !== 'admin') return null

  return {
    role: 'admin',
    userId: typeof payload.userId === 'string' ? payload.userId : null,
    username: typeof payload.username === 'string' ? normalizeUsername(payload.username) : ENV_ADMIN_USERNAME,
    displayName: typeof payload.displayName === 'string' ? payload.displayName : null,
    authSource: payload.authSource === 'database' ? 'database' : 'env',
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<AdminSession | null> {
  const normalizedUsername = normalizeUsername(username)
  if (!normalizedUsername || !password) return null

  const databaseUser = await getDatabaseAdminByUsername(normalizedUsername)
  if (databaseUser) {
    const valid = await bcrypt.compare(password, databaseUser.password_hash)
    return valid ? toSession(databaseUser) : null
  }

  const envValid = await verifyEnvCredentials(normalizedUsername, password)
  if (!envValid) return null

  return {
    role: 'admin',
    userId: null,
    username: ENV_ADMIN_USERNAME,
    displayName: 'Tài khoản hệ thống',
    authSource: 'env',
  }
}

export function createToken(session?: Partial<AdminSession>): string {
  return jwt.sign(
    {
      role: 'admin',
      userId: session?.userId ?? null,
      username: session?.username ?? ENV_ADMIN_USERNAME,
      displayName: session?.displayName ?? null,
      authSource: session?.authSource ?? 'env',
    },
    JWT_SECRET,
    {
      expiresIn: '7d',
      algorithm: 'HS256',
    }
  )
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}

export function getSessionFromToken(token: string): AdminSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as TokenPayload
    return normalizeTokenPayload(decoded)
  } catch {
    return null
  }
}

export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return getSessionFromToken(token)
  } catch {
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentAdminSession()
  return !!session
}

export async function listAdminUsers() {
  const users: Array<{
    id: string
    username: string
    displayName: string | null
    authSource: AdminAuthSource
    isActive: boolean
    createdAt: string | null
  }> = []

  if (isAdminDatabaseConfigured()) {
    const result = await queryAdminDb<Pick<AdminUserRow, 'id' | 'username' | 'display_name' | 'is_active' | 'created_at'>>(
      `
        SELECT id, username, display_name, is_active, created_at
        FROM public.admin_users
        ORDER BY created_at ASC
      `
    )

    users.push(
      ...result.rows.map((user) => ({
        id: user.id,
        username: user.username,
        displayName: user.display_name || null,
        authSource: 'database' as const,
        isActive: user.is_active,
        createdAt: user.created_at || null,
      }))
    )
  }

  const hasEnvShadowedByDatabase = users.some((user) => user.username === ENV_ADMIN_USERNAME)
  if (!hasEnvShadowedByDatabase) {
    users.unshift({
      id: 'env-admin',
      username: ENV_ADMIN_USERNAME,
      displayName: 'Tài khoản hệ thống',
      authSource: 'env',
      isActive: true,
      createdAt: null,
    })
  }

  return users
}

export async function createDatabaseAdminUser(input: {
  username: string
  displayName?: string
  password: string
}) {
  const username = normalizeUsername(input.username)
  const displayName = input.displayName?.trim() || ''
  const passwordHash = await bcrypt.hash(input.password, 10)

  const result = await queryAdminDb<{
    id: string
    username: string
    display_name: string | null
    is_active: boolean
    created_at: string | null
  }>(
    `
      INSERT INTO public.admin_users (username, display_name, password_hash, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING id, username, display_name, is_active, created_at
    `,
    [username, displayName, passwordHash]
  )

  const data = result.rows[0]

  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name || null,
    authSource: 'database' as const,
    isActive: data.is_active,
    createdAt: data.created_at || null,
  }
}

export async function changeAdminPassword(session: AdminSession, currentPassword: string, newPassword: string) {
  if (session.authSource === 'database' && session.userId) {
    const databaseUser = await getDatabaseAdminByUsername(session.username)
    if (!databaseUser || databaseUser.id !== session.userId) {
      throw new Error('Tài khoản hiện tại không còn tồn tại trong hệ thống.')
    }

    const valid = await bcrypt.compare(currentPassword, databaseUser.password_hash)
    if (!valid) {
      throw new Error('Mật khẩu hiện tại không chính xác.')
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await queryAdminDb(
      `
        UPDATE public.admin_users
        SET password_hash = $2
        WHERE id = $1
      `,
      [databaseUser.id, passwordHash]
    )

    return {
      role: 'admin' as const,
      userId: databaseUser.id,
      username: databaseUser.username,
      displayName: databaseUser.display_name || null,
      authSource: 'database' as const,
    }
  }

  const validEnvPassword = await verifyEnvCredentials(session.username, currentPassword)
  if (!validEnvPassword) {
    throw new Error('Mật khẩu hiện tại không chính xác.')
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)
  const existingUser = await getDatabaseAdminByUsername(session.username)

  if (existingUser) {
    await queryAdminDb(
      `
        UPDATE public.admin_users
        SET password_hash = $2
        WHERE id = $1
      `,
      [existingUser.id, passwordHash]
    )

    return {
      role: 'admin' as const,
      userId: existingUser.id,
      username: existingUser.username,
      displayName: existingUser.display_name || null,
      authSource: 'database' as const,
    }
  }

  const result = await queryAdminDb<{
    id: string
    username: string
    display_name: string | null
  }>(
    `
      INSERT INTO public.admin_users (username, display_name, password_hash, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING id, username, display_name
    `,
    [session.username, session.displayName || 'Quản trị viên', passwordHash]
  )

  const data = result.rows[0]

  return {
    role: 'admin' as const,
    userId: data.id,
    username: data.username,
    displayName: data.display_name || null,
    authSource: 'database' as const,
  }
}

export function validateUsername(username: string) {
  const normalized = normalizeUsername(username)
  if (!normalized) return 'Tên đăng nhập không được để trống.'
  if (!/^[a-z0-9._-]{3,32}$/.test(normalized)) {
    return 'Tên đăng nhập chỉ gồm chữ thường, số, dấu chấm, gạch dưới hoặc gạch ngang (3-32 ký tự).'
  }
  return ''
}

export function validatePassword(password: string) {
  if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.'
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Mật khẩu cần có cả chữ và số.'
  }
  return ''
}

export { COOKIE_NAME, ENV_ADMIN_USERNAME }
