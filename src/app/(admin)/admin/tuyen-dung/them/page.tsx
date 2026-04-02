import Link from 'next/link'
import JobForm from '@/components/admin/JobForm'

export const metadata = { title: 'Thêm vị trí mới — Admin HTX Tân Phú' }

export default function AddJobPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/admin" className="hover:text-orange-500 transition-colors">Admin</Link>
          <span>/</span>
          <Link href="/admin/tuyen-dung" className="hover:text-orange-500 transition-colors">Tuyển dụng</Link>
          <span>/</span>
          <span className="text-gray-900">Thêm mới</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Thêm vị trí mới</h1>
      </div>

      <JobForm mode="create" />
    </div>
  )
}
