'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { Building2, Calendar, MapPin, Send } from 'lucide-react'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import type { PageEditorContent } from '@/lib/page-content'
import type { Job } from '@/lib/types'

const ApplyModal = dynamic(() => import('./ApplyModal'), { ssr: false })

const benefitIconMap: Record<string, string> = {
  briefcase: '💼',
  'trending-up': '📈',
  shield: '🛡️',
  'graduation-cap': '🎓',
}

function getTypeLabel(type: Job['type']): string {
  const labels: Record<Job['type'], string> = {
    'full-time': 'Toàn thời gian',
    'part-time': 'Bán thời gian',
    contract: 'Hợp đồng',
  }

  return labels[type]
}

function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  return (
    <div className="card-hover rounded-sm border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 font-heading text-lg font-bold leading-snug text-gray-900">{job.title}</h3>
          <p className="text-sm font-semibold text-orange-500">{job.department}</p>
        </div>
        <span
          className="ml-3 rounded-sm px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: 'var(--teal)' }}
        >
          {getTypeLabel(job.type)}
        </span>
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">{job.description}</p>

      <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-orange-400" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Building2 size={12} className="text-orange-400" />
          {job.department}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} className="text-orange-400" />
          HSD: {new Date(job.deadline).toLocaleDateString('vi-VN')}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex flex-wrap gap-1">
          {job.requirements.slice(0, 1).map((requirement, index) => (
            <span
              key={index}
              className="line-clamp-1 max-w-[200px] rounded-sm bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
            >
              {requirement}
            </span>
          ))}
        </div>
        <button onClick={() => onApply(job)} className="btn-primary px-4 py-2 text-sm">
          Ứng tuyển
        </button>
      </div>
    </div>
  )
}

export default function TuyenDungClient({
  initialJobs,
  pageContent,
}: {
  initialJobs: Job[]
  pageContent: PageEditorContent['tuyenDung']
}) {
  const [activeFilter, setActiveFilter] = useState(pageContent.filters[0] || 'Tất cả')
  const [applyJob, setApplyJob] = useState<Job | null>(null)

  const filtered =
    activeFilter === pageContent.filters[0]
      ? initialJobs
      : initialJobs.filter((job) => job.department === activeFilter)

  const handleClose = useCallback(() => setApplyJob(null), [])

  return (
    <div>
      <div className="relative" style={{ backgroundColor: 'var(--navy)' }}>
        {pageContent.bannerImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pageContent.bannerImage}
              alt={pageContent.bannerTitle}
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-navy/60" />
          </>
        ) : null}

        <div className="relative container-wide py-16">
          <Breadcrumb items={[{ label: 'Tuyển dụng' }]} />
          <h1 className="mt-4 font-heading text-4xl font-black text-white md:text-5xl">
            {pageContent.bannerTitle}
          </h1>
          <p className="mt-2 text-lg text-blue-200">{pageContent.bannerSubtitle}</p>
        </div>
      </div>

      <div className="container-wide section-padding">
        {pageContent.benefits.length > 0 ? (
          <ScrollReveal>
            <div
              className="mb-14 grid grid-cols-2 gap-5 rounded-sm p-8 md:grid-cols-4"
              style={{ backgroundColor: 'var(--ivory)' }}
            >
              {pageContent.benefits.map((item) => (
                <div key={`${item.title}-${item.iconKey}`} className="text-center">
                  <div className="mb-2 text-3xl">{benefitIconMap[item.iconKey || ''] || '✨'}</div>
                  <h4 className="mb-1 font-heading text-sm font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        ) : null}

        <SectionHeading
          title={pageContent.sectionTitle}
          subtitle={pageContent.sectionSubtitle || `${initialJobs.length} vị trí đang chờ ứng viên tài năng`}
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {pageContent.filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-sm px-4 py-2 text-sm font-semibold transition-all ${
                activeFilter === filter ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeFilter === filter ? { backgroundColor: 'var(--navy)' } : {}}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((job, index) => (
            <ScrollReveal key={job.id} delay={index * 0.08}>
              <JobCard job={job} onApply={setApplyJob} />
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-400">Không có vị trí nào trong nhóm này hiện tại.</p>
          </div>
        ) : null}

        <ScrollReveal delay={0.2}>
          <div
            className="mt-14 rounded-sm p-8 text-center"
            style={{ background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))' }}
          >
            <h3 className="mb-3 font-heading text-2xl font-bold text-white">{pageContent.ctaTitle}</h3>
            <p className="mb-6 text-blue-200">{pageContent.ctaDescription}</p>
            <a href={`mailto:${pageContent.ctaEmail}`} className="btn-primary inline-flex">
              <Send size={16} /> {pageContent.ctaButtonLabel}
            </a>
          </div>
        </ScrollReveal>
      </div>

      {applyJob ? <ApplyModal job={applyJob} onClose={handleClose} /> : null}
    </div>
  )
}
