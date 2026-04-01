import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, ExternalLink } from "lucide-react";
import type { BusinessField } from "@/lib/types";
import Breadcrumb from "@/components/shared/Breadcrumb";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import ContactForm from "@/components/shared/ContactForm";
import { COMPANY_INFO } from "@/lib/constants";

interface FieldDetailProps {
  field: BusinessField;
  isTicketing?: boolean;
}

export default function FieldDetail({ field, isTicketing = false }: FieldDetailProps) {
  return (
    <div>
      {/* Banner */}
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="absolute inset-0 opacity-20">
          <ImagePlaceholder label="" className="w-full h-full rounded-none" aspectRatio="wide" />
        </div>
        <div className="relative container-wide py-16">
          <Breadcrumb
            items={[
              { label: "Lĩnh vực", href: "/linh-vuc" },
              { label: field.name },
            ]}
          />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">
            {field.name}
          </h1>
          <p className="text-blue-200 text-lg mt-2">{field.shortDesc}</p>
        </div>
      </div>

      <div className="container-wide py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
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

            {/* Thông số */}
            {field.stats && (
              <ScrollReveal delay={0.1}>
                <SectionHeading title="Thông số kỹ thuật" centered={false} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {field.stats.map((s) => (
                    <div key={s.label} className="text-center p-5 rounded-sm border-2 border-gray-100 hover:border-orange-200 transition-colors">
                      <p className="font-heading font-black text-2xl mb-1" style={{ color: "var(--navy)" }}>{s.value}</p>
                      <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Tính năng nổi bật */}
            {field.features && (
              <ScrollReveal delay={0.15}>
                <SectionHeading title="Điểm nổi bật" centered={false} />
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {field.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-teal-50 rounded-sm">
                      <CheckCircle size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            )}

            {/* Dịch vụ */}
            {field.services && (
              <ScrollReveal delay={0.2}>
                <SectionHeading title="Dịch vụ cung cấp" centered={false} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {field.services.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-sm hover:bg-orange-50 transition-colors">
                      <ArrowRight size={16} className="text-orange-400 flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">{s}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Gallery */}
            <ScrollReveal delay={0.25}>
              <SectionHeading title="Hình ảnh thực tế" centered={false} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <ImagePlaceholder key={n} label={`${field.name} ${n}`} aspectRatio="video" className="rounded-sm" iconSize={20} />
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick contact */}
            <div className="bg-gray-50 rounded-sm p-6 sticky top-24">
              {isTicketing ? (
                <>
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-4">Đặt vé trực tuyến</h3>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    Truy cập cổng đặt vé của Tân Phú APG để tìm kiếm và đặt vé máy bay nội địa, quốc tế với giá tốt nhất.
                  </p>
                  <a
                    href="https://book.tanphuapg.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center mb-4"
                  >
                    <ExternalLink size={16} />
                    Đặt vé tại book.tanphuapg.com
                  </a>
                  <a
                    href={`tel:${COMPANY_INFO.hotlineTel}`}
                    className="btn-navy w-full justify-center"
                  >
                    <Phone size={16} />
                    Tư vấn: {COMPANY_INFO.hotline}
                  </a>
                </>
              ) : (
                <ContactForm
                  title="Yêu cầu báo giá"
                  serviceOptions={[field.name, "Khác"]}
                />
              )}
            </div>

            {/* Other fields */}
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <h3 className="font-heading font-bold text-gray-900 text-base mb-4">Dịch vụ khác</h3>
              <div className="space-y-2">
                {["Vận tải hàng hóa", "Cẩu lắp đặt", "Khách sạn Phương Anh", "Đại lý vé máy bay"].filter(s => s !== field.name).map((s) => (
                  <Link key={s} href="/linh-vuc" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors py-1.5">
                    <ArrowRight size={14} className="text-orange-400" />
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
