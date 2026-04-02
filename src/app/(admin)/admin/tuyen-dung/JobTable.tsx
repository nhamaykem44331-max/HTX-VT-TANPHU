'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/DataTable'
import DeleteConfirm from '@/components/admin/DeleteConfirm'
import StatusBadge, { jobTypeToVariant } from '@/components/shared/StatusBadge'
import { supabase } from '@/lib/supabase'
import type { Job } from '@/lib/types'

export default function JobTable({ initialData }: { initialData: Job[] }) {
  const router = useRouter()
  const [data, setData] = useState<Job[]>(initialData)
  const [deleteItem, setDeleteItem] = useState<Job | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const columns = [
    {
      key: 'title',
      label: 'Vị trí',
      render: (item: Job) => (
        <div className="max-w-[250px] truncate font-medium text-gray-900" title={item.title}>
          {item.title}
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Phòng ban',
      render: (item: Job) => <span className="text-gray-600">{item.department}</span>
    },
    {
      key: 'location',
      label: 'Địa điểm',
    },
    {
      key: 'type',
      label: 'Loại hình',
      render: (item: Job) => (
        <StatusBadge variant={jobTypeToVariant(item.type)} size="sm" />
      ),
    },
    {
      key: 'deadline',
      label: 'Hạn nộp',
      render: (item: Job) => {
        const isExpired = new Date(item.deadline) < new Date()
        return (
          <span className={isExpired ? "text-red-500 font-medium" : "text-gray-600"}>
            {item.deadline}
            {isExpired && <StatusBadge variant="expired" size="sm" className="ml-2" />}
          </span>
        )
      },
    },
    {
      key: 'published',
      label: 'Trạng thái',
      render: (item: Job) => {
        const published = (item as any).published !== false // default true
        return <StatusBadge variant={published ? 'published' : 'draft'} size="sm" />
      },
    },
  ]

  const handleDelete = async () => {
    if (!deleteItem) return
    setIsDeleting(true)
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', deleteItem.id)
      if (error) throw error
      setData((prev) => prev.filter((d) => d.id !== deleteItem.id))
      router.refresh()
    } catch (err: any) {
      alert('Xoá thất bại: ' + err.message)
    } finally {
      setIsDeleting(false)
      setDeleteItem(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Quản lý Tuyển dụng</h1>
        <Link href="/admin/tuyen-dung/them" className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2.5 font-semibold text-sm transition-colors">
          Thêm vị trí
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onEdit={(item) => router.push(`/admin/tuyen-dung/${item.id}`)}
        onDelete={(item) => setDeleteItem(item)}
      />

      <DeleteConfirm
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Xóa vị trí tuyển dụng?"
        message={`Bạn có chắc muốn xóa vị trí "${deleteItem?.title}"? Hành động này không thể hoàn tác.`}
        loading={isDeleting}
      />
    </div>
  )
}
