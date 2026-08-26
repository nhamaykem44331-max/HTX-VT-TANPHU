import { headers } from 'next/headers'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

// Root layout: detect /admin → skip Header/Footer
// This layout: detect /admin/login → skip sidebar
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isLoginPage = pathname.startsWith('/admin/login')

  // Login page: render without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // All other admin pages: render with sidebar shell
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopBar />

        <main className="flex-1 overflow-y-auto">
          {/* Giới hạn bề rộng để dòng chữ không bị kéo dài quá trên màn hình lớn */}
          <div className="mx-auto max-w-[1400px] p-4 sm:p-5 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
