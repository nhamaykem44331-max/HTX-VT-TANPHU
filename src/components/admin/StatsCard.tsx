import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  href: string
  color: string // Tailwind color name e.g. 'blue', 'green', 'purple', 'amber', 'red'
}

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  blue:   { bg: '#EFF6FF', icon: '#3B82F6', badge: '#DBEAFE' },
  green:  { bg: '#F0FDF4', icon: '#22C55E', badge: '#DCFCE7' },
  purple: { bg: '#FAF5FF', icon: '#A855F7', badge: '#F3E8FF' },
  amber:  { bg: '#FFFBEB', icon: '#F59E0B', badge: '#FEF3C7' },
  red:    { bg: '#FFF1F2', icon: '#EF4444', badge: '#FFE4E6' },
  orange: { bg: '#FFF7ED', icon: '#F97316', badge: '#FFEDD5' },
}

export default function StatsCard({ title, value, icon: Icon, href, color }: StatsCardProps) {
  const colors = colorMap[color] ?? colorMap['blue']

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: colors.bg }}
      >
        <Icon size={24} style={{ color: colors.icon }} />
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString('vi-VN')}</p>

      {/* Title */}
      <p className="text-sm text-gray-500 mb-4">{title}</p>

      {/* Link */}
      <Link
        href={href}
        className="text-xs font-semibold transition-colors"
        style={{ color: colors.icon }}
      >
        Xem →
      </Link>
    </div>
  )
}
