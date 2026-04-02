// @tailwind-design-system: component uses design tokens from tailwind.config.ts,
// variants via props not ad-hoc utilities, clsx for conditional composition.
import { clsx } from 'clsx'

type StatusVariant =
  | 'new'         // Mới — đỏ
  | 'read'        // Đã đọc — xám
  | 'replied'     // Đã trả lời — xanh lá
  | 'archived'    // Lưu trữ — xám nhạt
  | 'published'   // Đã đăng — xanh lá
  | 'draft'       // Nháp — vàng
  | 'active'      // Đang tuyển — xanh lá
  | 'expired'     // Hết hạn — đỏ
  | 'featured'    // Nổi bật — cam
  | 'fulltime'    // Full-time — xanh dương
  | 'parttime'    // Part-time — tím
  | 'contract'    // Hợp đồng — cam nhạt

type StatusSize = 'sm' | 'md' | 'lg'

interface StatusBadgeProps {
  variant: StatusVariant
  label?: string              // custom label, defaults to Vietnamese display name
  size?: StatusSize
  className?: string
}

// Design tokens: color pairs mapped to brand palette
const VARIANT_STYLES: Record<StatusVariant, string> = {
  new:       'bg-red-100 text-red-700 border border-red-200',
  read:      'bg-gray-100 text-gray-600 border border-gray-200',
  replied:   'bg-teal-100 text-teal-700 border border-teal-200',
  archived:  'bg-gray-50 text-gray-400 border border-gray-100',
  published: 'bg-teal-100 text-teal-700 border border-teal-200',
  draft:     'bg-amber-100 text-amber-700 border border-amber-200',
  active:    'bg-teal-100 text-teal-700 border border-teal-200',
  expired:   'bg-red-100 text-red-600 border border-red-200',
  featured:  'bg-orange-100 text-orange-700 border border-orange-200',
  fulltime:  'bg-blue-100 text-blue-700 border border-blue-200',
  parttime:  'bg-purple-100 text-purple-700 border border-purple-200',
  contract:  'bg-amber-100 text-amber-700 border border-amber-200',
}

// DEFAULT labels (Tiếng Việt)
const VARIANT_LABELS: Record<StatusVariant, string> = {
  new:       'Mới',
  read:      'Đã đọc',
  replied:   'Đã trả lời',
  archived:  'Lưu trữ',
  published: 'Đã đăng',
  draft:     'Nháp',
  active:    'Đang tuyển',
  expired:   'Hết hạn',
  featured:  'Nổi bật',
  fulltime:  'Toàn thời gian',
  parttime:  'Bán thời gian',
  contract:  'Hợp đồng',
}

const SIZE_STYLES: Record<StatusSize, string> = {
  sm: 'text-xs px-2 py-0.5 rounded',
  md: 'text-xs px-2.5 py-1 rounded-md',
  lg: 'text-sm px-3 py-1.5 rounded-md',
}

export default function StatusBadge({
  variant,
  label,
  size = 'md',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold font-body',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      )}
    >
      {label ?? VARIANT_LABELS[variant]}
    </span>
  )
}

// Convenience helper: map DB status strings to badge variant
export function jobTypeToVariant(type: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    'full-time':  'fulltime',
    'part-time':  'parttime',
    'contract':   'contract',
  }
  return map[type] ?? 'contract'
}

export function contactStatusToVariant(status: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    new:      'new',
    read:     'read',
    replied:  'replied',
    archived: 'archived',
  }
  return map[status] ?? 'read'
}
