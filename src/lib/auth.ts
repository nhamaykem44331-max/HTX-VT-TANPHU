import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
const COOKIE_NAME = 'htx-admin-token'

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME || 'admin'
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || ''
  if (username !== validUsername) return false
  if (!passwordHash) return password === 'admin123' // Dev fallback
  return bcrypt.compare(password, passwordHash)
}

// Tạo JWT token — dùng HS256 (default của jsonwebtoken)
// Middleware verify bằng jose với cùng secret, cùng algorithm HS256
export function createToken(): string {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  })
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return false
    return verifyToken(token)
  } catch {
    return false
  }
}

export { COOKIE_NAME }
