import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getNews } from "@/lib/data-service";
import Breadcrumb from "@/components/shared/Breadcrumb";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import { formatDate } from "@/lib/utils";

// @seo-audit: added canonical, openGraph, twitter, keywords
export const metadata: Metadata = {
  title: "Tin tức & Sự kiện — HTX Vận tải Ô tô Tân Phú",
  description: "Cập nhật tin tức mới nhất về HTX Vận tải Ô tô Tân Phú Thái Nguyên: thành tích, sự kiện, đầu tư, công nghệ và hoạt động cộng đồng.",
  keywords: ["tin tức HTX Tân Phú", "sự kiện HTX", "thành tích hợp tác xã Thái Nguyên"],
  alternates: { canonical: "https://htxtanphu.com/tin-tuc" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://htxtanphu.com/tin-tuc",
    title: "Tin tức & Sự kiện — HTX Tân Phú",
    description: "Cập nhật tin tức mới nhất về hoạt động của HTX Vận tải Ô tô Tân Phú.",
    images: [{ url: "https://htxtanphu.com/og-image.jpg", width: 1200, height: 630 }],
  },
};

const categories = ["Tất cả", "Thành tích", "Sự kiện", "Hoạt động", "Đầu tư", "Công nghệ"];

export default async function TinTucPage() {
  const allLatest = await getNews();
  const featured = allLatest.find((n) => n.featured) || allLatest[0];
  
  if (!featured && (!allLatest || allLatest.length === 0)) {
    return <div>Không có bài viết nào.</div>;
  }
  
  const rest = allLatest.filter((n) => n.id !== featured.id);

  return (
    <div>
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="container-wide py-16">
          <Breadcrumb items={[{ label: "Tin tức & Sự kiện" }]} />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">
            Tin tức & Sự kiện
          </h1>
          <p className="text-blue-200 text-lg mt-2">Cập nhật hoạt động mới nhất của HTX Tân Phú</p>
        </div>
      </div>

      <div className="container-wide section-padding">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-sm font-body font-semibold text-sm transition-all ${
                cat === "Tất cả"
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={cat === "Tất cả" ? { backgroundColor: "var(--orange)" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured */}
        <ScrollReveal>
          <Link
            href={`/tin-tuc/${featured.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-shadow mb-12"
          >
            <div className="overflow-hidden">
              <ImagePlaceholder
                label={featured.title}
                className="w-full h-full rounded-none min-h-[260px] group-hover:scale-105 transition-transform duration-500"
                aspectRatio="video"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span
                className="inline-block px-3 py-1 rounded-sm text-xs font-semibold text-white mb-3 self-start"
                style={{ backgroundColor: "var(--orange)" }}
              >
                Tin nổi bật — {featured.category}
              </span>
              <h2 className="font-heading font-bold text-gray-900 text-2xl leading-snug mb-3 group-hover:text-orange-600 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(featured.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {featured.readTime} phút đọc
                  </span>
                </div>
                <span className="flex items-center gap-1 text-orange-500 font-semibold text-sm group-hover:gap-2 transition-all">
                  Đọc tiếp <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        {/* Grid */}
        <SectionHeading title="TẤT CẢ TIN TỨC" centered={false} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article, i) => (
            <ScrollReveal key={article.id} delay={i * 0.07}>
              <Link
                href={`/tin-tuc/${article.slug}`}
                className="group block bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 h-full"
              >
                <div className="overflow-hidden">
                  <ImagePlaceholder
                    label={article.title}
                    className="w-full rounded-none group-hover:scale-105 transition-transform duration-500"
                    aspectRatio="video"
                  />
                </div>
                <div className="p-5">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-sm text-xs font-semibold text-white mb-2"
                    style={{ backgroundColor: "var(--teal)" }}
                  >
                    {article.category}
                  </span>
                  <h3 className="font-heading font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {article.readTime} phút
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="flex justify-center mt-12 gap-2">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={`w-10 h-10 rounded-sm font-body font-semibold text-sm transition-colors ${
                p === 1 ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={p === 1 ? { backgroundColor: "var(--navy)" } : {}}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
