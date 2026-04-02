import Link from 'next/link'
import { Newspaper, Briefcase, Handshake, Award, MessageSquare, ArrowRight } from 'lucide-react'
import StatsCard from '@/components/admin/StatsCard'
import {
  getNewsCountFromDB,
  getJobsCountFromDB,
  getPartnersCountFromDB,
  getAwardsCountFromDB,
  getNewContactsCountFromDB,
  getRecentContactsFromDB,
  getNewsFromDB,
} from '@/lib/queries'

export const metadata = { title: 'Dashboard — HTX Tân Phú Admin' }

// Trạng thái badge tiếng Việt
const statusLabel: Record<string, { label: string; color: string }> = {
  new:      { label: 'Mới',         color: '#EF4444' },
  read:     { label: 'Đã đọc',      color: '#6B7280' },
  replied:  { label: 'Đã trả lời',  color: '#22C55E' },
  archived: { label: 'Lưu trữ',     color: '#9CA3AF' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export default async function DashboardPage() {
  // Fetch counts in parallel — @react-best-practices: async-parallel
  const [newsCount, jobsCount, partnersCount, awardsCount, newContactsCount, recentContacts, recentNews] =
    await Promise.all([
      getNewsCountFromDB(),
      getJobsCountFromDB(),
      getPartnersCountFromDB(),
      getAwardsCountFromDB(),
      getNewContactsCountFromDB(),
      getRecentContactsFromDB(5),
      getNewsFromDB(5),
    ])

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Tổng quan hệ thống</p>
      </div>

      {/* Stats grid: 2 → 3 → 5 cols */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          title="Tin tức"
          value={newsCount}
          icon={Newspaper}
          href="/admin/tin-tuc"
          color="blue"
        />
        <StatsCard
          title="Tuyển dụng"
          value={jobsCount}
          icon={Briefcase}
          href="/admin/tuyen-dung"
          color="green"
        />
        <StatsCard
          title="Đối tác"
          value={partnersCount}
          icon={Handshake}
          href="/admin/doi-tac"
          color="purple"
        />
        <StatsCard
          title="Giải thưởng"
          value={awardsCount}
          icon={Award}
          href="/admin/giai-thuong"
          color="amber"
        />
        <StatsCard
          title="Form mới"
          value={newContactsCount}
          icon={MessageSquare}
          href="/admin/lien-he"
          color="red"
        />
      </div>

      {/* Two-column lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent contact submissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Form liên hệ mới nhất</h2>
            <Link
              href="/admin/lien-he"
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              Xem tất cả <ArrowRight size={12} />
            </Link>
          </div>

          {recentContacts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              Chưa có form nào
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentContacts.map((c) => {
                const st = statusLabel[c.status] ?? statusLabel['read']
                return (
                  <div key={c.id} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 truncate">{c.service}</p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                      {formatDate(c.createdAt)}
                    </p>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-md flex-shrink-0"
                      style={{ color: st.color, backgroundColor: st.color + '18' }}
                    >
                      {st.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent news */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Tin tức gần đây</h2>
            <Link
              href="/admin/tin-tuc"
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              Xem tất cả <ArrowRight size={12} />
            </Link>
          </div>

          {recentNews.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              Chưa có tin tức nào
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentNews.map((n) => (
                <div key={n.id} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate line-clamp-1">{n.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(n.date)}</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-md flex-shrink-0"
                    style={{ color: '#2C3576', backgroundColor: '#2C357618' }}
                  >
                    {n.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
