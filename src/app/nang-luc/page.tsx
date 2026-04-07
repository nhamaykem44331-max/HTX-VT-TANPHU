import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ImagePlaceholder from '@/components/shared/ImagePlaceholder'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { getEquipments } from '@/lib/data-service'
import { getPageEditorContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'Năng lực & Thiết bị — HTX Tân Phú',
  description:
    'Hệ thống thiết bị hiện đại của HTX Tân Phú: đội xe, cần cẩu, kho bãi và công nghệ quản lý phục vụ đa lĩnh vực.',
}

export default async function NangLucPage() {
  const [equipments, pageContent] = await Promise.all([getEquipments(), getPageEditorContent()])
  const content = pageContent.nangLuc

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
          <Breadcrumb items={[{ label: 'Năng lực & Thiết bị' }]} />
          <h1 className="mt-4 font-heading text-4xl font-black text-white md:text-5xl">
            {content.bannerTitle}
          </h1>
          <p className="mt-2 text-lg text-blue-200">{content.bannerSubtitle}</p>
        </div>
      </div>

      <div className="container-wide section-padding">
        <ScrollReveal>
          <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {content.overviewStats.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="rounded-sm border-2 border-transparent bg-gray-50 p-6 text-center transition-colors hover:border-orange-200"
              >
                <div className="mb-2 font-heading text-3xl font-black" style={{ color: item.color || 'var(--orange)' }}>
                  {item.value}
                </div>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <SectionHeading title={content.equipmentTitle} subtitle={content.equipmentSubtitle} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipments.map((equipment: any, index: number) => (
            <ScrollReveal key={`${equipment.id || equipment.name}-${index}`} delay={index * 0.04}>
              <div className="overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="overflow-hidden">
                  {equipment.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={equipment.image}
                      alt={equipment.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder
                      label={equipment.name}
                      aspectRatio="video"
                      className="rounded-none"
                      iconSize={24}
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="flex-1 font-heading text-sm font-bold text-gray-900">{equipment.name}</h3>
                    <span
                      className="rounded-sm px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: 'var(--teal)' }}
                    >
                      {equipment.qty || equipment.quantity || equipment.category}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-500">{equipment.description || equipment.desc}</p>
                  <span className="mt-2 inline-block text-xs font-semibold text-orange-500">
                    {equipment.category}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {content.certifications.length > 0 ? (
          <ScrollReveal delay={0.2}>
            <div className="mt-16 rounded-sm p-8" style={{ backgroundColor: 'var(--ivory)' }}>
              <SectionHeading
                title={content.certificationsTitle}
                subtitle={content.certificationsSubtitle}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {content.certifications.map((certificate, index) => (
                  <div key={`${certificate}-${index}`} className="flex items-start gap-3 rounded-sm bg-white p-4 shadow-sm">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-teal-500" />
                    <p className="text-sm text-gray-700">{certificate}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </div>
  )
}
