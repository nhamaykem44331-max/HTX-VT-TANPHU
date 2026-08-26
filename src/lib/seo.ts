/**
 * Hằng số SEO / chia sẻ mạng xã hội dùng chung.
 *
 * Trước đây mỗi trang tự khai báo lại kích thước ảnh og là 945x945 — con số
 * này lấy từ file og-image cũ. Khi ảnh đổi kích thước thì mọi trang đều sai,
 * và Zalo/Facebook dựng khung xem trước theo số khai báo nên ảnh không hiện.
 * Khai báo một chỗ để không lặp lại lỗi đó.
 */

/**
 * Tên miền phục vụ thật. Bản ghi gốc htxtanphu.com đang chuyển hướng sang www,
 * nên canonical và og:url phải trỏ vào www — nếu trỏ vào bản ghi gốc thì trình
 * đọc liên kết phải đi thêm một chặng chuyển hướng, có bộ đọc bỏ cuộc giữa chừng.
 */
export const SITE_URL = 'https://www.htxtanphu.com'

/** Ảnh mặc định khi trang không có ảnh riêng. Đúng tỉ lệ 1.91:1 mà OG khuyến nghị. */
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'HTX Vận tải Ô tô Tân Phú',
} as const

/** Ghép đường dẫn tương đối vào tên miền chuẩn. */
export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
