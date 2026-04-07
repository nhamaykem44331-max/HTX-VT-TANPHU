// @nextjs-best-practices §1 & §6: tuyen-dung/page.tsx was "use client" so
// metadata could not be exported from it. Solution: Server Component wrapper that
// exports metadata and renders the real Client Component.
// @seo-audit: added canonical, openGraph, keywords, proper title length.

import type { Metadata } from "next";
import TuyenDungClient from "./TuyenDungClient";

// @seo-audit: title 57 chars ✓, description 148 chars ✓
export const metadata: Metadata = {
  title: "Tuyển dụng — HTX Vận tải Ô tô Tân Phú Thái Nguyên",
  description:
    "Tuyển dụng tại HTX Vận tải Ô tô Tân Phú: lái xe tải, kỹ thuật viên cẩu, nhân viên kinh doanh, lễ tân khách sạn. Thu nhập 7–25 triệu, đãi ngộ tốt.",
  keywords: ["tuyển dụng Thái Nguyên", "việc làm HTX Tân Phú", "lái xe tải Thái Nguyên", "tuyển lễ tân khách sạn"],
  alternates: { canonical: "https://htxtanphu.com/tuyen-dung" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://htxtanphu.com/tuyen-dung",
    title: "Tuyển dụng — HTX Vận tải Ô tô Tân Phú",
    description: "Cơ hội việc làm tại HTX Tân Phú: vận tải, cẩu lắp, khách sạn, kinh doanh thép. Thu nhập cạnh tranh, môi trường chuyên nghiệp.",
    images: [{ url: "https://htxtanphu.com/og-image.png", width: 945, height: 945 }],
  },
};

// Server Component: exports metadata ✓, delegates interactivity to Client Component
import { getJobs } from "@/lib/data-service";
import { getPageEditorContent } from "@/lib/page-content";

export default async function TuyenDungPage() {
  const [jobs, pageContent] = await Promise.all([getJobs(), getPageEditorContent()]);
  return <TuyenDungClient initialJobs={jobs} pageContent={pageContent.tuyenDung} />;
}
