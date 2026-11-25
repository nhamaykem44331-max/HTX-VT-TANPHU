"use client";
import { useRef } from "react";
import { Award as AwardIcon, ChevronLeft, ChevronRight, Flag, Medal, Star, Trophy } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import type { Award } from "@/lib/types";

function pickAwardIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("huân chương")) return Medal;
  if (t.includes("cờ")) return Flag;
  if (t.includes("cúp")) return Trophy;
  return AwardIcon;
}

/** Thẻ thay cho ảnh khi thành tích chưa có ảnh chụp thật: biểu tượng theo loại + năm nhận. */
function AwardEmblem({ title, year }: { title: string; year: string }) {
  const Icon = pickAwardIcon(title);
  return (
    <div
      className="relative flex aspect-[3/4] flex-col items-center justify-center gap-4 overflow-hidden"
      style={{ background: "linear-gradient(160deg, var(--navy) 0%, var(--navy-dark) 100%)" }}
      aria-hidden
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/10" />
      <div className="absolute -bottom-14 -left-8 h-36 w-36 rounded-full border border-white/5" />
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(227, 120, 58, 0.15)", border: "2px solid var(--orange)" }}
      >
        <Icon size={36} className="text-orange-400" strokeWidth={1.75} />
      </div>
      {year ? <span className="font-heading text-2xl font-bold tracking-wider text-white/90">{year}</span> : null}
    </div>
  );
}

export default function AwardsSectionClient({ awards }: { awards: Award[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (!awards || awards.length === 0) return null;

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
                {award.image ? (
                  <div className="aspect-[3/4] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={award.image} alt={award.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <AwardEmblem title={award.title} year={award.year} />
                )}
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
