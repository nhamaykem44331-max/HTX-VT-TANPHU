'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen,
  ExternalLink,
  Handshake,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  X,
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/trang-chu', label: 'Trang chủ', icon: Home },
  { href: '/admin/chinh-sua-dau-muc', label: 'Chỉnh sửa đầu mục', icon: BookOpen },
  { href: '/admin/media', label: 'Thư viện ảnh', icon: ImageIcon },
  { href: '/admin/doi-tac', label: 'Đối tác', icon: Handshake },
  { href: '/admin/lien-he', label: 'Form liên hệ', icon: MessageSquare },
]

const bottomItems = [{ href: '/admin/cai-dat', label: 'Cài đặt', icon: Settings }]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col" style={{ backgroundColor: '#0F2440' }}>
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-black text-white"
            style={{ backgroundColor: '#E3783A' }}
          >
            HTX
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-white">HTX TÂN PHÚ</p>
            <p className="mt-0.5 text-xs text-white/40">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: active ? '#E3783A' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={(event) => {
                if (!active) event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={(event) => {
                if (!active) event.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 pb-4 pt-4">
        {bottomItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: active ? '#E3783A' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={(event) => {
                if (!active) event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={(event) => {
                if (!active) event.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <ExternalLink size={18} />
          Xem website →
        </a>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = 'rgba(255,100,100,0.15)'
            event.currentTarget.style.color = '#fca5a5'
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = 'transparent'
            event.currentTarget.style.color = 'rgba(255,255,255,0.6)'
          }}
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-60 flex-shrink-0 flex-col lg:flex" style={{ backgroundColor: '#0F2440' }}>
        <SidebarContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 shadow-lg lg:hidden"
      >
        <Menu size={20} />
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex w-60 flex-shrink-0 flex-col" style={{ backgroundColor: '#0F2440' }}>
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileOpen(false)} className="p-1 text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      ) : null}
    </>
  )
}
