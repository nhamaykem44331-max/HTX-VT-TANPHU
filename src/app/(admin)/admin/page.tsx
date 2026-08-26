import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  ExternalLink,
  Factory,
  Home,
  Image as ImageIcon,
  Inbox,
  Newspaper,
  PenLine,
  Phone,
  Truck,
  Upload,
  UserRound,
} from 'lucide-react'
import { getNewContactsCountFromDB, getRecentContactsFromDB } from '@/lib/queries'

export const metadata = { title: 'Tổng quan — HTX Tân Phú Admin' }

/** Việc quản trị viên làm thường xuyên nhất — đặt ngay đầu trang để bấm một lần là vào việc. */
const quickActions = [
  {
    href: '/admin/tin-tuc/them',
    label: 'Viết bài mới',
    hint: 'Đăng tin hoạt động của HTX',
    icon: PenLine,
  },
  {
    href: '/admin/media',
    label: 'Tải ảnh lên',
    hint: 'Thêm ảnh vào thư viện dùng chung',
    icon: Upload,
  },
  {
    href: '/admin/hop-thu',
    label: 'Xem form liên hệ',
    hint: 'Khách gửi yêu cầu tư vấn',
    icon: Inbox,
  },
  {
    href: '/admin/tuyen-dung',
    label: 'Đăng tin tuyển dụng',
    hint: 'Thêm vị trí đang cần người',
    icon: Briefcase,
  },
]

/** Sơ đồ website: mỗi dòng là một trang khách nhìn thấy, kèm lối vào chỗ sửa. */
const sitePages = [
  { admin: '/admin/trang-chu', site: '/', label: 'Trang chủ', desc: 'Slider, con số, thứ tự các khối', icon: Home },
  { admin: '/admin/gioi-thieu', site: '/gioi-thieu', label: 'Giới thiệu', desc: 'Lịch sử, ban lãnh đạo, giải thưởng', icon: UserRound },
  { admin: '/admin/linh-vuc', site: '/linh-vuc', label: 'Lĩnh vực', desc: 'Danh sách lĩnh vực hoạt động', icon: Factory },
  { admin: '/admin/nang-luc', site: '/nang-luc', label: 'Năng lực', desc: 'Thiết bị, chỉ số, chứng nhận', icon: Truck },
  { admin: '/admin/tin-tuc', site: '/tin-tuc', label: 'Tin tức', desc: 'Bài viết và danh mục tin', icon: Newspaper },
  { admin: '/admin/tuyen-dung', site: '/tuyen-dung', label: 'Tuyển dụng', desc: 'Vị trí đang tuyển, phúc lợi', icon: Briefcase },
  { admin: '/admin/lien-he', site: '/lien-he', label: 'Liên hệ', desc: 'Thông tin, chi nhánh, bản đồ', icon: Phone },
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function DashboardPage() {
  const [newContactsCount, recentContacts] = await Promise.all([
    getNewContactsCountFromDB(),
    getRecentContactsFromDB(5),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chọn một việc bên dưới, hoặc mở trang cần sửa trong sơ đồ website.
        </p>
      </div>

      {/* Việc hay làm */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const isInbox = action.href === '/admin/hop-thu'
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <action.icon size={20} />
                </div>
                {isInbox && newContactsCount > 0 ? (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    {newContactsCount} mới
                  </span>
                ) : null}
              </div>
              <div>
                <p className="font-heading font-bold text-gray-900">{action.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{action.hint}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Sơ đồ website */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-heading font-bold text-gray-900">Sơ đồ website</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Mỗi dòng là một trang trên website. Bấm “Sửa” để chỉnh nội dung trang đó.
            </p>
          </div>

          <ul className="divide-y divide-gray-100">
            {sitePages.map((page) => (
              <li
                key={page.admin}
                className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <page.icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{page.label}</p>
                    <p className="truncate text-xs text-gray-500">{page.desc}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={page.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <ExternalLink size={13} />
                    Xem
                  </a>
                  <Link
                    href={page.admin}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    Sửa
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 border-t border-gray-100 px-5 py-3">
            <ImageIcon size={15} className="text-gray-400" />
            <p className="text-xs text-gray-500">
              Ảnh dùng chung cho mọi trang nằm ở{' '}
              <Link href="/admin/media" className="font-semibold text-orange-600 hover:underline">
                Thư viện ảnh
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Form liên hệ mới nhất */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-heading font-bold text-gray-900">Form liên hệ mới</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {newContactsCount > 0
                  ? `${newContactsCount} yêu cầu chưa xử lý`
                  : 'Không có yêu cầu mới'}
              </p>
            </div>
            <Link
              href="/admin/hop-thu"
              className="text-sm font-semibold text-orange-600 hover:underline"
            >
              Tất cả
            </Link>
          </div>

          {recentContacts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">Chưa có form liên hệ nào.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentContacts.map((contact) => (
                <li key={contact.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{contact.name}</p>
                      <p className="truncate text-xs text-gray-500">{contact.service}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      {contact.status === 'new' ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
                          Mới
                        </span>
                      ) : null}
                      <p className="mt-1 text-[11px] text-gray-400">{formatDate(contact.createdAt)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
