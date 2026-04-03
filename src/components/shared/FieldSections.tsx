import { ArrowRight, CheckCircle } from "lucide-react";
import type { BusinessField } from "@/lib/types";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

function StatsGrid({ stats }: { stats: NonNullable<BusinessField["stats"]> }) {
  return (
    <ScrollReveal delay={0.1}>
      <SectionHeading title="Thông số kỹ thuật" centered={false} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-sm border-2 border-gray-100 p-5 text-center transition-colors hover:border-orange-200"
          >
            <p className="mb-1 font-heading text-2xl font-black" style={{ color: "var(--navy)" }}>
              {item.value}
            </p>
            <p className="text-xs font-medium text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

function FeaturesGrid({ features }: { features: string[] }) {
  return (
    <ScrollReveal delay={0.15}>
      <SectionHeading title="Điểm nổi bật" centered={false} />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {features.map((feature, index) => (
          <li key={`${feature}-${index}`} className="flex items-start gap-3 rounded-sm bg-teal-50 p-4">
            <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-teal-600" />
            <span className="text-sm leading-snug text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </ScrollReveal>
  );
}

function ServicesList({ services }: { services: string[] }) {
  return (
    <ScrollReveal delay={0.2}>
      <SectionHeading title="Dịch vụ cung cấp" centered={false} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {services.map((service, index) => (
          <div
            key={`${service}-${index}`}
            className="flex items-center gap-3 rounded-sm bg-gray-50 p-4 transition-colors hover:bg-orange-50"
          >
            <ArrowRight size={16} className="flex-shrink-0 text-orange-400" />
            <span className="text-sm font-medium text-gray-700">{service}</span>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

function ArticleContent({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <ScrollReveal delay={0.08}>
      <SectionHeading title="Nội dung chi tiết" centered={false} />
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line leading-relaxed text-gray-600">
            {paragraph}
          </p>
        ))}
      </div>
    </ScrollReveal>
  );
}

function ArticleImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-sm border border-gray-100 bg-gray-50 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

function ImageGallery({ fieldName, images }: { fieldName: string; images: string[] }) {
  if (images.length === 0) {
    return null;
  }

  return (
    <ScrollReveal delay={0.25}>
      <SectionHeading title="Hình ảnh thực tế" centered={false} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((image, index) => (
          <ArticleImage
            key={`${image}-${index}`}
            src={image}
            alt={`${fieldName} ${index + 1}`}
            className="aspect-video"
          />
        ))}
      </div>
    </ScrollReveal>
  );
}

function IntroMedia({ field }: { field: BusinessField }) {
  if (!field.image) {
    return <ImagePlaceholder label={field.name} aspectRatio="video" className="rounded-sm" />;
  }

  return <ArticleImage src={field.image} alt={field.name} className="aspect-video" />;
}

export function FieldMainContent({ field }: { field: BusinessField }) {
  const articleContent = field.articleContent?.trim() || "";
  const articleImages = field.articleImages?.filter(Boolean) || [];

  return (
    <div className="space-y-12 lg:col-span-2">
      <ScrollReveal>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <SectionHeading title="Giới thiệu dịch vụ" centered={false} />
            <p className="leading-relaxed text-gray-600">{field.description}</p>
          </div>
          <IntroMedia field={field} />
        </div>
      </ScrollReveal>

      <ArticleContent content={articleContent} />
      {field.stats && field.stats.length > 0 ? <StatsGrid stats={field.stats} /> : null}
      {field.features && field.features.length > 0 ? <FeaturesGrid features={field.features} /> : null}
      {field.services && field.services.length > 0 ? <ServicesList services={field.services} /> : null}
      <ImageGallery fieldName={field.name} images={articleImages} />
    </div>
  );
}
