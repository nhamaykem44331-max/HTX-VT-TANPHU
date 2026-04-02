'use client'

import { useState, useEffect } from 'react'
import { Inbox, Phone, Mail, Clock, CheckCircle2, Archive, X } from 'lucide-react'
import StatusBadge, { contactStatusToVariant } from '@/components/shared/StatusBadge'
import { supabase } from '@/lib/supabase'
import type { ContactSubmission } from '@/lib/queries'
import { clsx } from 'clsx'

type FilterTab = 'all' | 'new' | 'read' | 'replied' | 'archived'

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'new', label: 'Mới' },
  { id: 'read', label: 'Đã đọc' },
  { id: 'replied', label: 'Đã phản hồi' },
  { id: 'archived', label: 'Lưu trữ' },
]

export default function ContactsAdminPage() {
  const [data, setData] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: dbData, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error && error.code !== '42P01') throw error // ignore undefined table if not ready
      
      const mapped = (dbData || []).map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        service: row.service,
        message: row.message,
        status: row.status as ContactSubmission['status'],
        createdAt: row.created_at,
      }))
      
      setData(mapped)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error
      
      setData(prev => prev.map(c => c.id === id ? { ...c, status } : c))
      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, status } : null)
      }
    } catch (err: any) {
      alert('Không thể cập nhật trạng thái: ' + err.message)
    }
  }

  const filteredData = data.filter(c => activeTab === 'all' || c.status === activeTab)

  const getCount = (tab: FilterTab) => {
    if (tab === 'all') return data.length
    return data.filter(c => c.status === tab).length
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))] -m-6 relative overflow-hidden bg-gray-50">
      <div className={clsx("flex-1 flex flex-col p-6 transition-all duration-300", selectedContact ? "mr-[400px]" : "")}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold text-gray-900">Form liên hệ từ khách hàng</h1>
          </div>

          <div className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200 inline-flex shadow-sm">
            {TABS.map((tab) => {
              const count = getCount(tab.id)
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSelectedContact(null)
                  }}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-orange-50 text-orange-700"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {tab.label}
                  <span className={clsx(
                    "px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab.id ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                  )}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-220px)] flex flex-col">
            <div className="overflow-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Đang tải biểu mẫu...</div>
              ) : filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Inbox size={28} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Chưa có form liên hệ nào.</p>
                  <p className="text-sm text-gray-400 mt-1">Form sẽ xuất hiện ở đây khi khách hàng gửi từ website.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200 shadow-[0_1px_0_0_#e5e7eb]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Liên hệ</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Dịch vụ</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày gửi</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => {
                          setSelectedContact(item)
                          if (item.status === 'new') updateStatus(item.id, 'read')
                        }}
                        className={clsx(
                          "cursor-pointer transition-colors",
                          selectedContact?.id === item.id ? "bg-orange-50 border-orange-200" : "hover:bg-gray-50",
                          item.status === 'new' ? "bg-blue-50/30" : ""
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className={clsx("text-sm", item.status === 'new' ? "font-bold text-gray-900" : "font-medium text-gray-700")}>
                            {item.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 flex flex-col gap-0.5">
                            <span className="flex items-center gap-1.5"><Phone size={12} /> {item.phone}</span>
                            {item.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {item.email}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.service}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1.5">
                          <Clock size={14} /> 
                          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <StatusBadge variant={contactStatusToVariant(item.status)} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL PANEL SLIDE OVER */}
      <div 
        className={clsx(
          "absolute top-0 right-0 bottom-0 w-[400px] bg-white border-l border-gray-200 shadow-xl transition-transform duration-300 ease-in-out flex flex-col z-20",
          selectedContact ? "translate-x-0" : "translate-x-full"
        )}
      >
        {selectedContact && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                Chi tiết liên hệ
                <StatusBadge variant={contactStatusToVariant(selectedContact.status)} size="sm" />
              </h3>
              <button 
                onClick={() => setSelectedContact(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Thông tin khách hàng</span>
                <div className="text-lg font-bold text-gray-900 mt-1">{selectedContact.name}</div>
                
                <div className="flex gap-2 mt-3">
                  <a href={`tel:${selectedContact.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-sm rounded-lg border border-blue-200 transition-colors">
                    <Phone size={16} /> Gọi điện
                  </a>
                  {selectedContact.email && (
                    <a href={`mailto:${selectedContact.email}`} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 text-gray-700 hover:bg-gray-100 font-semibold text-sm rounded-lg border border-gray-200 transition-colors">
                      <Mail size={16} /> Gửi Email
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Dịch vụ quan tâm</span>
                  <span className="text-sm font-medium text-gray-900">{selectedContact.service}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Ngày gửi</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(selectedContact.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Số điện thoại</span>
                  <span className="text-sm font-medium text-gray-900">{selectedContact.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900">{selectedContact.email || '—'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Nội dung tin nhắn</span>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[150px]">
                  {selectedContact.message || <span className="text-gray-400 italic">Không có nội dung tin nhắn.</span>}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
              <button
                onClick={() => updateStatus(selectedContact.id, 'read')}
                disabled={selectedContact.status === 'read'}
                className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Đã đọc
              </button>
              <button
                onClick={() => updateStatus(selectedContact.id, 'replied')}
                disabled={selectedContact.status === 'replied'}
                className="flex-1 bg-teal-500 text-white py-2.5 text-sm font-semibold rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} /> Đã phản hồi
              </button>
              <button
                onClick={() => updateStatus(selectedContact.id, 'archived')}
                disabled={selectedContact.status === 'archived'}
                className="px-3 bg-white border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                title="Lưu trữ"
              >
                <Archive size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
