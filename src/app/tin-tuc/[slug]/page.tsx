import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, User, Tag } from "lucide-react";
import { newsArticles } from "@/data/news";
import { getNewsBySlug, getNews } from "@/lib/data-service";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} — HTX Tân Phú`,
    description: article.excerpt,
    alternates: {
      canonical: `https://htxtanphu.com/tin-tuc/${params.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://htxtanphu.com/tin-tuc/${params.slug}`,
      publishedTime: article.date,
      images: [
        {
          url: article.image || "https://htxtanphu.com/og-image.png",
          width: 945,
          height: 945,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.excerpt,
      images: [article.image || "https://htxtanphu.com/og-image.png"],
    },
  };
}

export default async function TinTucDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getNewsBySlug(params.slug);
  if (!article) notFound();

  const allNews = await getNews(4);
  const related = allNews.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div>
      {/* Banner */}
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="container-wide py-12">
          <Breadcrumb
            items={[
              { label: "Tin tức", href: "/tin-tuc" },
              { label: article.category, href: "/tin-tuc" },
              { label: article.title.slice(0, 40) + "..." },
            ]}
          />
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article */}
          <article className="lg:col-span-2">
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6 font-medium"
            >
              <ArrowLeft size={16} />
              Quay lại danh sách
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "var(--orange)" }}
              >
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={12} />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                {article.readTime} phút đọc
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <User size={12} />
                {article.author}
              </span>
            </div>

            <h1 className="font-heading font-black text-gray-900 text-3xl md:text-4xl leading-tight mb-6">
              {article.title}
            </h1>

            {/* Featured image */}
            {article.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.image}
                alt={article.title}
                className="mb-8 w-full rounded-2xl object-cover"
              />
            ) : (
              <ImagePlaceholder
                label={article.title}
                aspectRatio="video"
                className="rounded-2xl mb-8"
              />
            )}

            {/* Excerpt */}
            <p className="text-gray-600 text-lg leading-relaxed mb-6 font-medium border-l-4 pl-5 italic" style={{ borderColor: "var(--orange)" }}>
              {article.excerpt}
            </p>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              {article.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4 text-[15px]">
                  {para}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-gray-400" />
              {[article.category, "HTX Tân Phú", "Thái Nguyên"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="sticky top-24">
              <h3 className="font-heading font-bold text-gray-900 text-base mb-5">
                Tin liên quan
              </h3>
              <div className="space-y-4">
                {related.map((rel) => (
                  <ScrollReveal key={rel.id}>
                    <Link
                      href={`/tin-tuc/${rel.slug}`}
                      className="group flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                        {rel.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={rel.image} alt={rel.title} className="h-20 w-20 object-cover" />
                        ) : (
                          <ImagePlaceholder
                            label=""
                            className="w-20 h-20 rounded-none"
                            aspectRatio="square"
                            iconSize={18}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-orange-500 font-semibold">
                          {rel.category}
                        </span>
                        <h4 className="font-heading font-semibold text-gray-800 text-sm leading-snug mt-0.5 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(rel.date)}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              <div
                className="mt-8 p-6 rounded-2xl text-center"
                style={{ backgroundColor: "var(--navy)" }}
              >
                <p className="font-heading font-bold text-white text-base mb-2">
                  Liên hệ tư vấn
                </p>
                <p className="text-blue-200 text-sm mb-4">
                  Cần hỗ trợ? Gọi cho chúng tôi ngay.
                </p>
                <a
                  href="tel:02083832608"
                  className="btn-primary w-full justify-center"
                >
                  0208.383.2608
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
