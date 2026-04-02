'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react'
import DeleteConfirm from '@/components/admin/DeleteConfirm'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/admin/ImageUploader'

interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  sort_order?: number;
}

export default function EquipmentsAdminPage() {
  const [data, setData] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  
  // Create form state
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('Xe tải')
  const [newDesc, setNewDesc] = useState('')
  const [newImage, setNewImage] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCat, setEditCat] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editImage, setEditImage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete state
  const [deleteItem, setDeleteItem] = useState<Equipment | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const categories = ["Xe tải", "Cần cẩu", "Kho bãi", "Công nghệ"]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: dbData, error } = await supabase
        .from('equipments')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error || !dbData || dbData.length === 0) throw new Error('No data')
      setData(dbData as any[])
    } catch {
      const { getEquipments } = await import('@/lib/data-service')
      const mockData = await getEquipments()
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setIsCreating(true)
    try {
      const { error } = await supabase.from('equipments').insert({
        name: newName,
        category: newCat,
        description: newDesc,
        image: newImage,
      })
      if (error) throw error
      // reset form
      setNewName('')
      setNewDesc('')
      setNewImage('')
      await fetchData()
    } catch (err: any) {
      alert('Thêm thất bại: ' + err.message)
    } finally {
      setIsCreating(false)
    }
  }

  const startEdit = (equip: Equipment) => {
    setEditingId(equip.id)
    setEditName(equip.name)
    setEditCat(equip.category)
    setEditDesc(equip.description || '')
    setEditImage(equip.image || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from('equipments').update({
        name: editName,
        category: editCat,
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
      const { error } = await supabase.from('equipments').delete().eq('id', deleteItem.id)
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
      <h1 className="font-heading text-2xl font-bold text-gray-900">Quản lý Thiết bị & Năng lực</h1>

      {/* TẠO MỚI */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Thêm thiết bị mới</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên thiết bị *</label>
              <input
                required
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="VD: Xe tải 40 tấn Hyundai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
              <select
                required
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn gọn</label>
             <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="VD: Trọng tải 40 tấn, trang bị GPS Vietmap"
             />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (Upload)</label>
            <div className="border border-gray-200 rounded-lg p-2 bg-gray-50/50">
              <ImageUploader 
                value={newImage} 
                onChange={setNewImage} 
                folder="equipment"
                aspectRatio="video"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
            >
              {isCreating ? 'Đang lưu...' : <><Plus size={16} /> Thêm thiết bị</>}
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có thiết bị nào.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                {editingId === item.id ? (
                  // EDIT MODE
                  <div className="space-y-4 bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Tên thiết bị</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Danh mục</label>
                        <select
                          value={editCat}
                          onChange={(e) => setEditCat(e.target.value)}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                        >
                           {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                      <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ảnh (Upload)</label>
                      <div className="bg-white rounded border border-gray-200 p-2">
                        <ImageUploader 
                          value={editImage} 
                          onChange={setEditImage} 
                          folder="equipment"
                          aspectRatio="video"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1"
                      >
                        <X size={14} /> Hủy
                      </button>
                      <button
                        onClick={() => saveEdit(item.id)}
                        disabled={isSaving}
                        className="px-3 py-1.5 text-sm bg-orange-500 text-white hover:bg-orange-600 rounded flex items-center gap-1"
                      >
                        <Check size={14} /> {isSaving ? 'Lưu...' : 'Lưu lại'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Không ảnh</div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate flex items-center gap-2">
                         {item.name}
                         <span className="text-[10px] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 tracking-wider font-bold uppercase">{item.category}</span>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto mt-2 sm:mt-0">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteItem(item)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirm
        open={!!deleteItem}
        title="Xóa thiết bị"
        message={`Bạn có chắc muốn xóa "${deleteItem?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteItem(null)}
        loading={isDeleting}
      />
    </div>
  )
}
