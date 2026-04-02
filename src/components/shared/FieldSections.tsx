// @simplify: Extract 4 sub-components to reduce FieldDetail from 162 → ~60 lines.
// DRY: Stats, Features, Services, Gallery are each one pattern repeated → component.
// YAGNI: No new abstractions — only extract what exists in 3+ places.
// Each sub-component is ≤15 lines and does ONE thing.

import { CheckCircle, ArrowRight } from "lucide-react";
import type { BusinessField } from "@/lib/types";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

// ── StatsGrid: renders field.stats ──────────────────────────────────────────
function StatsGrid({ stats }: { stats: NonNullable<BusinessField["stats"]> }) {
  return (
    <ScrollReveal delay={0.1}>
      <SectionHeading title="Thông số kỹ thuật" centered={false} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="text-center p-5 rounded-sm border-2 border-gray-100 hover:border-orange-200 transition-colors"
          >
            <p className="font-heading font-black text-2xl mb-1" style={{ color: "var(--navy)" }}>
              {s.value}
            </p>
            <p className="text-gray-500 text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

// ── FeaturesGrid: renders field.features ────────────────────────────────────
function FeaturesGrid({ features }: { features: string[] }) {
  return (
    <ScrollReveal delay={0.15}>
      <SectionHeading title="Điểm nổi bật" centered={false} />
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 p-4 bg-teal-50 rounded-sm">
            <CheckCircle size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm leading-snug">{f}</span>
          </li>
        ))}
      </ul>
    </ScrollReveal>
  );
}

// ── ServicesList: renders field.services ────────────────────────────────────
function ServicesList({ services }: { services: string[] }) {
  return (
    <ScrollReveal delay={0.2}>
      <SectionHeading title="Dịch vụ cung cấp" centered={false} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm hover:bg-orange-50 transition-colors"
          >
            <ArrowRight size={16} className="text-orange-400 flex-shrink-0" />
            <span className="text-gray-700 text-sm font-medium">{s}</span>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

// ── ImageGallery: renders placeholder gallery ────────────────────────────────
function ImageGallery({ fieldName }: { fieldName: string }) {
  return (
    <ScrollReveal delay={0.25}>
      <SectionHeading title="Hình ảnh thực tế" centered={false} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <ImagePlaceholder
            key={n}
            label={`${fieldName} ${n}`}
            aspectRatio="video"
            className="rounded-sm"
            iconSize={20}
          />
        ))}
      </div>
    </ScrollReveal>
  );
}

// ── FieldMainContent: main content column ───────────────────────────────────
export function FieldMainContent({ field }: { field: BusinessField }) {
  return (
    <div className="lg:col-span-2 space-y-12">
      {/* Giới thiệu */}
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <SectionHeading title="Giới thiệu dịch vụ" centered={false} />
            <p className="text-gray-600 leading-relaxed">{field.description}</p>
          </div>
          <ImagePlaceholder label={field.name} aspectRatio="video" className="rounded-sm" />
        </div>
      </ScrollReveal>

      {field.stats && <StatsGrid stats={field.stats} />}
      {field.features && <FeaturesGrid features={field.features} />}
      {field.services && <ServicesList services={field.services} />}
      <ImageGallery fieldName={field.name} />
    </div>
  );
}
