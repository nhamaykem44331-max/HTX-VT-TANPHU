'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  FileText,
  Inbox,
  Mail,
  Phone,
  Search,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export interface JobApplication {
  id: string
  job_id: string | null
  job_title: string
  job_department: string
  full_name: string
  phone: string
  email: string
  cover_letter: string
  cv_path: string
  cv_file_name: string
  status: 'new' | 'reviewing' | 'contacted' | 'rejected' | 'hired'
  note: string
  created_at: string
}

const STATUSES: Array<{
  id: JobApplication['status']
  label: string
  chip: string
}> = [
  { id: 'new', label: 'Mới', chip: 'bg-red-50 text-red-600 border-red-200' },
  { id: 'reviewing', label: 'Đang xem', chip: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'contacted', label: 'Đã liên hệ', chip: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'hired', label: 'Đã nhận', chip: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'rejected', label: 'Từ chối', chip: 'bg-gray-100 text-gray-600 border-gray-200' },
]

const statusOf = (id: string) => STATUSES.find((s) => s.id === id) ?? STATUSES[0]

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ApplicationsInbox() {
  const [items, setItems] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState<'all' | JobApplication['status']>('all')
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState<JobApplication | null>(null)

  const load = async () => {
    setLoading(true)
    setLoadError('')

    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      // Bảng chưa tạo thì báo rõ thay vì hiện danh sách rỗng gây hiểu nhầm.
      setLoadError(
        error.message?.includes('job_applications')
          ? 'Chưa có bảng job_applications. Cần chạy file supabase-job-applications-migration.sql trên Supabase trước.'
          : error.message || 'Không tải được danh sách hồ sơ.'
      )
      setItems([])
    } else {
      setItems((data as JobApplication[]) ?? [])
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, status: JobApplication['status']) => {
    const previous = items
    setItems((list) => list.map((it) => (it.id === id ? { ...it, status } : it)))
    setSelected((cur) => (cur && cur.id === id ? { ...cur, status } : cur))

    const { error } = await supabase.from('job_applications').update({ status }).eq('id', id)

    if (error) {
      setItems(previous)
      setLoadError('Không đổi được trạng thái. Vui lòng thử lại.')
    }
  }

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s.id] = items.filter((it) => it.status === s.id).length
    return acc
  }, {})

  const visible = items.filter((it) => {
    if (filter !== 'all' && it.status !== filter) return false
    if (!keyword.trim()) return true

    const q = keyword.toLowerCase()
    return (
      it.full_name.toLowerCase().includes(q) ||
      it.phone.includes(q) ||
      it.email.toLowerCase().includes(q) ||
      it.job_title.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-5">
      {loadError ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <p>{loadError}</p>
        </div>
      ) : null}

      {/* Bộ lọc + tìm kiếm */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
              filter === 'all' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tất cả ({items.length})
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilter(s.id)}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                filter === s.id ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s.label} ({counts[s.id] ?? 0})
            </button>
          ))}
        </div>

        <div className="relative lg:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm tên, điện thoại, vị trí..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-orange-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Danh sách */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-5 py-12 text-center text-sm text-gray-400">Đang tải hồ sơ...</p>
        ) : visible.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Inbox size={30} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">
              {items.length === 0
                ? 'Chưa có hồ sơ ứng tuyển nào.'
                : 'Không có hồ sơ khớp bộ lọc.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((item) => {
              const status = statusOf(item.status)
              return (
                <li key={item.id} className="px-5 py-4 transition-colors hover:bg-gray-50">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading font-bold text-gray-900">{item.full_name}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${status.chip}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-orange-600">{item.job_title}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Phone size={12} /> {item.phone}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Mail size={12} /> {item.email}
                        </span>
                        <span>{formatDateTime(item.created_at)}</span>
                      </p>
                    </button>

                    <div className="flex shrink-0 items-center gap-2">
                      {item.cv_path ? (
                        <a
                          href={`/api/applications/cv?path=${encodeURIComponent(item.cv_path)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <FileText size={13} />
                          Xem CV
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Không có CV</span>
                      )}

                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateStatus(item.id, e.target.value as JobApplication['status'])
                        }
                        className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:border-orange-400 focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Chi tiết */}
      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Đóng"
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <h2 className="font-heading text-xl font-bold text-gray-900">{selected.full_name}</h2>
            <p className="mt-0.5 font-semibold text-orange-600">{selected.job_title}</p>
            {selected.job_department ? (
              <p className="text-sm text-gray-500">{selected.job_department}</p>
            ) : null}

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-gray-500">Điện thoại</dt>
                <dd>
                  <a href={`tel:${selected.phone}`} className="text-gray-900 hover:text-orange-600">
                    {selected.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-gray-500">Email</dt>
                <dd>
                  <a href={`mailto:${selected.email}`} className="text-gray-900 hover:text-orange-600">
                    {selected.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-gray-500">Ngày gửi</dt>
                <dd className="text-gray-900">{formatDateTime(selected.created_at)}</dd>
              </div>
              {selected.cover_letter ? (
                <div className="flex gap-3">
                  <dt className="w-28 shrink-0 font-semibold text-gray-500">Giới thiệu</dt>
                  <dd className="whitespace-pre-wrap text-gray-900">{selected.cover_letter}</dd>
                </div>
              ) : null}
            </dl>

            {selected.cv_path ? (
              <a
                href={`/api/applications/cv?path=${encodeURIComponent(selected.cv_path)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <FileText size={15} />
                Mở CV {selected.cv_file_name ? `(${selected.cv_file_name})` : ''}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
