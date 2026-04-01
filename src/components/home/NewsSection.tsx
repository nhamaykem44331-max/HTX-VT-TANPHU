import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { newsArticles } from "@/data/news";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import { formatDate } from "@/lib/utils";

export default function NewsSection() {
  const featured = newsArticles.find((n) => n.featured) || newsArticles[0];
  const others = newsArticles.filter((n) => n.id !== featured.id).slice(0, 4);

  return (
    <section className="section-padding" style={{ backgroundColor: "var(--ivory)" }}>
      <div className="container-wide">
        <ScrollReveal>
          <SectionHeading
            title="TIN TỨC & SỰ KIỆN"
            subtitle="Cập nhật những hoạt động mới nhất của HTX Tân Phú"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Featured left */}
          <ScrollReveal delay={0.1} className="lg:col-span-3">
            <Link href={`/tin-tuc/${featured.slug}`} className="group block bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
              <div className="overflow-hidden">
                <ImagePlaceholder label={featured.title} className="w-full rounded-none group-hover:scale-105 transition-transform duration-500" aspectRatio="video" />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 rounded-sm text-xs font-semibold text-white mb-3" style={{ backgroundColor: "var(--orange)" }}>
                  {featured.category}
                </span>
                <h3 className="font-heading font-bold text-gray-900 text-xl leading-tight mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {featured.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
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

          {/* Others right */}
          <ScrollReveal delay={0.2} className="lg:col-span-2">
            <div className="flex flex-col gap-4 h-full">
              {others.map((article) => (
                <Link
                  key={article.id}
                  href={`/tin-tuc/${article.slug}`}
                  className="group flex gap-4 bg-white rounded-sm p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden">
                    <ImagePlaceholder label="" className="w-20 h-20 rounded-none" aspectRatio="square" iconSize={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-orange-500 font-semibold">{article.category}</span>
                    <h4 className="font-heading font-semibold text-gray-800 text-sm leading-snug mt-0.5 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(article.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <div className="text-center mt-10">
          <Link href="/tin-tuc" className="btn-navy inline-flex">
            Xem tất cả tin tức <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
