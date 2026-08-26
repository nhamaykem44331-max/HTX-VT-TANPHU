import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ApplicationsInbox from '@/components/admin/ApplicationsInbox'

export const metadata = { title: 'Hồ sơ ứng tuyển — HTX Tân Phú Admin' }

export default function HoSoUngTuyenPage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Hồ sơ ứng tuyển"
        description="Hồ sơ ứng viên gửi từ trang Tuyển dụng. Bấm vào một dòng để xem chi tiết."
        viewUrl="/tuyen-dung"
      />
      <ApplicationsInbox />
    </div>
  )
}
