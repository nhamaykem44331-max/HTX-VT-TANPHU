'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, ExternalLink } from 'lucide-react'

/** Tên hiển thị cho từng nhánh đường dẫn admin. */
const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Tổng quan',
  'trang-chu': 'Trang chủ',
  'gioi-thieu': 'Giới thiệu',
  'linh-vuc': 'Lĩnh vực',
  'nang-luc': 'Năng lực',
  'tin-tuc': 'Tin tức',
  'tuyen-dung': 'Tuyển dụng',
  'lien-he': 'Liên hệ',
  media: 'Thư viện ảnh',
  'doi-tac': 'Đối tác',
  'hop-thu': 'Form liên hệ',
  'ho-so-ung-tuyen': 'Hồ sơ ứng tuyển',
  'cai-dat': 'Cài đặt',
  them: 'Thêm mới',
}

export default function AdminTopBar() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const crumbs = segments.map((segment, index) => ({
    label: SEGMENT_LABELS[segment] ?? 'Chi tiết',
    href: '/' + segments.slice(0, index + 1).join('/'),
    isLast: index === segments.length - 1,
  }))

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur lg:px-6">
      {/* Chừa chỗ cho nút mở menu trên màn hình nhỏ */}
      <nav aria-label="Đường dẫn" className="flex min-w-0 items-center gap-1 pl-12 text-sm lg:pl-0">
        {crumbs.map((crumb) => (
          <span key={crumb.href} className="flex min-w-0 items-center gap-1">
            {crumb.isLast ? (
              <span className="truncate font-semibold text-gray-900">{crumb.label}</span>
            ) : (
              <>
                <Link href={crumb.href} className="shrink-0 text-gray-500 hover:text-orange-600">
                  {crumb.label}
                </Link>
                <ChevronRight size={14} className="shrink-0 text-gray-300" />
              </>
            )}
          </span>
        ))}
      </nav>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-600 sm:inline-flex"
      >
        <ExternalLink size={14} />
        Xem website
      </a>
    </header>
  )
}
