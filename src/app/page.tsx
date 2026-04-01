import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import FieldsCarousel from "@/components/home/FieldsCarousel";
import KeyFigures from "@/components/home/KeyFigures";
import EquipmentGallery from "@/components/home/EquipmentGallery";
import NewsSection from "@/components/home/NewsSection";
import AwardsSection from "@/components/home/AwardsSection";
import PartnersSection from "@/components/home/PartnersSection";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "HTX Vận tải Ô tô Tân Phú — 30 năm hòa hợp cùng phát triển",
  description:
    "HTX Vận tải Ô tô Tân Phú tại Thái Nguyên — 7 lĩnh vực kinh doanh: vận tải hàng hóa, cẩu lắp đặt, kinh doanh thép, khách sạn Phương Anh, đại lý vé máy bay Tân Phú APG.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FieldsCarousel />
      <KeyFigures />
      <EquipmentGallery />
      <NewsSection />
      <AwardsSection />
      <PartnersSection />
      <CTASection />
    </>
  );
}
