/**
 * Các đường dẫn dưới /admin không cần đăng nhập.
 * Dùng chung cho middleware (Edge) và layout admin, nên file này
 * không được import bất kỳ thư viện Node nào.
 */
export const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/quen-mat-khau',
  '/admin/dat-lai-mat-khau',
] as const

export function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}
