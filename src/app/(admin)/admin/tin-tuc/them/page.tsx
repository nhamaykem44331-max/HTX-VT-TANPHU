import Link from 'next/link'
import NewsForm from '@/components/admin/NewsForm'

export const metadata = { title: 'Thêm bài viết mới — Admin HTX Tân Phú' }

export default function AddNewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/admin" className="hover:text-orange-500 transition-colors">Admin</Link>
          <span>/</span>
          <Link href="/admin/tin-tuc" className="hover:text-orange-500 transition-colors">Tin tức</Link>
          <span>/</span>
          <span className="text-gray-900">Thêm mới</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Thêm bài viết mới</h1>
      </div>

      <NewsForm mode="create" />
    </div>
  )
}
