'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import DeleteConfirm from '@/components/admin/DeleteConfirm'
import StatusBadge from '@/components/shared/StatusBadge'
import { supabase } from '@/lib/supabase'
import type { NewsArticle } from '@/lib/types'

export default function NewsTable({ initialData }: { initialData: NewsArticle[] }) {
  const router = useRouter()
  const [data, setData] = useState<NewsArticle[]>(initialData)
  const [deleteItem, setDeleteItem] = useState<NewsArticle | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const columns = [
    {
      key: 'title',
      label: 'Tiêu đề',
      render: (item: NewsArticle) => (
        <div className="max-w-[300px] truncate font-medium" title={item.title}>
          {item.title}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Chuyên mục',
      render: (item: NewsArticle) => (
        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold">
          {item.category}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Ngày đăng',
      render: (item: NewsArticle) => {
        const d = new Date(item.date)
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
      },
    },
    {
      key: 'published',
      label: 'Trạng thái',
      render: (item: NewsArticle) => {
        // We know from DB if it has published field, but our type doesn't have it by default.
        // Assuming we pass published from DB.
        const published = (item as any).published !== false // default true
        return <StatusBadge variant={published ? 'published' : 'draft'} />
      },
    },
    {
      key: 'featured',
      label: 'Nổi bật',
      render: (item: NewsArticle) => (
        <div className="flex items-center">
          {item.featured ? (
            <Star size={16} className="fill-amber-400 text-amber-400" />
          ) : (
            <Star size={16} className="text-gray-300" />
          )}
        </div>
      ),
    },
  ]

  const handleDelete = async () => {
    if (!deleteItem) return
    setIsDeleting(true)
    try {
      const { error } = await supabase.from('news').delete().eq('id', deleteItem.id)
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
        <h1 className="font-heading text-2xl font-bold text-gray-900">Quản lý Tin tức</h1>
        <Link href="/admin/tin-tuc/them" className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2.5 font-semibold text-sm transition-colors">
          Thêm bài viết
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onEdit={(item) => router.push(`/admin/tin-tuc/${item.id}`)}
        onDelete={(item) => setDeleteItem(item)}
      />

      <DeleteConfirm
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Xóa bài viết?"
        message={`Bạn có chắc muốn xóa bài viết "${deleteItem?.title}"? Hành động này không thể hoàn tác.`}
        loading={isDeleting}
      />
    </div>
  )
}
