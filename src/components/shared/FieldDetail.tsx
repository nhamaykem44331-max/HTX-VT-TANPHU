import Link from "next/link";
import { ArrowRight, ExternalLink, Phone } from "lucide-react";
import type { BusinessField } from "@/lib/types";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ContactForm from "@/components/shared/ContactForm";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import { FieldMainContent } from "@/components/shared/FieldSections";
import { COMPANY_INFO } from "@/lib/constants";

const OTHER_SERVICES = [
  { name: "Vận tải hàng hóa", slug: "van-tai" },
  { name: "Cẩu lắp đặt", slug: "cau-lap-dat" },
  { name: "Khách sạn Phương Anh", slug: "khach-san-phuong-anh" },
  { name: "Đại lý vé máy bay", slug: "ve-may-bay" },
];

interface FieldDetailProps {
  field: BusinessField;
  isTicketing?: boolean;
}

function TicketingSidebar() {
  return (
    <>
      <h3 className="mb-4 font-heading text-lg font-bold text-gray-900">Đặt vé trực tuyến</h3>
      <p className="mb-5 text-sm leading-relaxed text-gray-600">
        Truy cập cổng đặt vé của Tân Phú APG để tìm kiếm và đặt vé máy bay nội địa, quốc tế với
        giá tốt nhất.
      </p>
      <a
        href="https://book.tanphuapg.com"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mb-4 w-full justify-center"
      >
        <ExternalLink size={16} /> Đặt vé tại book.tanphuapg.com
      </a>
      <a href={`tel:${COMPANY_INFO.hotlineTel}`} className="btn-navy w-full justify-center">
        <Phone size={16} /> Tư vấn: {COMPANY_INFO.hotline}
      </a>
    </>
  );
}

function BannerMedia({ field }: { field: BusinessField }) {
  if (!field.image) {
    return <ImagePlaceholder label="" className="h-full w-full rounded-none" aspectRatio="wide" />;
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={field.image} alt={field.name} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,31,68,0.88),rgba(10,31,68,0.65),rgba(10,31,68,0.4))]" />
    </>
  );
}

export default function FieldDetail({ field, isTicketing = false }: FieldDetailProps) {
  return (
    <div>
      <div className="relative overflow-hidden" style={{ backgroundColor: "var(--navy)" }}>
        <div className="absolute inset-0 opacity-30">
          <BannerMedia field={field} />
        </div>
        <div className="relative container-wide py-16">
          <Breadcrumb items={[{ label: "Lĩnh vực", href: "/linh-vuc" }, { label: field.name }]} />
          <h1 className="mt-4 font-heading text-4xl font-black text-white md:text-5xl">{field.name}</h1>
          <p className="mt-2 text-lg text-blue-100">{field.shortDesc}</p>
        </div>
      </div>

      <div className="container-wide py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <FieldMainContent field={field} />

          <div className="space-y-6">
            <div className="sticky top-24 rounded-sm bg-gray-50 p-6">
              {isTicketing ? (
                <TicketingSidebar />
              ) : (
                <ContactForm title="Yêu cầu báo giá" serviceOptions={[field.name, "Khác"]} />
              )}
            </div>

            <div className="rounded-sm border border-gray-100 bg-white p-6">
              <h3 className="mb-4 font-heading text-base font-bold text-gray-900">Dịch vụ khác</h3>
              <div className="space-y-2">
                {OTHER_SERVICES.filter((service) => service.slug !== field.slug).map((service) => (
                  <Link
                    key={service.slug}
                    href={`/linh-vuc/${service.slug}`}
                    className="flex items-center gap-2 py-1.5 text-sm text-gray-600 transition-colors hover:text-orange-500"
                  >
                    <ArrowRight size={14} className="text-orange-400" /> {service.name}
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
