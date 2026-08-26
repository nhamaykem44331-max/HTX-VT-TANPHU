'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Briefcase,
  ExternalLink,
  Factory,
  FileText,
  Handshake,
  Home,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Menu,
  Newspaper,
  Phone,
  Settings,
  Truck,
  UserRound,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
  badge?: 'inbox' | 'applications'
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

/**
 * Menu được xếp theo đúng cấu trúc website: mỗi mục trong nhóm
 * "Nội dung website" tương ứng với một trang thật mà khách nhìn thấy.
 */
const navGroups: NavGroup[] = [
  {
    items: [{ href: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true }],
  },
  {
    title: 'Nội dung website',
    items: [
      { href: '/admin/trang-chu', label: 'Trang chủ', icon: Home },
      { href: '/admin/gioi-thieu', label: 'Giới thiệu', icon: UserRound },
      { href: '/admin/linh-vuc', label: 'Lĩnh vực', icon: Factory },
      { href: '/admin/nang-luc', label: 'Năng lực', icon: Truck },
      { href: '/admin/tin-tuc', label: 'Tin tức', icon: Newspaper },
      { href: '/admin/tuyen-dung', label: 'Tuyển dụng', icon: Briefcase },
      { href: '/admin/lien-he', label: 'Liên hệ', icon: Phone },
    ],
  },
  {
    title: 'Dùng chung',
    items: [
      { href: '/admin/media', label: 'Thư viện ảnh', icon: ImageIcon },
      { href: '/admin/doi-tac', label: 'Đối tác', icon: Handshake },
    ],
  },
  {
    title: 'Hộp thư',
    items: [
      { href: '/admin/hop-thu', label: 'Form liên hệ', icon: Inbox, badge: 'inbox' },
      { href: '/admin/ho-so-ung-tuyen', label: 'Hồ sơ ứng tuyển', icon: FileText, badge: 'applications' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [counts, setCounts] = useState({ inbox: 0, applications: 0 })

  // Đếm form liên hệ và hồ sơ ứng tuyển chưa xử lý để hiện badge trên menu
  useEffect(() => {
    let cancelled = false

    const loadCounts = async () => {
      const [contacts, applications] = await Promise.all([
        supabase
          .from('contact_submissions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new'),
        supabase
          .from('job_applications')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new'),
      ])

      if (cancelled) return

      // job_applications có thể chưa tồn tại nếu chưa chạy migration — bỏ qua lỗi,
      // badge chỉ là thông tin phụ, không được làm hỏng cả sidebar.
      setCounts({
        inbox: contacts.count ?? 0,
        applications: applications.error ? 0 : applications.count ?? 0,
      })
    }

    loadCounts()
    const timer = setInterval(loadCounts, 60_000)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [pathname])

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-orange-500 text-white'
        : 'text-white/60 hover:bg-white/10 hover:text-white'
    }`

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#0F2440]">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sm font-black text-white">
            HTX
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-white">HTX TÂN PHÚ</p>
            <p className="mt-1 text-xs text-white/40">Trang quản trị</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group, index) => (
          <div key={group.title ?? index} className={index > 0 ? 'mt-5' : ''}>
            {group.title ? (
              <p className="mb-1.5 px-3.5 text-[11px] font-bold uppercase tracking-wider text-white/30">
                {group.title}
              </p>
            ) : null}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact)
                const badgeCount = item.badge ? counts[item.badge] : 0
                const showBadge = badgeCount > 0
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={linkClass(active)}
                  >
                    <item.icon size={17} className="shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {showBadge ? (
                      <span
                        className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold ${
                          active ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'
                        }`}
                      >
                        {badgeCount}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-white/10 px-3 py-3">
        <Link
          href="/admin/cai-dat"
          onClick={() => setMobileOpen(false)}
          className={linkClass(isActive('/admin/cai-dat'))}
        >
          <Settings size={17} />
          Cài đặt
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={17} />
          Xem website
        </a>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-red-500/15 hover:text-red-300"
        >
          <LogOut size={17} />
          Đăng xuất
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-60 flex-shrink-0 flex-col lg:flex">
        <SidebarContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Mở menu quản trị"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 shadow-lg lg:hidden"
      >
        <Menu size={20} />
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="relative flex w-64 flex-shrink-0 flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Đóng menu"
              className="absolute right-3 top-4 z-10 p-1 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      ) : null}
    </>
  )
}
