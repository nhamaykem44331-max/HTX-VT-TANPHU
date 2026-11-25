import { NextResponse } from 'next/server'

/**
 * Lỗi có thông điệp viết sẵn cho người dùng (vd "Mật khẩu hiện tại không chính xác.").
 * Chỉ loại lỗi này mới được hiện nguyên văn lên trình duyệt.
 */
export class UserFacingError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message)
    this.name = 'UserFacingError'
  }
}

/**
 * Trả lỗi về trình duyệt mà không lộ lỗi gốc (Postgres, SMTP, biến môi trường...).
 * Lỗi gốc chỉ ghi vào runtime log của Vercel.
 */
export function apiErrorResponse(
  scope: string,
  error: unknown,
  fallbackMessage: string,
  extra: Record<string, unknown> = {}
) {
  if (error instanceof UserFacingError) {
    return NextResponse.json({ ...extra, error: error.message }, { status: error.status })
  }

  console.error(`[${scope}]`, error)
  return NextResponse.json({ ...extra, error: fallbackMessage }, { status: 500 })
}
