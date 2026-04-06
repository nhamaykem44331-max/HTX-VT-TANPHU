import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ContactForm from "@/components/shared/ContactForm";
import { COMPANY_INFO } from "@/lib/constants";

// @seo-audit: added canonical, openGraph, keywords
export const metadata: Metadata = {
  title: "Liên hệ HTX Tân Phú — Hotline 0208.383.2608",
  description: "Liên hệ HTX Vận tải Ô tô Tân Phú: trụ sở Thái Nguyên, chi nhánh Sóc Sơn, Phúc Yên, Hòa Bình. Hotline: 0208.383.2608. Tư vấn dịch vụ vận tải, cẩu lắp, khách sạn.",
  keywords: ["liên hệ HTX Tân Phú", "hotline vận tải Thái Nguyên", "tư vấn vận tải hàng hóa"],
  alternates: { canonical: "https://htxtanphu.com/lien-he" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://htxtanphu.com/lien-he",
    title: "Liên hệ HTX Tân Phú — Hotline 0208.383.2608",
    description: "Liên hệ HTX Vận tải Ô tô Tân Phú tại Thái Nguyên. Tư vấn vận tải hàng hóa, cẩu lắp đặt, khách sạn Phương Anh.",
    images: [{ url: "https://htxtanphu.com/og-image.png", width: 945, height: 945 }],
  },
};

const branches = [
  {
    name: "Trụ sở chính — Thái Nguyên",
    address: "Tổ 13, Phường Cam Giá, TP. Thái Nguyên",
    phone: "0208.383.2608",
    hours: "Thứ 2 – Thứ 7: 7:30 – 17:30",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.0!2d105.84!3d21.59!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDM1JzI0LjAiTiAxMDXCsDUwJzI0LjAiRQ!5e0!3m2!1svi!2svn!4v1234567890",
    main: true,
  },
  {
    name: "Chi nhánh Hà Nội",
    address: "Sóc Sơn, Hà Nội",
    phone: "0208.383.2608",
    hours: "Thứ 2 – Thứ 7: 8:00 – 17:00",
    main: false,
  },
  {
    name: "Chi nhánh Vĩnh Phúc",
    address: "Phúc Yên, Vĩnh Phúc",
    phone: "0208.383.2608",
    hours: "Thứ 2 – Thứ 7: 8:00 – 17:00",
    main: false,
  },
  {
    name: "Chi nhánh Hòa Bình",
    address: "Hòa Bình",
    phone: "0208.383.2608",
    hours: "Thứ 2 – Thứ 7: 8:00 – 17:00",
    main: false,
  },
];

export default function LienHePage() {
  return (
    <div>
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="container-wide py-16">
          <Breadcrumb items={[{ label: "Liên hệ" }]} />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-blue-200 text-lg mt-2">Luôn sẵn sàng hỗ trợ bạn mọi lúc</p>
        </div>
      </div>

      {/* Quick contact bar */}
      <div style={{ backgroundColor: "var(--orange)" }}>
        <div className="container-wide py-4">
          <div className="flex flex-wrap gap-6 justify-center md:justify-between items-center">
            <a href={`tel:${COMPANY_INFO.hotlineTel}`} className="flex items-center gap-2 text-white font-semibold text-sm hover:text-white/80 transition-colors">
              <Phone size={16} />
              Hotline: {COMPANY_INFO.hotline}
            </a>
            <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center gap-2 text-white font-semibold text-sm hover:text-white/80 transition-colors">
              <Mail size={16} />
              {COMPANY_INFO.email}
            </a>
            <a href={COMPANY_INFO.zalo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white font-semibold text-sm hover:text-white/80 transition-colors">
              <span className="w-4 h-4 rounded-sm flex items-center justify-center bg-white/20 text-xs font-black">Z</span>
              Chat Zalo
            </a>
            <a href={COMPANY_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white font-semibold text-sm hover:text-white/80 transition-colors">
              <Facebook size={16} />
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="container-wide section-padding">
        {/* Main grid: form + info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Form */}
          <ScrollReveal className="lg:col-span-3">
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
              <SectionHeading title="GỬI YÊU CẦU TƯ VẤN" subtitle="Điền thông tin và chúng tôi sẽ phản hồi trong 24 giờ làm việc" centered={false} />
              <ContactForm title="" />
            </div>
          </ScrollReveal>

          {/* Contact info */}
          <ScrollReveal delay={0.1} className="lg:col-span-2">
            <div className="space-y-6">
              {/* Main office */}
              <div className="p-6 rounded-sm border-2 border-orange-200" style={{ backgroundColor: "var(--ivory)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-sm bg-orange-500" />
                  <h3 className="font-heading font-bold text-gray-900">Trụ sở chính</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <MapPin size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-sm">Tổ 13, Phường Cam Giá, TP. Thái Nguyên</p>
                  </div>
                  <div className="flex gap-3">
                    <Phone size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <a href={`tel:${COMPANY_INFO.hotlineTel}`} className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                      {COMPANY_INFO.hotline}
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Mail size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <Clock size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-sm">Thứ 2 – Thứ 7: 7:30 – 17:30</p>
                  </div>
                </div>
              </div>

              {/* Other branches */}
              {branches.slice(1).map((branch) => (
                <div key={branch.name} className="p-5 rounded-sm bg-gray-50 border border-gray-100">
                  <h4 className="font-heading font-semibold text-gray-900 text-sm mb-3">{branch.name}</h4>
                  <div className="flex gap-2 mb-1.5">
                    <MapPin size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-500 text-xs">{branch.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <Clock size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-500 text-xs">{branch.hours}</p>
                  </div>
                </div>
              ))}

              {/* Special contacts */}
              <div className="p-5 rounded-sm border border-gray-100 bg-white">
                <h4 className="font-heading font-semibold text-gray-900 text-sm mb-3">Đặt phòng Phương Anh</h4>
                <a href="tel:0839881881" className="flex items-center gap-2 text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
                  <Phone size={14} />
                  0839.881.881
                </a>
                <p className="text-gray-400 text-xs mt-1">345 Thống Nhất, Tích Lương, Thái Nguyên</p>
              </div>

              <div className="p-5 rounded-sm border border-gray-100 bg-white">
                <h4 className="font-heading font-semibold text-gray-900 text-sm mb-3">Wonderland Nha Trang</h4>
                <a href="tel:02583551999" className="flex items-center gap-2 text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
                  <Phone size={14} />
                  0258.3551.999
                </a>
                <p className="text-gray-400 text-xs mt-1">Lô 10-11 Phạm Văn Đồng, Nha Trang</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Google Maps */}
        <ScrollReveal>
          <SectionHeading title="VỊ TRÍ TRÊN BẢN ĐỒ" subtitle="Trụ sở chính tại TP. Thái Nguyên" />
          <div className="rounded-sm overflow-hidden shadow-md border border-gray-100" style={{ height: "400px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.2826804744565!2d105.83754107462296!3d21.593031980293644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135197196d76a2b%3A0xbe4f58c5e0f7b22c!2sCam%20Gi%C3%A1%2C%20Th%C3%A0nh%20ph%E1%BB%91%20Th%C3%A1i%20Nguy%C3%AAn%2C%20Th%C3%A1i%20Nguy%C3%AAn!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ HTX Tân Phú"
            />
          </div>
        </ScrollReveal>

        {/* Branch cards */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {branches.map((branch) => (
              <div key={branch.name} className={`p-5 rounded-sm transition-colors ${branch.main ? "border-2 border-orange-300 text-white" : "bg-gray-50 border border-gray-100"}`}
                style={branch.main ? { backgroundColor: "var(--navy)" } : {}}>
                <div className={`w-2 h-2 rounded-sm mb-3 ${branch.main ? "bg-orange-400" : "bg-teal-400"}`} />
                <h4 className={`font-heading font-bold text-sm mb-2 ${branch.main ? "text-white" : "text-gray-900"}`}>{branch.name}</h4>
                <p className={`text-xs mb-1.5 flex items-start gap-1.5 ${branch.main ? "text-blue-200" : "text-gray-500"}`}>
                  <MapPin size={12} className="flex-shrink-0 mt-0.5" />
                  {branch.address}
                </p>
                <p className={`text-xs flex items-center gap-1.5 ${branch.main ? "text-blue-200" : "text-gray-500"}`}>
                  <Clock size={12} />
                  {branch.hours}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
