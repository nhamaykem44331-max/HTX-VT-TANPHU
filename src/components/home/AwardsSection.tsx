"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { awards } from "@/data/awards";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

export default function AwardsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <ScrollReveal>
          <SectionHeading
            title="THÀNH TÍCH NỔI BẬT"
            subtitle="Những ghi nhận xứng đáng từ Nhà nước, Chính phủ và cộng đồng"
          />
        </ScrollReveal>

        {/* Key achievements text */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              "Huân chương Lao động hạng Ba",
              "Cờ thi đua của Chính phủ",
              "Cúp vàng Hợp tác vì Cộng đồng Thịnh vượng",
              "Thủ tướng khen thưởng cá nhân GĐ Nguyễn Đức Điểm",
            ].map((ach, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-sm" style={{ backgroundColor: "var(--ivory)" }}>
                <Star size={18} className="text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" />
                <p className="text-gray-700 text-sm font-medium leading-snug">{ach}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            aria-label="Xem trước"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-sm bg-white shadow-lg flex items-center justify-center hover:bg-orange-50 transition-colors border border-gray-100"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {awards.map((award) => (
              <div
                key={award.id}
                className="flex-shrink-0 w-56 snap-start bg-white rounded-sm shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
              >
                <ImagePlaceholder label={award.title} className="w-full rounded-none" aspectRatio="portrait" iconSize={28} />
                <div className="p-4 text-center">
                  <p className="font-heading font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{award.title}</p>
                  <p className="text-orange-500 text-xs font-semibold">{award.issuer}</p>
                  <p className="text-gray-400 text-xs mt-1">{award.year}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            aria-label="Xem tiếp"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-sm bg-white shadow-lg flex items-center justify-center hover:bg-orange-50 transition-colors border border-gray-100"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
