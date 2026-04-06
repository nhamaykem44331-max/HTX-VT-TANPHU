// @nextjs-best-practices: Static metadata export, openGraph, canonical,
// keywords, title ≤60 chars, description 150-160 chars.
// @seo-audit: All 6 pages audited — homepage was missing openGraph.images,
// canonical alternates, and structured keywords.

import type { Metadata } from "next";
import { getHomepageSections, getHeroSlides, getKeyFigures, getFields, getEquipments } from "@/lib/data-service";
import HeroBanner from "@/components/home/HeroBanner";
import FieldsCarousel from "@/components/home/FieldsCarousel";
import KeyFigures from "@/components/home/KeyFigures";
import EquipmentGallery from "@/components/home/EquipmentGallery";
import NewsSection from "@/components/home/NewsSection";
import AwardsSection from "@/components/home/AwardsSection";
import PartnersSection from "@/components/home/PartnersSection";
import CTASection from "@/components/home/CTASection";

// @nextjs-best-practices §6 — Static metadata for fixed pages
export const metadata: Metadata = {
  // title ≤60 chars
  title: "HTX Vận tải Ô tô Tân Phú — 30 năm hòa hợp cùng phát triển",
  // description 150-160 chars
  description:
    "HTX Vận tải Ô tô Tân Phú tại Thái Nguyên — 30 năm uy tín, 7 lĩnh vực: vận tải hàng hóa, cẩu lắp đặt thiết bị, kinh doanh thép Hòa Phát, khách sạn Phương Anh.",
  keywords: [
    "HTX Tân Phú",
    "vận tải hàng hóa Thái Nguyên",
    "cẩu lắp đặt thiết bị",
    "thép Hòa Phát Thái Nguyên",
    "khách sạn Phương Anh",
    "đại lý vé máy bay Tân Phú APG",
    "HTX vận tải ô tô",
    "hợp tác xã Thái Nguyên",
  ],
  // @seo-audit: canonical must be set to avoid duplicate content
  alternates: {
    canonical: "https://htxtanphu.com",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://htxtanphu.com",
    siteName: "HTX Vận tải Ô tô Tân Phú",
    title: "HTX Vận tải Ô tô Tân Phú — 30 năm hòa hợp cùng phát triển",
    description:
      "Doanh nghiệp HTX đa ngành hàng đầu Thái Nguyên: vận tải, cẩu lắp, thép, khách sạn, vé máy bay, nông nghiệp hữu cơ.",
    images: [
      {
        url: "https://htxtanphu.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "HTX Vận tải Ô tô Tân Phú — Thái Nguyên",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTX Vận tải Ô tô Tân Phú — 30 năm hòa hợp cùng phát triển",
    description:
      "Doanh nghiệp HTX đa ngành hàng đầu Thái Nguyên với 7 lĩnh vực kinh doanh.",
    images: ["https://htxtanphu.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// @nextjs-best-practices §1 — Server Component by default
// @react-best-practices §3 server-parallel-fetching — child components that need
// data fetch independently, no waterfall at this level.
export default async function HomePage() {
  const [sections, slides, figures, fields, equipments] = await Promise.all([
    getHomepageSections(),
    getHeroSlides(),
    getKeyFigures(),
    getFields(),
    getEquipments()
  ]);

  const renderSection = (id: string) => {
    switch(id) {
      case 'hero': return <HeroBanner key="hero" slides={slides} />;
      case 'fields': return <FieldsCarousel key="fields" fields={fields} />;
      case 'key_figures': return <KeyFigures key="figures" figures={figures} />;
      case 'equipment': return <EquipmentGallery key="equipment" equipments={equipments} />;
      case 'news': return <NewsSection key="news" />;
      case 'awards': return <AwardsSection key="awards" />;
      case 'partners': return <PartnersSection key="partners" />;
      case 'cta': return <CTASection key="cta" />;
      default: return null;
    }
  }

  return (
    <>
      {sections.filter(s => s.enabled).map(s => renderSection(s.id))}
    </>
  );
}
