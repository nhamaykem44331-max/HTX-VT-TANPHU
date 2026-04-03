import { getPartners } from "@/lib/data-service";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default async function PartnersSection() {
  const partners = await getPartners();
  const partnersWithLogos = partners.filter((partner) => Boolean(partner.logo?.trim()));
  const showcasePartners = partnersWithLogos.length > 0 ? partnersWithLogos : partners;
  const doubled = [...showcasePartners, ...showcasePartners];

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

        <div className="flex w-max gap-6 animate-marquee-slow">
          {doubled.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="flex h-24 min-w-[180px] flex-shrink-0 items-center justify-center rounded-sm border border-gray-100 bg-white px-6 shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md md:h-28 md:min-w-[220px]"
            >
              {partner.logo?.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 w-full object-contain md:max-h-16"
                  loading="lazy"
                />
              ) : (
                <span className="text-center font-heading text-sm font-bold text-gray-600 whitespace-nowrap">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
