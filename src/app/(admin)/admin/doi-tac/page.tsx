'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react'
import DeleteConfirm from '@/components/admin/DeleteConfirm'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/admin/ImageUploader'
import type { Partner } from '@/lib/types'

const CATEGORIES = [
  { value: 'thep', label: 'Thép' },
  { value: 'hang-khong', label: 'Hàng không' },
  { value: 'ngan-hang', label: 'Ngân hàng' },
  { value: 'cong-nghiep', label: 'Công nghiệp' },
  { value: 'khu-cong-nghiep', label: 'Khu công nghiệp' },
  { value: 'to-chuc', label: 'Tổ chức' },
  { value: 'co-quan', label: 'Cơ quan nhà nước' },
  { value: 'cong-nghe', label: 'Công nghệ' },
]

export default function PartnersAdminPage() {
  const [data, setData] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  
  // Create form state
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].value)
  const [newOrder, setNewOrder] = useState('0')
  const [newLogo, setNewLogo] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editOrder, setEditOrder] = useState('0')
  const [editLogo, setEditLogo] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete state
  const [deleteItem, setDeleteItem] = useState<Partner | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: dbData, error } = await supabase
        .from('partners')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error || !dbData || dbData.length === 0) throw new Error('No data')
      setData(dbData as any[])
    } catch {
      const { partners } = await import('@/data/partners')
      setData(partners)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setIsCreating(true)
    try {
      const { error } = await supabase.from('partners').insert({
        name: newName,
        category: newCategory,
        sort_order: parseInt(newOrder) || 0,
        logo: newLogo
      })
      if (error) throw error
      // reset form
      setNewName('')
      setNewOrder('0')
      setNewLogo('')
      await fetchData()
    } catch (err: any) {
      alert('Thêm thất bại: ' + err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const startEdit = (partner: Partner) => {
    setEditingId(partner.id)
    setEditName(partner.name)
    setEditCategory(partner.category)
    setEditOrder((partner as any).sort_order?.toString() || '0')
    setEditLogo(partner.logo || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from('partners').update({
        name: editName,
        category: editCategory,
        sort_order: parseInt(editOrder) || 0,
        logo: editLogo
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
      const { error } = await supabase.from('partners').delete().eq('id', deleteItem.id)
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
      <h1 className="font-heading text-2xl font-bold text-gray-900">Quản lý Đối tác</h1>

      {/* TẠO MỚI */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Thêm đối tác mới</h2>
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Tên đối tác</label>
            <input
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              placeholder="VD: Samsung..."
            />
          </div>
          <div className="w-full md:w-[200px] flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Danh mục</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="w-full md:w-[100px] flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Thứ tự</label>
            <input
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-full md:w-[150px] flex flex-col gap-1.5">
            <ImageUploader
              value={newLogo}
              onChange={setNewLogo}
              folder="logos"
              aspectRatio="square"
              label="Logo"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 font-semibold text-sm transition-colors flex items-center justify-center gap-1 min-w-[100px] h-[38px]"
          >
            {isCreating ? 'Đang thêm...' : <><Plus size={16} /> Thêm</>}
          </button>
        </form>
      </div>

      {/* DANH SÁCH */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên đối tác</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[200px]">Danh mục</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[100px]">Thứ tự</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Chưa có đối tác nào.</td></tr>
            ) : data.map((item) => {
              const isEditing = editingId === item.id
              const catLabel = CATEGORIES.find(c => c.value === item.category)?.label || item.category

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                        />
                        <ImageUploader 
                          value={editLogo}
                          onChange={setEditLogo}
                          folder="logos"
                          aspectRatio="square"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {item.logo && (
                          <div className="w-8 h-8 rounded shrink-0 bg-gray-50 border border-gray-100 p-1 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {isEditing ? (
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                      >
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{catLabel}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(e.target.value)}
                        className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      (item as any).sort_order || 0
                    )}
                  </td>
                  <td className="px-6 py-3 text-right space-x-1 whitespace-nowrap">
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
        title="Xóa đối tác?"
        message={`Bạn có chắc muốn xóa đối tác "${deleteItem?.name}"?`}
        loading={isDeleting}
      />
    </div>
  )
}
