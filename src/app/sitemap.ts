import { MetadataRoute } from "next";
import { newsArticles } from "@/data/news";
import { fields } from "@/data/fields";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://htxtanphu.com";

  const staticRoutes = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/gioi-thieu`, priority: 0.8 },
    { url: `${baseUrl}/linh-vuc`, priority: 0.9 },
    { url: `${baseUrl}/nang-luc`, priority: 0.7 },
    { url: `${baseUrl}/tin-tuc`, priority: 0.8 },
    { url: `${baseUrl}/tuyen-dung`, priority: 0.7 },
    { url: `${baseUrl}/lien-he`, priority: 0.8 },
  ].map((route) => ({
    ...route,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
  }));

  const fieldRoutes = fields.map((field) => ({
    url: `${baseUrl}/linh-vuc/${field.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const newsRoutes = newsArticles.map((article) => ({
    url: `${baseUrl}/tin-tuc/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...fieldRoutes, ...newsRoutes];
}
