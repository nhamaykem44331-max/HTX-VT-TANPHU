import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ImagePlaceholder from '@/components/shared/ImagePlaceholder'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { getFields } from '@/lib/data-service'
import { getPageEditorContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'Lĩnh vực hoạt động — HTX Tân Phú',
  description:
    '7 lĩnh vực kinh doanh đa dạng của HTX Vận tải Ô tô Tân Phú: vận tải, cẩu lắp đặt, thép, khách sạn, nhà hàng sự kiện, vé máy bay, nông nghiệp hữu cơ.',
}

export default async function LinhVucPage() {
  const [fields, pageContent] = await Promise.all([getFields(), getPageEditorContent()])
  const content = pageContent.linhVuc

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
          <Breadcrumb items={[{ label: 'Lĩnh vực hoạt động' }]} />
          <h1 className="mt-4 font-heading text-4xl font-black text-white md:text-5xl">
            {content.bannerTitle}
          </h1>
          <p className="mt-2 text-lg text-blue-200">{content.bannerSubtitle}</p>
        </div>
      </div>

      <div className="container-wide section-padding">
        <ScrollReveal>
          <SectionHeading title={content.sectionTitle} subtitle={content.sectionSubtitle} />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field: any, index: number) => (
            <ScrollReveal key={field.id} delay={index * 0.08}>
              <Link
                href={`/linh-vuc/${field.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {field.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={field.image}
                      alt={field.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ImagePlaceholder
                      label={field.name}
                      className="h-full w-full rounded-none transition-transform duration-500 group-hover:scale-105"
                      aspectRatio="video"
                    />
                  )}
                </div>

                <div className="flex flex-grow flex-col p-6">
                  <h2 className="mb-2 font-heading text-xl font-bold text-gray-900 transition-colors group-hover:text-orange-600">
                    {field.name}
                  </h2>
                  <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-500">{field.description}</p>

                  {field.stats && field.stats.length > 0 ? (
                    <div className="mb-4 grid shrink-0 grid-cols-2 gap-2">
                      {field.stats.slice(0, 2).map((stat: any) => (
                        <div key={stat.label} className="rounded-sm bg-gray-50 p-2.5">
                          <p className="mb-0.5 text-xs text-gray-400">{stat.label}</p>
                          <p className="font-heading text-sm font-bold text-navy">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <span className="mt-auto flex shrink-0 items-center gap-1 text-sm font-semibold text-orange-500 transition-all group-hover:gap-2">
                    Tìm hiểu thêm <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
