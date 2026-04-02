'use client'

import { useState, useEffect } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/admin/ImageUploader'

export default function FieldsAdminPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // States cho Form
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [editShortDesc, setEditShortDesc] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editImage, setEditImage] = useState('')
  const [editStatsStr, setEditStatsStr] = useState('')
  const [editFeaturesStr, setEditFeaturesStr] = useState('')
  const [editServicesStr, setEditServicesStr] = useState('')

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: dbData, error } = await supabase
        .from('fields')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error || !dbData || dbData.length === 0) throw new Error('No data')
      setData(dbData)
    } catch {
      const { getFields } = await import('@/lib/data-service')
      const mockData = await getFields()
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (field: any) => {
    setEditingId(field.id)
    setEditName(field.name || '')
    setEditSlug(field.slug || field.id)
    setEditIcon(field.icon || '')
    setEditShortDesc(field.short_desc || field.shortDesc || '')
    setEditDesc(field.description || '')
    setEditImage(field.image || '')
    
    // Arrays -> Strings
    const s1 = field.stats ? JSON.stringify(field.stats) : '[]'
    setEditStatsStr(s1)
    
    // Convert arrays of strings to newline separated strings for easier editing
    setEditFeaturesStr((field.features || []).join('\n'))
    setEditServicesStr((field.services || []).join('\n'))
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    setIsSaving(true)
    
    try {
      // Parse arrays back from strings
      let stats = []
      try { stats = JSON.parse(editStatsStr) } catch(e) {}
      
      const features = editFeaturesStr.split('\n').map(s => s.trim()).filter(Boolean)
      const services = editServicesStr.split('\n').map(s => s.trim()).filter(Boolean)

      const updateData = {
        name: editName,
        slug: editSlug,
        icon: editIcon,
        short_desc: editShortDesc, // DB uses snake_case, mapFieldFromDB outputs camelCase but Supabase update needs DB columns
        description: editDesc,
        image: editImage,
        stats,
        features,
        services,
      }

      const { error } = await supabase.from('fields').update(updateData).eq('id', id)
      if (error) throw error
      
      setEditingId(null)
      await fetchData()
    } catch (err: any) {
      alert('Lưu thất bại: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Quản lý Ngành nghề / Lĩnh vực</h1>
      <p className="text-gray-500 text-sm">Danh sách 8 ngành nghề đang hoạt động (Hiển thị trang chủ và chi tiết).</p>

      {/* DANH SÁCH */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có dữ liệu ngành nghề.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                {editingId === item.id ? (
                  // EDIT MODE
                  <div className="space-y-4 bg-orange-50/50 p-5 rounded-lg border border-orange-200">
                    <h3 className="font-bold text-orange-800 text-sm uppercase">Sửa: {item.name || item.slug}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tên lĩnh vực *</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Slug (Đường dẫn) *</label>
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tên icon (từ Lucide) *</label>
                        <input
                          type="text"
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả ngắn (Trang chủ)</label>
                         <textarea
                            value={editShortDesc}
                            onChange={(e) => setEditShortDesc(e.target.value)}
                            rows={2}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả chi tiết</label>
                         <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            rows={2}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Điểm nổi bật (FEATURES) - mỗi dòng 1 mục</label>
                        <textarea
                          value={editFeaturesStr}
                          onChange={(e) => setEditFeaturesStr(e.target.value)}
                          rows={4}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none font-mono"
                          placeholder="Điểm 1\nĐiểm 2..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Dịch vụ (SERVICES) - mỗi dòng 1 mục</label>
                        <textarea
                          value={editServicesStr}
                          onChange={(e) => setEditServicesStr(e.target.value)}
                          rows={4}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none font-mono"
                          placeholder="Dịch vụ A\nDịch vụ B..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Các chỉ số (STATS) - JSON thuần</label>
                        <textarea
                          value={editStatsStr}
                          onChange={(e) => setEditStatsStr(e.target.value)}
                          rows={4}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Ảnh đại diện ngách (Upload)</label>
                      <div className="bg-white rounded border border-gray-200 p-2">
                        <ImageUploader 
                          value={editImage} 
                          onChange={setEditImage} 
                          folder="fields"
                          aspectRatio="video"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-orange-200">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg flex items-center gap-1"
                      >
                        <X size={16} /> Hủy sửa
                      </button>
                      <button
                        onClick={() => saveEdit(item.id)}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-semibold bg-orange-600 text-white hover:bg-orange-700 rounded-lg flex items-center gap-2 shadow-sm"
                      >
                        <Check size={16} /> {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full md:w-48 aspect-video bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                      {(item.image) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Chưa có ảnh</div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-3">
                           <h3 className="font-bold text-gray-900 text-lg">{item.name || item.slug}</h3>
                           <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-mono">/{item.slug}</span>
                           <span className="text-[10px] bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">Icon: {item.icon}</span>
                        </div>
                        <p className="text-sm font-semibold text-orange-600 mt-1">{item.short_desc || item.shortDesc}</p>
                        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{item.description}</p>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                         <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">{item.features?.length || 0} features</span>
                         <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">{item.services?.length || 0} services</span>
                         <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">{item.stats?.length || 0} stats</span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4 mt-3 md:mt-0 w-full md:w-auto flex md:flex-col justify-end gap-2">
                       {/* Chỉ có SỬA, không xóa vì Fields là tĩnh 8 cái mặc định cho website HTX */}
                      <button
                        onClick={() => startEdit(item)}
                        className="btn-outline w-full text-sm py-1.5 px-3 flex justify-center items-center gap-1.5"
                      >
                        <Pencil size={14} /> Chỉnh sửa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
