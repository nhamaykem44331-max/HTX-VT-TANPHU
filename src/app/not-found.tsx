import type { Metadata } from "next";
import Link from "next/link";
import { Home, Newspaper, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Không tìm thấy trang — HTX Vận tải Ô tô Tân Phú",
  robots: { index: false, follow: false },
};

/**
 * Trang 404 theo nhận diện website. Trước đây dùng trang mặc định của Next.js
 * (nền đen, chữ tiếng Anh) nên trông như site bị lỗi.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center" style={{ backgroundColor: "var(--navy)" }}>
      <div className="container-wide py-20 text-center text-white">
        <p className="font-heading text-7xl font-black text-orange-400 md:text-8xl">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold md:text-3xl">Không tìm thấy trang</h1>
        <p className="mx-auto mt-3 max-w-md text-blue-200">
          Trang bạn tìm có thể đã bị xóa, đổi địa chỉ hoặc đường dẫn không đúng.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <Home size={16} />
            Về trang chủ
          </Link>
          <Link href="/tin-tuc" className="btn-outline inline-flex items-center gap-2">
            <Newspaper size={16} />
            Xem tin tức
          </Link>
          <Link href="/lien-he" className="btn-outline inline-flex items-center gap-2">
            <Phone size={16} />
            Liên hệ
          </Link>
        </div>
      </div>
    </div>
  );
}
