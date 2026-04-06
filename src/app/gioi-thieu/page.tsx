import type { Metadata } from "next";
import { timeline } from "@/data/timeline";
import { awards } from "@/data/awards";
import Breadcrumb from "@/components/shared/Breadcrumb";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import { CheckCircle, Star, Target, Eye, Heart } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

// @seo-audit: added canonical, openGraph, keywords
export const metadata: Metadata = {
  title: "Giới thiệu — HTX Vận tải Ô tô Tân Phú Thái Nguyên",
  description: "Tìm hiểu về HTX Vận tải Ô tô Tân Phú — 30 năm phát triển, sứ mệnh tầm nhìn, ban lãnh đạo và thành tích nổi bật tại Thái Nguyên.",
  keywords: ["giới thiệu HTX Tân Phú", "lịch sử hợp tác xã Thái Nguyên", "ban lãnh đạo HTX", "30 năm phát triển"],
  alternates: { canonical: "https://htxtanphu.com/gioi-thieu" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://htxtanphu.com/gioi-thieu",
    title: "Giới thiệu HTX Tân Phú — 30 năm hòa hợp cùng phát triển",
    description: "Tìm hiểu về HTX Vận tải Ô tô Tân Phú: lịch sử, sứ mệnh, ban lãnh đạo và thành tích 30 năm.",
    images: [{ url: "https://htxtanphu.com/og-image.png", width: 945, height: 945 }],
  },
};

const leaders = [
  {
    name: "Nguyễn Đức Điểm",
    title: "Giám đốc HTX",
    bio: "Người sáng lập và dẫn dắt HTX Tân Phú qua 30 năm phát triển. Được Thủ tướng Chính phủ khen thưởng, danh hiệu Doanh nhân tiêu biểu tỉnh Thái Nguyên.",
    awards: ["Thủ tướng khen thưởng", "Doanh nhân tiêu biểu Thái Nguyên"],
  },
  {
    name: "Phó Giám đốc",
    title: "Phó Giám đốc phụ trách Kỹ thuật",
    bio: "Phụ trách kỹ thuật và an toàn vận hành đội xe, cẩu. Kinh nghiệm 20+ năm trong ngành vận tải và cơ khí.",
    awards: ["Chiến sĩ thi đua cơ sở"],
  },
  {
    name: "Kế toán trưởng",
    title: "Kế toán trưởng",
    bio: "Quản lý tài chính, kế toán cho toàn bộ 7 lĩnh vực kinh doanh của HTX. Đảm bảo minh bạch, hiệu quả tài chính.",
    awards: ["Lao động giỏi"],
  },
];

export default function GioiThieuPage() {
  return (
    <div>
      {/* Page Banner */}
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="absolute inset-0 opacity-20">
          <ImagePlaceholder label="" className="w-full h-full rounded-none" aspectRatio="wide" />
        </div>
        <div className="relative container-wide py-16">
          <Breadcrumb items={[{ label: "Giới thiệu" }]} />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">
            Giới thiệu HTX Tân Phú
          </h1>
          <p className="text-blue-200 text-lg mt-2">30 năm hòa hợp cùng phát triển</p>
        </div>
      </div>

      {/* Side nav + content */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Side nav */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 bg-gray-50 rounded-sm p-5">
              <p className="font-heading font-bold text-gray-500 text-xs tracking-widest uppercase mb-4">Nội dung</p>
              {[
                { href: "#gioi-thieu", label: "Giới thiệu chung" },
                { href: "#su-menh", label: "Sứ mệnh & Tầm nhìn" },
                { href: "#lich-su", label: "Lịch sử 30 năm" },
                { href: "#ban-lanh-dao", label: "Ban lãnh đạo" },
                { href: "#thanh-tich", label: "Thành tích" },
                { href: "#trach-nhiem", label: "Trách nhiệm XH" },
              ].map((item) => (
                <a key={item.href} href={item.href} className="block py-2.5 px-3 rounded-sm text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors font-body font-medium mb-1">
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-20">
            {/* Giới thiệu chung */}
            <section id="gioi-thieu">
              <SectionHeading title="Giới thiệu chung" centered={false} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    <strong className="text-gray-900">HTX Vận tải Ô tô Tân Phú</strong> được thành lập năm 1995 tại Thái Nguyên, là một trong những hợp tác xã lớn và uy tín nhất tỉnh với hơn 30 năm xây dựng và phát triển.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Từ một đơn vị vận tải nhỏ, HTX đã không ngừng mở rộng, hiện diện trong 7 lĩnh vực kinh doanh đa dạng, tạo việc làm ổn định cho hơn 150 lao động, đóng góp tích cực vào phát triển kinh tế địa phương.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {[
                      { label: "Thành lập", value: "1995" },
                      { label: "Nhân sự", value: "150+" },
                      { label: "Doanh thu", value: "~3.000 tỷ" },
                      { label: "MST", value: COMPANY_INFO.taxCode },
                    ].map((item) => (
                      <div key={item.label} className="bg-gray-50 rounded-sm p-4">
                        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">{item.label}</p>
                        <p className="font-heading font-bold text-navy text-lg" style={{ color: "var(--navy)" }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <ImagePlaceholder label="HTX Tân Phú — Trụ sở chính" aspectRatio="video" className="rounded-sm" />
              </div>
            </section>

            {/* Sứ mệnh & Tầm nhìn */}
            <section id="su-menh">
              <SectionHeading title="Sứ mệnh & Tầm nhìn" centered={false} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Target,
                    title: "Sứ mệnh",
                    color: "var(--orange)",
                    desc: "Cung cấp dịch vụ vận tải, cẩu lắp đặt, thương mại và dịch vụ đa dạng với chất lượng cao nhất, tạo giá trị bền vững cho khách hàng, thành viên và cộng đồng.",
                  },
                  {
                    icon: Eye,
                    title: "Tầm nhìn",
                    color: "var(--teal)",
                    desc: "Trở thành tập đoàn HTX đa ngành hàng đầu khu vực Đông Bắc Việt Nam vào năm 2030, với doanh thu 5.000 tỷ và 300+ nhân sự chuyên nghiệp.",
                  },
                  {
                    icon: Heart,
                    title: "Giá trị cốt lõi",
                    color: "var(--navy)",
                    desc: "Uy tín — Chuyên nghiệp — Đoàn kết — Sáng tạo — Phát triển bền vững. \"Gieo Uy Tín, Gặt Thành Công\" là kim chỉ nam trong mọi hoạt động.",
                  },
                ].map((item) => (
                  <div key={item.title} className="p-6 rounded-sm border-2 border-gray-100 hover:border-orange-200 transition-colors">
                    <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-4" style={{ backgroundColor: item.color + "20" }}>
                      <item.icon size={22} style={{ color: item.color }} />
                    </div>
                    <h3 className="font-heading font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section id="lich-su">
              <SectionHeading title="Lịch sử 30 năm phát triển" centered={false} />
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {timeline.map((event, i) => (
                    <ScrollReveal key={i} delay={i * 0.05}>
                      <div className="flex gap-6 relative">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-sm flex items-center justify-center z-10 font-heading font-black text-xs ${event.milestone ? "text-white shadow-lg" : "bg-white border-2 border-gray-200 text-gray-500"}`}
                          style={event.milestone ? { backgroundColor: "var(--orange)" } : {}}>
                          {event.year.slice(2)}
                        </div>
                        <div className={`flex-1 pb-4 ${event.milestone ? "bg-orange-50 rounded-sm p-5 -mt-1" : ""}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-heading font-bold text-orange-500 text-sm">{event.year}</span>
                            {event.milestone && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-sm text-xs font-semibold">Mốc quan trọng</span>}
                          </div>
                          <h4 className="font-heading font-bold text-gray-900 mb-2">{event.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Ban lãnh đạo */}
            <section id="ban-lanh-dao">
              <SectionHeading title="Ban lãnh đạo" centered={false} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaders.map((leader, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="bg-white rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                      <ImagePlaceholder label={leader.name} aspectRatio="portrait" className="rounded-none" iconSize={40} />
                      <div className="p-5">
                        <h3 className="font-heading font-bold text-gray-900 text-base">{leader.name}</h3>
                        <p className="text-orange-500 font-semibold text-sm mb-3">{leader.title}</p>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{leader.bio}</p>
                        <div className="flex flex-col gap-1">
                          {leader.awards.map((aw) => (
                            <span key={aw} className="flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                              <CheckCircle size={12} className="text-teal-500 flex-shrink-0" />
                              {aw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>

            {/* Thành tích */}
            <section id="thanh-tich">
              <SectionHeading title="Thành tích & Giải thưởng" centered={false} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {awards.map((aw) => (
                  <div key={aw.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-sm hover:bg-orange-50 transition-colors">
                    <Star size={20} className="text-orange-400 flex-shrink-0 mt-0.5" fill="currentColor" />
                    <div>
                      <p className="font-heading font-bold text-gray-900 text-sm">{aw.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{aw.issuer} — {aw.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trách nhiệm xã hội */}
            <section id="trach-nhiem">
              <SectionHeading title="Trách nhiệm xã hội" centered={false} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Tạo việc làm", desc: "Tạo việc làm ổn định cho hơn 150 lao động địa phương với thu nhập bình quân 12–20 triệu/tháng, đóng BHXH đầy đủ." },
                  { title: "Đóng góp ngân sách", desc: "Nộp ngân sách nhà nước hàng tỷ đồng mỗi năm, góp phần phát triển hạ tầng và dịch vụ công địa phương." },
                  { title: "Hỗ trợ cộng đồng", desc: "Thường xuyên tham gia các hoạt động từ thiện, hỗ trợ hộ nghèo, trẻ em khó khăn tại tỉnh Thái Nguyên." },
                  { title: "Phát triển bền vững", desc: "Ứng dụng nông nghiệp hữu cơ VietGAP, giảm thiểu tác động môi trường trong hoạt động vận tải và cẩu lắp." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-sm hover:shadow-md transition-shadow">
                    <div className="w-2 h-2 rounded-sm mt-2 flex-shrink-0" style={{ backgroundColor: "var(--teal)" }} />
                    <div>
                      <h4 className="font-heading font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
