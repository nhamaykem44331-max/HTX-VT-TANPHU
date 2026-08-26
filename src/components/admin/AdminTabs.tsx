'use client'

import type { LucideIcon } from 'lucide-react'

export interface AdminTabItem {
  id: string
  label: string
  icon?: LucideIcon
  hint?: string
}

/**
 * Thanh tab ngang dùng chung cho các trang admin.
 * Cuộn ngang được trên màn hình hẹp để không vỡ bố cục trên máy tính bảng.
 */
export default function AdminTabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: AdminTabItem[]
  activeId: string
  onChange: (id: string) => void
}) {
  const active = tabs.find((tab) => tab.id === activeId)

  return (
    <div className="space-y-2">
      <div
        role="tablist"
        aria-label="Các phần của trang"
        className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {Icon ? <Icon size={16} /> : null}
              {tab.label}
            </button>
          )
        })}
      </div>

      {active?.hint ? <p className="px-1 text-sm text-gray-500">{active.hint}</p> : null}
    </div>
  )
}
