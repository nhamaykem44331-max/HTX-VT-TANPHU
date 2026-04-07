import type { Metadata } from 'next'
import { CheckCircle, Eye, Heart, Star, Target } from 'lucide-react'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ImagePlaceholder from '@/components/shared/ImagePlaceholder'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { getAwards } from '@/lib/data-service'
import { getPageEditorContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'Giới thiệu — HTX Vận tải Ô tô Tân Phú Thái Nguyên',
  description:
    'Tìm hiểu về HTX Vận tải Ô tô Tân Phú — 30 năm phát triển, sứ mệnh tầm nhìn, ban lãnh đạo và thành tích nổi bật tại Thái Nguyên.',
  keywords: [
    'giới thiệu HTX Tân Phú',
    'lịch sử hợp tác xã Thái Nguyên',
    'ban lãnh đạo HTX',
    '30 năm phát triển',
  ],
  alternates: { canonical: 'https://htxtanphu.com/gioi-thieu' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://htxtanphu.com/gioi-thieu',
    title: 'Giới thiệu HTX Tân Phú — 30 năm hòa hợp cùng phát triển',
    description: 'Tìm hiểu về HTX Tân Phú: lịch sử, sứ mệnh, ban lãnh đạo và thành tích 30 năm.',
    images: [{ url: 'https://htxtanphu.com/og-image.png', width: 945, height: 945 }],
  },
}

const missionIconMap = {
  target: Target,
  eye: Eye,
  heart: Heart,
}

export default async function GioiThieuPage() {
  const [pageContent, awards] = await Promise.all([getPageEditorContent(), getAwards()])
  const content = pageContent.gioiThieu

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
        ) : (
          <div className="absolute inset-0 opacity-20">
            <ImagePlaceholder label="" className="h-full w-full rounded-none" aspectRatio="wide" />
          </div>
        )}

        <div className="relative container-wide py-16">
          <Breadcrumb items={[{ label: 'Giới thiệu' }]} />
          <h1 className="mt-4 font-heading text-4xl font-black text-white md:text-5xl">
            {content.bannerTitle}
          </h1>
          <p className="mt-2 text-lg text-blue-200">{content.bannerSubtitle}</p>
        </div>
      </div>

      <div className="container-wide py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 rounded-sm bg-gray-50 p-5">
              <p className="mb-4 font-heading text-xs font-bold uppercase tracking-widest text-gray-500">
                Nội dung
              </p>
              {[
                { href: '#gioi-thieu', label: 'Giới thiệu chung' },
                { href: '#su-menh', label: 'Sứ mệnh & Tầm nhìn' },
                { href: '#lich-su', label: 'Lịch sử 30 năm' },
                { href: '#ban-lanh-dao', label: 'Ban lãnh đạo' },
                { href: '#thanh-tich', label: 'Thành tích' },
                { href: '#trach-nhiem', label: 'Trách nhiệm XH' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="mb-1 block rounded-sm px-3 py-2.5 font-body text-sm font-medium text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-20 lg:col-span-3">
            <section id="gioi-thieu">
              <SectionHeading title={content.introTitle} centered={false} />
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                <div>
                  {content.introParagraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed text-gray-600">
                      {paragraph}
                    </p>
                  ))}

                  {content.introStats.length > 0 ? (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {content.introStats.map((item) => (
                        <div key={`${item.label}-${item.value}`} className="rounded-sm bg-gray-50 p-4">
                          <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                            {item.label}
                          </p>
                          <p className="font-heading text-lg font-bold text-navy">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {content.introImage ? (
                  <div className="overflow-hidden rounded-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.introImage}
                      alt={content.bannerTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <ImagePlaceholder label="HTX Tân Phú — Trụ sở chính" aspectRatio="video" className="rounded-sm" />
                )}
              </div>
            </section>

            {content.missionCards.length > 0 ? (
              <section id="su-menh">
                <SectionHeading title={content.missionTitle} centered={false} />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {content.missionCards.map((item) => {
                    const Icon = missionIconMap[item.iconKey as keyof typeof missionIconMap] || Heart
                    const accentColor = item.color || 'var(--orange)'

                    return (
                      <div
                        key={`${item.title}-${item.iconKey}`}
                        className="rounded-sm border-2 border-gray-100 p-6 transition-colors hover:border-orange-200"
                      >
                        <div
                          className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm"
                          style={{ backgroundColor: `${accentColor}20` }}
                        >
                          <Icon size={22} style={{ color: accentColor }} />
                        </div>
                        <h3 className="mb-3 font-heading text-lg font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                      </div>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {content.timelineItems.length > 0 ? (
              <section id="lich-su">
                <SectionHeading title={content.timelineTitle} centered={false} />
                <div className="relative">
                  <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-gray-200" />
                  <div className="space-y-8">
                    {content.timelineItems.map((event, index) => (
                      <ScrollReveal key={`${event.year}-${event.title}`} delay={index * 0.05}>
                        <div className="relative flex gap-6">
                          <div
                            className={`z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm font-heading text-xs font-black ${
                              event.milestone
                                ? 'text-white shadow-lg'
                                : 'border-2 border-gray-200 bg-white text-gray-500'
                            }`}
                            style={event.milestone ? { backgroundColor: 'var(--orange)' } : {}}
                          >
                            {event.year.slice(2)}
                          </div>
                          <div className={`flex-1 pb-4 ${event.milestone ? '-mt-1 rounded-sm bg-orange-50 p-5' : ''}`}>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-heading text-sm font-bold text-orange-500">{event.year}</span>
                              {event.milestone ? (
                                <span className="rounded-sm bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                                  Mốc quan trọng
                                </span>
                              ) : null}
                            </div>
                            <h4 className="mb-2 font-heading font-bold text-gray-900">{event.title}</h4>
                            <p className="text-sm leading-relaxed text-gray-600">{event.description}</p>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {content.leaders.length > 0 ? (
              <section id="ban-lanh-dao">
                <SectionHeading title={content.leadersTitle} centered={false} />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {content.leaders.map((leader, index) => (
                    <ScrollReveal key={`${leader.name}-${leader.title}`} delay={index * 0.1}>
                      <div className="overflow-hidden rounded-sm border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-xl">
                        {leader.image ? (
                          <div className="aspect-[3/4] overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={leader.image} alt={leader.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <ImagePlaceholder label={leader.name} aspectRatio="portrait" className="rounded-none" iconSize={40} />
                        )}

                        <div className="p-5">
                          <h3 className="text-base font-bold text-gray-900">{leader.name}</h3>
                          <p className="mb-3 text-sm font-semibold text-orange-500">{leader.title}</p>
                          <p className="mb-3 text-sm leading-relaxed text-gray-600">{leader.bio}</p>
                          <div className="flex flex-col gap-1">
                            {leader.awards.map((award) => (
                              <span key={award} className="flex items-center gap-1.5 text-xs font-medium text-teal-700">
                                <CheckCircle size={12} className="flex-shrink-0 text-teal-500" />
                                {award}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            ) : null}

            {awards.length > 0 ? (
              <section id="thanh-tich">
                <SectionHeading title="Thành tích & Giải thưởng" centered={false} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {awards.map((award) => (
                    <div
                      key={award.id}
                      className="flex items-start gap-4 rounded-sm bg-gray-50 p-4 transition-colors hover:bg-orange-50"
                    >
                      <Star size={20} className="mt-0.5 flex-shrink-0 text-orange-400" fill="currentColor" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{award.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {award.issuer} — {award.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {content.responsibilities.length > 0 ? (
              <section id="trach-nhiem">
                <SectionHeading title={content.responsibilityTitle} centered={false} />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {content.responsibilities.map((item) => (
                    <div
                      key={`${item.title}-${item.description}`}
                      className="flex gap-4 rounded-sm border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
                    >
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-sm bg-teal-500" />
                      <div>
                        <h4 className="mb-1 font-heading font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
