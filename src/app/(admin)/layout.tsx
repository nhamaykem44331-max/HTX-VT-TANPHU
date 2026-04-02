import { headers } from 'next/headers'
import AdminSidebar from '@/components/admin/AdminSidebar'

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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
