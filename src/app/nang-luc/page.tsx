import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Năng lực & Thiết bị — HTX Tân Phú",
  description: "Hệ thống thiết bị hiện đại của HTX Tân Phú: đội xe 26 tải, 9 cần cẩu đến 330 tấn, kho bãi 10.000m², công nghệ quản lý tiên tiến.",
};

const equipment = [
  { name: "Xe tải 40 tấn", category: "Xe tải", qty: "2 xe", desc: "Hyundai Xcient, GPS Vietmap, Euro 4" },
  { name: "Xe tải 20–30 tấn", category: "Xe tải", qty: "8 xe", desc: "Tải trọng cao, vận chuyển hàng công nghiệp" },
  { name: "Xe tải 5–15 tấn", category: "Xe tải", qty: "11 xe", desc: "Linh hoạt, giao hàng nội thành và ngoại ô" },
  { name: "Xe tải nhỏ 1.5–3 tấn", category: "Xe tải", qty: "5 xe", desc: "Giao hàng tuyến ngắn, nhanh chóng" },
  { name: "Xe khách 29 chỗ", category: "Xe tải", qty: "5 xe", desc: "Thuê xe hợp đồng nội ngoại tỉnh" },
  { name: "Cần cẩu 330 tấn", category: "Cần cẩu", qty: "1 chiếc", desc: "Liebherr LTM 1300, lớn nhất khu vực" },
  { name: "Cần cẩu 100–150 tấn", category: "Cần cẩu", qty: "3 chiếc", desc: "Lắp đặt thiết bị nhà máy, công trình lớn" },
  { name: "Cần cẩu 50–80 tấn", category: "Cần cẩu", qty: "3 chiếc", desc: "Đa năng, thi công công trình vừa" },
  { name: "Cần cẩu 20–30 tấn", category: "Cần cẩu", qty: "2 chiếc", desc: "Cẩu hàng kho bãi, lắp đặt thiết bị nhỏ" },
  { name: "Kho bãi Yên Bình", category: "Kho bãi", qty: "5.000m²", desc: "Kho chứa thép, có hệ thống PCCC" },
  { name: "Kho bãi Tích Lương", category: "Kho bãi", qty: "5.000m²", desc: "Trung chuyển hàng hóa đa loại" },
  { name: "GPS Vietmap Fleet", category: "Công nghệ", qty: "31 xe", desc: "Theo dõi đội xe 24/7, cảnh báo tốc độ" },
  { name: "Skyhotel PMS", category: "Công nghệ", qty: "1 hệ thống", desc: "Quản lý khách sạn, checkin, báo cáo" },
  { name: "GDS Amadeus", category: "Công nghệ", qty: "1 hệ thống", desc: "Đặt vé toàn cầu, 1000+ hãng bay" },
  { name: "Base.vn HRM", category: "Công nghệ", qty: "1 hệ thống", desc: "Quản lý nhân sự 150+ người" },
];

const categories = ["Tất cả", "Xe tải", "Cần cẩu", "Kho bãi", "Công nghệ"];

export default function NangLucPage() {
  return (
    <div>
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="container-wide py-16">
          <Breadcrumb items={[{ label: "Năng lực & Thiết bị" }]} />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">
            Năng lực & Thiết bị
          </h1>
          <p className="text-blue-200 text-lg mt-2">Cơ sở vật chất hiện đại — Đảm bảo chất lượng dịch vụ</p>
        </div>
      </div>

      <div className="container-wide section-padding">
        {/* Overview */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: "26+", label: "Đầu xe tải các loại", color: "var(--orange)" },
              { value: "9", label: "Cần cẩu (max 330T)", color: "var(--teal)" },
              { value: "10.000m²", label: "Nhà xưởng & Kho bãi", color: "var(--navy)" },
              { value: "35 tỷ", label: "Vốn cố định", color: "#6366f1" },
            ].map((item) => (
              <div key={item.label} className="text-center p-6 rounded-sm bg-gray-50 border-2 border-transparent hover:border-orange-200 transition-colors">
                <div className="font-heading font-black text-3xl mb-2" style={{ color: item.color }}>{item.value}</div>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <SectionHeading title="HỆ THỐNG THIẾT BỊ" subtitle="Đầu tư không ngừng để đáp ứng mọi yêu cầu khách hàng" />

        {/* Equipment grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((eq, i) => (
            <ScrollReveal key={i} delay={i * 0.04}>
              <div className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <ImagePlaceholder label={eq.name} aspectRatio="video" className="rounded-none" iconSize={24} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading font-bold text-gray-900 text-sm flex-1">{eq.name}</h3>
                    <span className="ml-2 px-2 py-0.5 rounded-sm text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: "var(--teal)" }}>
                      {eq.qty}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{eq.desc}</p>
                  <span className="inline-block mt-2 text-xs text-orange-500 font-semibold">{eq.category}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Certifications */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 p-8 rounded-sm" style={{ backgroundColor: "var(--ivory)" }}>
            <SectionHeading title="CHỨNG NHẬN & TIÊU CHUẨN" subtitle="Hoạt động đúng pháp luật, đảm bảo an toàn tuyệt đối" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Giấy phép kinh doanh vận tải hàng hóa hợp lệ",
                "Chứng nhận an toàn lao động cẩu lắp đặt",
                "Chứng nhận VietGAP nông nghiệp hữu cơ",
                "Đại lý vé máy bay cấp 1 được BSP cấp phép",
                "Tiêu chuẩn phòng cháy chữa cháy kho bãi",
                "Kiểm định định kỳ toàn bộ phương tiện",
              ].map((cert, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-sm shadow-sm">
                  <CheckCircle size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-sm">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
