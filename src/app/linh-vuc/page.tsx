import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fields } from "@/data/fields";
import Breadcrumb from "@/components/shared/Breadcrumb";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

export const metadata: Metadata = {
  title: "Lĩnh vực hoạt động — HTX Tân Phú",
  description: "7 lĩnh vực kinh doanh đa dạng của HTX Vận tải Ô tô Tân Phú: vận tải, cẩu lắp đặt, thép, khách sạn, nhà hàng sự kiện, vé máy bay, nông nghiệp hữu cơ.",
};

export default function LinhVucPage() {
  return (
    <div>
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="container-wide py-16">
          <Breadcrumb items={[{ label: "Lĩnh vực hoạt động" }]} />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">
            Lĩnh vực hoạt động
          </h1>
          <p className="text-blue-200 text-lg mt-2">7 ngành kinh tế — Một nền tảng vững chắc</p>
        </div>
      </div>

      <div className="container-wide section-padding">
        <ScrollReveal>
          <SectionHeading
            title="ĐA NGÀNH, CHUYÊN NGHIỆP, UY TÍN"
            subtitle="HTX Tân Phú phát triển 7 lĩnh vực kinh doanh phục vụ mọi nhu cầu"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fields.map((field, i) => (
            <ScrollReveal key={field.id} delay={i * 0.08}>
              <Link href={`/linh-vuc/${field.slug}`} className="group block bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="overflow-hidden">
                  <ImagePlaceholder label={field.name} className="w-full rounded-none group-hover:scale-105 transition-transform duration-500" aspectRatio="video" />
                </div>
                <div className="p-6">
                  <h2 className="font-heading font-bold text-gray-900 text-xl mb-2 group-hover:text-orange-600 transition-colors">{field.name}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{field.description}</p>
                  {field.stats && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {field.stats.slice(0, 2).map((s) => (
                        <div key={s.label} className="bg-gray-50 rounded-sm p-2.5">
                          <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                          <p className="font-heading font-bold text-sm" style={{ color: "var(--navy)" }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="flex items-center gap-1 text-orange-500 font-semibold text-sm group-hover:gap-2 transition-all">
                    Tìm hiểu thêm <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
