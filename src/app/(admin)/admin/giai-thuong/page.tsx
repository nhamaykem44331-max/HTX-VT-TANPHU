'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react'
import DeleteConfirm from '@/components/admin/DeleteConfirm'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/admin/ImageUploader'
import type { Award } from '@/lib/types'

export default function AwardsAdminPage() {
  const [data, setData] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)
  
  // Create form state
  const [newTitle, setNewTitle] = useState('')
  const [newIssuer, setNewIssuer] = useState('')
  const [newYear, setNewYear] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newImage, setNewImage] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editIssuer, setEditIssuer] = useState('')
  const [editYear, setEditYear] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editImage, setEditImage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete state
  const [deleteItem, setDeleteItem] = useState<Award | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: dbData, error } = await supabase
        .from('awards')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error || !dbData || dbData.length === 0) throw new Error('No data')
      setData(dbData as any[])
    } catch {
      const { awards } = await import('@/data/awards')
      setData(awards)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setIsCreating(true)
    try {
      const { error } = await supabase.from('awards').insert({
        title: newTitle,
        issuer: newIssuer,
        year: newYear,
        description: newDesc,
        image: newImage,
      })
      if (error) throw error
      // reset form
      setNewTitle('')
      setNewIssuer('')
      setNewYear('')
      setNewDesc('')
      setNewImage('')
      await fetchData()
    } catch (err: any) {
      alert('Thêm thất bại: ' + err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const startEdit = (award: Award) => {
    setEditingId(award.id)
    setEditTitle(award.title)
    setEditIssuer(award.issuer)
    setEditYear(award.year)
    setEditDesc(award.description || '')
    setEditImage(award.image || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from('awards').update({
        title: editTitle,
        issuer: editIssuer,
        year: editYear,
        description: editDesc,
        image: editImage,
      }).eq('id', id)
      
      if (error) throw error
      setEditingId(null)
      await fetchData()
    } catch (err: any) {
      alert('Lưu thất bại: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    setIsDeleting(true)
    try {
      const { error } = await supabase.from('awards').delete().eq('id', deleteItem.id)
      if (error) throw error
      setData(data.filter((d) => d.id !== deleteItem.id))
    } catch (err: any) {
      alert('Xóa thất bại: ' + err.message)
    } finally {
      setIsDeleting(false)
      setDeleteItem(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Quản lý Giải thưởng</h1>

      {/* TẠO MỚI */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Thêm giải thưởng mới</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-xs font-semibold text-gray-600">Tên giải thưởng</label>
              <input
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                placeholder="VD: Cúp vàng chất lượng..."
              />
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-gray-600">Đơn vị trao</label>
              <input
                value={newIssuer}
                onChange={(e) => setNewIssuer(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-1">
              <label className="text-xs font-semibold text-gray-600">Năm</label>
              <input
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-1">
              <ImageUploader
                value={newImage}
                onChange={setNewImage}
                folder="awards"
                aspectRatio="square"
                label="Hình ảnh"
              />
            </div>
          </div>
          <div className="flex gap-4 items-end">
             <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Mô tả (tuỳ chọn)</label>
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 font-semibold text-sm transition-colors flex items-center justify-center gap-1 min-w-[120px] h-[38px]"
            >
              {isCreating ? 'Đang thêm...' : <><Plus size={16} /> Thêm</>}
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên giải thưởng</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">Đơn vị</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[100px]">Năm</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Chưa có giải thưởng nào.</td></tr>
            ) : data.map((item) => {
              const isEditing = editingId === item.id

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                          placeholder="Tên giải"
                        />
                        <input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 text-gray-500"
                          placeholder="Mô tả..."
                        />
                        <div className="mt-2 text-left">
                          <ImageUploader
                            value={editImage}
                            onChange={setEditImage}
                            folder="awards"
                            aspectRatio="square"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{item.title}</span>
                        {item.description && <span className="text-xs text-gray-500 mt-1">{item.description}</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <input
                        value={editIssuer}
                        onChange={(e) => setEditIssuer(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{item.issuer}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {isEditing ? (
                      <input
                        value={editYear}
                        onChange={(e) => setEditYear(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      item.year
                    )}
                  </td>
                  <td className="px-6 py-3 text-right space-x-1 whitespace-nowrap align-top">
                    {isEditing ? (
                      <>
                        <button onClick={cancelEdit} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors inline-flex" title="Hủy">
                          <X size={16} />
                        </button>
                        <button disabled={isSaving} onClick={() => saveEdit(item.id)} className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors inline-flex" title="Lưu">
                          <Check size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex" title="Sửa">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteItem(item)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors inline-flex" title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <DeleteConfirm
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Xóa giải thưởng?"
        message={`Bạn có chắc muốn xóa giải thưởng "${deleteItem?.title}"?`}
        loading={isDeleting}
      />
    </div>
  )
}
