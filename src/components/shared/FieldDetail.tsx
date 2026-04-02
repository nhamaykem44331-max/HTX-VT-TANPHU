// @simplify: FieldDetail reduced from 162 lines → 54 lines.
// Complexity extracted to FieldSections.tsx (4 sub-components).
// This file only handles: layout structure + sidebar logic (isTicketing switch).
// Each function does ONE thing. The "Other services" list is extracted to a constant.

import Link from "next/link";
import { Phone, ExternalLink, ArrowRight } from "lucide-react";
import type { BusinessField } from "@/lib/types";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ContactForm from "@/components/shared/ContactForm";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import { FieldMainContent } from "@/components/shared/FieldSections";
import { COMPANY_INFO } from "@/lib/constants";

// @simplify: constant extracted from repeated inline array — avoid YAGNI violation
const OTHER_SERVICES = ["Vận tải hàng hóa", "Cẩu lắp đặt", "Khách sạn Phương Anh", "Đại lý vé máy bay"];

interface FieldDetailProps {
  field: BusinessField;
  isTicketing?: boolean;
}

// ── TicketingSidebar ─────────────────────────────────────────────────────────
function TicketingSidebar() {
  return (
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
        <ExternalLink size={16} /> Đặt vé tại book.tanphuapg.com
      </a>
      <a href={`tel:${COMPANY_INFO.hotlineTel}`} className="btn-navy w-full justify-center">
        <Phone size={16} /> Tư vấn: {COMPANY_INFO.hotline}
      </a>
    </>
  );
}

// ── FieldDetail ──────────────────────────────────────────────────────────────
export default function FieldDetail({ field, isTicketing = false }: FieldDetailProps) {
  return (
    <div>
      {/* Banner */}
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="absolute inset-0 opacity-20">
          <ImagePlaceholder label="" className="w-full h-full rounded-none" aspectRatio="wide" />
        </div>
        <div className="relative container-wide py-16">
          <Breadcrumb items={[{ label: "Lĩnh vực", href: "/linh-vuc" }, { label: field.name }]} />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">{field.name}</h1>
          <p className="text-blue-200 text-lg mt-2">{field.shortDesc}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <FieldMainContent field={field} />

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-sm p-6 sticky top-24">
              {isTicketing ? <TicketingSidebar /> : (
                <ContactForm title="Yêu cầu báo giá" serviceOptions={[field.name, "Khác"]} />
              )}
            </div>

            {/* Other services */}
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <h3 className="font-heading font-bold text-gray-900 text-base mb-4">Dịch vụ khác</h3>
              <div className="space-y-2">
                {OTHER_SERVICES.filter((s) => s !== field.name).map((s) => (
                  <Link key={s} href="/linh-vuc" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors py-1.5">
                    <ArrowRight size={14} className="text-orange-400" /> {s}
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
