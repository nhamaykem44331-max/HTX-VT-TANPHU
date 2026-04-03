# HTX Vận tải Ô tô Tân Phú — Website

Website chính thức của HTX Vận tải Ô tô Tân Phú (Thái Nguyên).

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS + CSS Variables
- **Fonts**: Montserrat (heading) + Open Sans (body)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

## Cài đặt & Chạy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Cấu trúc trang

| Đường dẫn | Mô tả |
|---|---|
| `/` | Trang chủ (9 sections) |
| `/gioi-thieu` | Giới thiệu, lịch sử, ban lãnh đạo |
| `/linh-vuc` | Tổng quan 8 lĩnh vực |
| `/linh-vuc/[slug]` | Chi tiết từng lĩnh vực |
| `/nang-luc` | Năng lực & Thiết bị |
| `/tin-tuc` | Danh sách tin tức |
| `/tin-tuc/[slug]` | Chi tiết bài viết |
| `/tuyen-dung` | Tuyển dụng + form ứng tuyển |
| `/lien-he` | Liên hệ + bản đồ |

## Thay ảnh thật

Thay thế các `ImagePlaceholder` bằng `next/image`:

```tsx
// Trước
<ImagePlaceholder label="Tên ảnh" />

// Sau
<Image src="/images/ten-anh.jpg" alt="Mô tả" fill className="object-cover" />
```

Đặt ảnh vào thư mục `public/images/`.

## Triển khai lên Vercel

```bash
npm run build
vercel deploy
```

## Liên hệ

- Website: htxtanphu.com
- Hotline: 0208.383.2608
- Email: info@htxtanphu.com

## Deploy Checklist

Xem file `DEPLOY_CHECKLIST.md` de lam dung quy trinh deploy cho du an nay.
