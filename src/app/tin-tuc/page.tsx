import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ImagePlaceholder from '@/components/shared/ImagePlaceholder'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { getNews } from '@/lib/data-service'
import { getPageEditorContent } from '@/lib/page-content'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tin tức & Sự kiện — HTX Vận tải Ô tô Tân Phú',
  description:
    'Cập nhật tin tức mới nhất về HTX Vận tải Ô tô Tân Phú Thái Nguyên: thành tích, sự kiện, đầu tư, công nghệ và hoạt động cộng đồng.',
  keywords: ['tin tức HTX Tân Phú', 'sự kiện HTX', 'thành tích hợp tác xã Thái Nguyên'],
  alternates: { canonical: 'https://htxtanphu.com/tin-tuc' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://htxtanphu.com/tin-tuc',
    title: 'Tin tức & Sự kiện — HTX Tân Phú',
    description: 'Cập nhật tin tức mới nhất về hoạt động của HTX Vận tải Ô tô Tân Phú.',
    images: [{ url: 'https://htxtanphu.com/og-image.png', width: 945, height: 945 }],
  },
}

export default async function TinTucPage() {
  const [allLatest, pageContent] = await Promise.all([getNews(), getPageEditorContent()])
  const content = pageContent.tinTuc
  const featured = allLatest.find((article) => article.featured) || allLatest[0]

  if (!featured && (!allLatest || allLatest.length === 0)) {
    return <div>Không có bài viết nào.</div>
  }

  const rest = allLatest.filter((article) => article.id !== featured.id)

  return (
    <div>
      <div className="relative" style={{ backgroundColor: 'var(--navy)' }}>
        {content.bannerImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.bannerImage}
              alt={content.bannerTitle}
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-navy/60" />
          </>
        ) : null}

        <div className="relative container-wide py-16">
          <Breadcrumb items={[{ label: 'Tin tức & Sự kiện' }]} />
          <h1 className="mt-4 font-heading text-4xl font-black text-white md:text-5xl">
            {content.bannerTitle}
          </h1>
          <p className="mt-2 text-lg text-blue-200">{content.bannerSubtitle}</p>
        </div>
      </div>

      <div className="container-wide section-padding">
        <div className="mb-10 flex flex-wrap gap-2">
          {content.categories.map((category) => (
            <button
              key={category}
              className={`rounded-sm px-4 py-2 text-sm font-semibold transition-all ${
                category === content.categories[0]
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={category === content.categories[0] ? { backgroundColor: 'var(--orange)' } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        <ScrollReveal>
          <Link
            href={`/tin-tuc/${featured.slug}`}
            className="group mb-12 grid overflow-hidden rounded-sm bg-white shadow-md transition-shadow hover:shadow-xl md:grid-cols-2"
          >
            <div className="overflow-hidden">
              {featured.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="min-h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <ImagePlaceholder
                  label={featured.title}
                  className="min-h-[260px] w-full rounded-none transition-transform duration-500 group-hover:scale-105"
                  aspectRatio="video"
                />
              )}
            </div>

            <div className="flex flex-col justify-center p-8">
              <span
                className="mb-3 inline-block self-start rounded-sm px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: 'var(--orange)' }}
              >
                Tin nổi bật — {featured.category}
              </span>
              <h2 className="mb-3 font-heading text-2xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-orange-600">
                {featured.title}
              </h2>
              <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-500">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(featured.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {featured.readTime} phút đọc
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-orange-500 transition-all group-hover:gap-2">
                  Đọc tiếp <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        <SectionHeading title={content.listTitle} centered={false} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, index) => (
            <ScrollReveal key={article.id} delay={index * 0.07}>
              <Link
                href={`/tin-tuc/${article.slug}`}
                className="group block h-full overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="overflow-hidden">
                  {article.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ImagePlaceholder
                      label={article.title}
                      className="w-full rounded-none transition-transform duration-500 group-hover:scale-105"
                      aspectRatio="video"
                    />
                  )}
                </div>
                <div className="p-5">
                  <span
                    className="mb-2 inline-block rounded-sm px-2.5 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--teal)' }}
                  >
                    {article.category}
                  </span>
                  <h3 className="mb-2 line-clamp-2 font-heading text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-orange-600">
                    {article.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">{article.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {article.readTime} phút
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-orange-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
