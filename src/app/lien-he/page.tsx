import type { Metadata } from 'next'
import { Clock, Facebook, Mail, MapPin, Phone } from 'lucide-react'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ContactForm from '@/components/shared/ContactForm'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { getPageEditorContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'Liên hệ HTX Tân Phú — Hotline 0208.383.2608',
  description:
    'Liên hệ HTX Vận tải Ô tô Tân Phú: trụ sở Thái Nguyên, chi nhánh và hotline tư vấn dịch vụ vận tải, cẩu lắp, khách sạn.',
  keywords: ['liên hệ HTX Tân Phú', 'hotline vận tải Thái Nguyên', 'tư vấn vận tải hàng hóa'],
  alternates: { canonical: 'https://htxtanphu.com/lien-he' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://htxtanphu.com/lien-he',
    title: 'Liên hệ HTX Tân Phú — Hotline 0208.383.2608',
    description: 'Liên hệ HTX Vận tải Ô tô Tân Phú tại Thái Nguyên và các đầu mối tư vấn dịch vụ.',
    images: [{ url: 'https://htxtanphu.com/og-image.png', width: 945, height: 945 }],
  },
}

function toTelHref(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export default async function LienHePage() {
  const pageContent = await getPageEditorContent()
  const content = pageContent.lienHe
  const otherBranches = content.branches.filter((branch) => !branch.main)

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
          <Breadcrumb items={[{ label: 'Liên hệ' }]} />
          <h1 className="mt-4 font-heading text-4xl font-black text-white md:text-5xl">
            {content.bannerTitle}
          </h1>
          <p className="mt-2 text-lg text-blue-200">{content.bannerSubtitle}</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--orange)' }}>
        <div className="container-wide py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-between">
            <a
              href={`tel:${toTelHref(content.headquartersPhone)}`}
              className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80"
            >
              <Phone size={16} />
              Hotline: {content.quickHotlineLabel}
            </a>
            <a
              href={`mailto:${content.headquartersEmail}`}
              className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80"
            >
              <Mail size={16} />
              {content.quickEmailLabel}
            </a>
            <a
              href={content.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white/20 text-xs font-black">Z</span>
              Chat Zalo
            </a>
            <a
              href={content.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80"
            >
              <Facebook size={16} />
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="container-wide section-padding">
        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-5">
          <ScrollReveal className="lg:col-span-3">
            <div className="rounded-sm border border-gray-100 bg-white p-8 shadow-sm">
              <SectionHeading
                title={content.consultationTitle}
                subtitle={content.consultationSubtitle}
                centered={false}
              />
              <ContactForm title="" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="lg:col-span-2">
            <div className="space-y-6">
              <div className="rounded-sm border-2 border-orange-200 p-6" style={{ backgroundColor: 'var(--ivory)' }}>
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-sm bg-orange-500" />
                  <h3 className="font-heading font-bold text-gray-900">{content.headquartersTitle}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-orange-400" />
                    <p className="text-sm text-gray-600">{content.headquartersAddress}</p>
                  </div>
                  <div className="flex gap-3">
                    <Phone size={16} className="mt-0.5 flex-shrink-0 text-orange-400" />
                    <a
                      href={`tel:${toTelHref(content.headquartersPhone)}`}
                      className="text-sm text-gray-600 transition-colors hover:text-orange-500"
                    >
                      {content.headquartersPhone}
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Mail size={16} className="mt-0.5 flex-shrink-0 text-orange-400" />
                    <a
                      href={`mailto:${content.headquartersEmail}`}
                      className="text-sm text-gray-600 transition-colors hover:text-orange-500"
                    >
                      {content.headquartersEmail}
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Clock size={16} className="mt-0.5 flex-shrink-0 text-orange-400" />
                    <p className="text-sm text-gray-600">{content.headquartersHours}</p>
                  </div>
                </div>
              </div>

              {otherBranches.map((branch) => (
                <div key={`${branch.name}-${branch.address}`} className="rounded-sm border border-gray-100 bg-gray-50 p-5">
                  <h4 className="mb-3 font-heading text-sm font-semibold text-gray-900">{branch.name}</h4>
                  <div className="mb-1.5 flex gap-2">
                    <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <p className="text-xs text-gray-500">{branch.address}</p>
                  </div>
                  <div className="mb-1.5 flex gap-2">
                    <Phone size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <p className="text-xs text-gray-500">{branch.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Clock size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <p className="text-xs text-gray-500">{branch.hours}</p>
                  </div>
                </div>
              ))}

              {content.specialContacts.map((contact) => (
                <div key={`${contact.title}-${contact.phone}`} className="rounded-sm border border-gray-100 bg-white p-5">
                  <h4 className="mb-3 font-heading text-sm font-semibold text-gray-900">{contact.title}</h4>
                  <a
                    href={`tel:${toTelHref(contact.phone)}`}
                    className="flex items-center gap-2 text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600"
                  >
                    <Phone size={14} />
                    {contact.phone}
                  </a>
                  <p className="mt-1 text-xs text-gray-400">{contact.subtitle}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <SectionHeading title={content.mapTitle} subtitle={content.mapSubtitle} />
          <div className="overflow-hidden rounded-sm border border-gray-100 shadow-md" style={{ height: '400px' }}>
            <iframe
              src={content.mapEmbed}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ HTX Tân Phú"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.branches.map((branch) => (
              <div
                key={`${branch.name}-${branch.address}`}
                className={`rounded-sm p-5 transition-colors ${
                  branch.main ? 'border-2 border-orange-300 text-white' : 'border border-gray-100 bg-gray-50'
                }`}
                style={branch.main ? { backgroundColor: 'var(--navy)' } : {}}
              >
                <div className={`mb-3 h-2 w-2 rounded-sm ${branch.main ? 'bg-orange-400' : 'bg-teal-400'}`} />
                <h4 className={`mb-2 font-heading text-sm font-bold ${branch.main ? 'text-white' : 'text-gray-900'}`}>
                  {branch.name}
                </h4>
                <p className={`mb-1.5 flex items-start gap-1.5 text-xs ${branch.main ? 'text-blue-200' : 'text-gray-500'}`}>
                  <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                  {branch.address}
                </p>
                <p className={`flex items-center gap-1.5 text-xs ${branch.main ? 'text-blue-200' : 'text-gray-500'}`}>
                  <Clock size={12} />
                  {branch.hours}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
