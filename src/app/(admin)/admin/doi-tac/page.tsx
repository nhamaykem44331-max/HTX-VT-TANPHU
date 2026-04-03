'use client'

import { useEffect, useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import DeleteConfirm from '@/components/admin/DeleteConfirm'
import ImageUploader from '@/components/admin/ImageUploader'
import { supabase } from '@/lib/supabase'
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

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type PartnerRecord = Partner & {
  sort_order?: number
}

function isUuid(value: string) {
  return UUID_PATTERN.test(value)
}

export default function PartnersAdminPage() {
  const [data, setData] = useState<PartnerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isFallbackMode, setIsFallbackMode] = useState(false)

  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].value)
  const [newOrder, setNewOrder] = useState('0')
  const [newLogo, setNewLogo] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editOrder, setEditOrder] = useState('0')
  const [editLogo, setEditLogo] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [deleteItem, setDeleteItem] = useState<PartnerRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const getStaticPartners = async (): Promise<PartnerRecord[]> => {
    const { partners } = await import('@/data/partners')
    return partners.map((partner, index) => ({
      ...partner,
      logo: partner.logo || '',
      sort_order: index,
    }))
  }

  const fetchDatabasePartners = async (): Promise<PartnerRecord[]> => {
    const { data: dbData, error } = await supabase
      .from('partners')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return (dbData as PartnerRecord[]) || []
  }

  const seedPartnersFromStaticData = async () => {
    const staticPartners = await getStaticPartners()
    const rows = staticPartners.map((partner, index) => ({
      name: partner.name,
      logo: partner.logo || '',
      category: partner.category,
      sort_order: partner.sort_order ?? index,
    }))

    const { error } = await supabase.from('partners').insert(rows)
    if (error) throw error
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const dbPartners = await fetchDatabasePartners()

      if (dbPartners.length === 0) {
        await seedPartnersFromStaticData()
        const seededPartners = await fetchDatabasePartners()
        setData(seededPartners)
        setIsFallbackMode(false)
        return
      }

      setData(dbPartners)
      setIsFallbackMode(false)
    } catch {
      const staticPartners = await getStaticPartners()
      setData(staticPartners)
      setIsFallbackMode(true)
    } finally {
      setLoading(false)
    }
  }

  const ensureDatabaseMode = (partnerId?: string) => {
    if (isFallbackMode) {
      window.alert('Không thể lưu khi admin đang dùng dữ liệu mẫu. Vui lòng kiểm tra kết nối Supabase rồi tải lại trang.')
      return false
    }

    if (partnerId && !isUuid(partnerId)) {
      window.alert('Bản ghi đối tác này chưa được đồng bộ vào database thật. Vui lòng tải lại trang để lấy dữ liệu mới.')
      return false
    }

    return true
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newName.trim() || !ensureDatabaseMode()) return

    setIsCreating(true)
    try {
      const { error } = await supabase.from('partners').insert({
        name: newName.trim(),
        category: newCategory,
        sort_order: parseInt(newOrder, 10) || 0,
        logo: newLogo.trim(),
      })

      if (error) throw error

      setNewName('')
      setNewOrder('0')
      setNewLogo('')
      await fetchData()
    } catch (error: any) {
      window.alert(`Thêm thất bại: ${error?.message || 'Không thể tạo đối tác mới.'}`)
    } finally {
      setIsCreating(false)
    }
  }

  const startEdit = (partner: PartnerRecord) => {
    setEditingId(partner.id)
    setEditName(partner.name)
    setEditCategory(partner.category)
    setEditOrder(partner.sort_order?.toString() || '0')
    setEditLogo(partner.logo || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim() || !ensureDatabaseMode(id)) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('partners')
        .update({
          name: editName.trim(),
          category: editCategory,
          sort_order: parseInt(editOrder, 10) || 0,
          logo: editLogo.trim(),
        })
        .eq('id', id)

      if (error) throw error

      setEditingId(null)
      await fetchData()
    } catch (error: any) {
      window.alert(`Lưu thất bại: ${error?.message || 'Không thể cập nhật đối tác.'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteItem || !ensureDatabaseMode(deleteItem.id)) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('partners').delete().eq('id', deleteItem.id)
      if (error) throw error
      setData(data.filter((item) => item.id !== deleteItem.id))
    } catch (error: any) {
      window.alert(`Xóa thất bại: ${error?.message || 'Không thể xóa đối tác.'}`)
    } finally {
      setIsDeleting(false)
      setDeleteItem(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Quản lý Đối tác</h1>

      {isFallbackMode ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Trang này đang hiển thị dữ liệu mẫu vì không đọc được Supabase. Chế độ thêm, sửa, xóa sẽ bị khóa cho tới khi kết nối database hoạt động lại.
        </div>
      ) : null}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Thêm đối tác mới</h2>
        <form onSubmit={handleCreate} className="flex flex-col items-end gap-4 md:flex-row">
          <div className="flex w-full flex-1 flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Tên đối tác</label>
            <input
              required
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              placeholder="VD: Samsung..."
              disabled={isFallbackMode}
            />
          </div>
          <div className="flex w-full flex-col gap-1.5 md:w-[200px]">
            <label className="text-xs font-semibold text-gray-600">Danh mục</label>
            <select
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              disabled={isFallbackMode}
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full flex-col gap-1.5 md:w-[100px]">
            <label className="text-xs font-semibold text-gray-600">Thứ tự</label>
            <input
              type="number"
              value={newOrder}
              onChange={(event) => setNewOrder(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
              disabled={isFallbackMode}
            />
          </div>
          <div className="flex w-full flex-col gap-1.5 md:w-[150px]">
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
            disabled={isCreating || isFallbackMode}
            className="flex h-[38px] min-w-[100px] items-center justify-center gap-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating ? 'Đang thêm...' : <><Plus size={16} /> Thêm</>}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[600px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Tên đối tác</th>
              <th className="w-[200px] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Danh mục</th>
              <th className="w-[100px] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Thứ tự</th>
              <th className="w-[120px] px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Chưa có đối tác nào.</td>
              </tr>
            ) : (
              data.map((item) => {
                const isEditing = editingId === item.id
                const categoryLabel = CATEGORIES.find((category) => category.value === item.category)?.label || item.category

                return (
                  <tr key={item.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-3">
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <input
                            autoFocus
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
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
                          {item.logo ? (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded border border-gray-100 bg-gray-50 p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : null}
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {isEditing ? (
                        <select
                          value={editCategory}
                          onChange={(event) => setEditCategory(event.target.value)}
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                        >
                          {CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-600">
                          {categoryLabel}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editOrder}
                          onChange={(event) => setEditOrder(event.target.value)}
                          className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        item.sort_order || 0
                      )}
                    </td>
                    <td className="space-x-1 whitespace-nowrap px-6 py-3 text-right">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200"
                            title="Hủy"
                          >
                            <X size={16} />
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => saveEdit(item.id)}
                            className="inline-flex rounded p-1.5 text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50"
                            title="Lưu"
                          >
                            <Check size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={isFallbackMode}
                            onClick={() => startEdit(item)}
                            className="inline-flex rounded p-1.5 text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Sửa"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            disabled={isFallbackMode}
                            onClick={() => setDeleteItem(item)}
                            className="inline-flex rounded p-1.5 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
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
