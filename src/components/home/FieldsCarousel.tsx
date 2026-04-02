"use client";
import Link from "next/link";
import { ArrowRight, Truck, Factory, Hotel, UtensilsCrossed, Plane, Leaf, Building2 } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

const iconMap: Record<string, React.ReactNode> = {
  Truck: <Truck size={24} />,
  Crane: <Factory size={24} />,
  Factory: <Factory size={24} />,
  Hotel: <Hotel size={24} />,
  UtensilsCrossed: <UtensilsCrossed size={24} />,
  Plane: <Plane size={24} />,
  Leaf: <Leaf size={24} />,
  Building2: <Building2 size={24} />,
};

export default function FieldsCarousel({ fields = [] }: { fields?: any[] }) {
  if (!fields.length) return null;

  return (
    <section className="section-padding" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="container-wide">
        <ScrollReveal>
          <SectionHeading
            title="LĨNH VỰC HOẠT ĐỘNG"
            subtitle="7 lĩnh vực kinh doanh đa dạng — 30 năm xây dựng và phát triển"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fields.map((field, i) => (
            <ScrollReveal key={field.id} delay={i * 0.07}>
              <Link href={`/linh-vuc/${field.slug}`} className="group block card-hover bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl">
                {/* Image */}
                <div className="relative overflow-hidden aspect-video">
                  {field.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={field.image} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <ImagePlaceholder
                      label={field.name}
                      className="w-full h-full rounded-none group-hover:scale-105 transition-transform duration-500"
                      aspectRatio="video"
                    />
                  )}
                  {/* Icon overlay */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-sm flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: "var(--orange)" }}>
                    {iconMap[field.icon] || <Factory size={20} />}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-heading font-bold text-gray-900 text-base mb-2 group-hover:text-orange-600 transition-colors">
                    {field.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {field.shortDesc}
                  </p>
                  <span className="flex items-center gap-1 text-orange-500 font-semibold text-sm group-hover:gap-2 transition-all">
                    Xem chi tiết
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
