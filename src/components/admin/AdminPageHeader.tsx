'use client'

import { ExternalLink, Save } from 'lucide-react'

/**
 * Tiêu đề chuẩn cho mọi trang admin: tên trang, mô tả ngắn,
 * link mở trang tương ứng trên website và nút lưu (nếu trang có nội dung cần lưu).
 */
export default function AdminPageHeader({
  title,
  description,
  viewUrl,
  onSave,
  saving,
  saveLabel = 'Lưu thay đổi',
}: {
  title: string
  description?: string
  viewUrl?: string
  onSave?: () => void
  saving?: boolean
  saveLabel?: string
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-bold text-gray-900">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-gray-500">{description}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {viewUrl ? (
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ExternalLink size={15} />
            Xem trên web
          </a>
        ) : null}

        {onSave ? (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Đang lưu...' : saveLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
