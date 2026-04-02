import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'htx-admin-token'
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'

// Edge-compatible JWT verify using jose (Web Crypto API)
async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Set x-pathname header cho mọi request (dùng trong layouts)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Chỉ check auth cho /admin/* (trừ /admin/login và /api/auth/*)
  const isAdminPath = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const isApiAuth = pathname.startsWith('/api/auth')

  if (isAdminPath && !isApiAuth) {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    const valid = await verifyTokenEdge(token)
    if (!valid) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
