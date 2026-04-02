'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Handshake,
  Award,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Home,
  Image as ImageIcon,
  Factory,
  Truck,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/trang-chu', label: 'Trang chủ', icon: Home },
  { href: '/admin/linh-vuc', label: 'Ngành nghề', icon: Factory },
  { href: '/admin/thiet-bi', label: 'Thiết bị', icon: Truck },
  { href: '/admin/media', label: 'Thư viện ảnh', icon: ImageIcon },
  { href: '/admin/tin-tuc', label: 'Tin tức', icon: Newspaper },
  { href: '/admin/tuyen-dung', label: 'Tuyển dụng', icon: Briefcase },
  { href: '/admin/doi-tac', label: 'Đối tác', icon: Handshake },
  { href: '/admin/giai-thuong', label: 'Giải thưởng', icon: Award },
  { href: '/admin/lien-he', label: 'Form liên hệ', icon: MessageSquare },
]

const bottomItems = [
  { href: '/admin/cai-dat', label: 'Cài đặt', icon: Settings },
]

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
    <div className="flex flex-col h-full" style={{ backgroundColor: '#0F2440' }}>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
            style={{ backgroundColor: '#E3783A' }}
          >
            HTX
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">HTX TÂN PHÚ</p>
            <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Main menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium"
              style={{
                backgroundColor: active ? '#E3783A' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Divider + bottom section */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
        {bottomItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium"
              style={{
                backgroundColor: active ? '#E3783A' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}

        {/* View website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
        >
          <ExternalLink size={18} />
          Xem website ↗
        </a>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,100,100,0.15)'; (e.currentTarget as HTMLElement).style.color = '#fca5a5' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col" style={{ backgroundColor: '#0F2440' }}>
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-lg bg-white shadow-lg flex items-center justify-center text-gray-700"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex-shrink-0 flex flex-col" style={{ backgroundColor: '#0F2440' }}>
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  )
}
