import { partners } from "@/data/partners";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function PartnersSection() {
  const doubled = [...partners, ...partners];

  return (
    <section className="section-padding" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="container-wide">
        <ScrollReveal>
          <SectionHeading
            title="ĐỐI TÁC TIN CẬY"
            subtitle="Cùng phát triển bền vững với những thương hiệu hàng đầu"
          />
        </ScrollReveal>
      </div>

      <div className="overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--ivory), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--ivory), transparent)" }} />

        <div className="flex gap-6 animate-marquee w-max">
          {doubled.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="flex-shrink-0 h-14 px-6 bg-white rounded-sm shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md hover:border-orange-200 transition-all duration-300"
              style={{ minWidth: "160px" }}
            >
              <span className="font-heading font-bold text-gray-600 text-sm text-center whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
