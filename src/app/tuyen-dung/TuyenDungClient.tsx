"use client";
// @react-best-practices §5 rerender-functional-setstate: dùng functional
// setState cho stable callbacks.
// @react-best-practices §2 bundle-dynamic-imports: ApplyModal lazy-loaded
// vì chỉ cần khi user bấm "Ứng tuyển", không cần trong initial bundle.
// @typescript-best-practices §16: typed React.FormEvent<HTMLFormElement>.

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Building2, Calendar, Send } from "lucide-react";
import { jobs } from "@/data/jobs";
import Breadcrumb from "@/components/shared/Breadcrumb";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import type { Job } from "@/lib/types";

// @react-best-practices bundle-dynamic-imports — modal only loads when needed
const ApplyModal = dynamic(() => import("./ApplyModal"), { ssr: false });

const fieldFilters = [
  "Tất cả",
  "Tân Phú APG",
  "Vận tải",
  "Cẩu lắp đặt",
  "Khách sạn Phương Anh",
  "Nhà hàng & Sự kiện",
  "Kinh doanh Thép",
];

// @simplify: typeLabel moved to utility function — avoid inline ternary chain
function getTypeLabel(type: Job["type"]): string {
  const labels: Record<Job["type"], string> = {
    "full-time": "Toàn thời gian",
    "part-time": "Bán thời gian",
    contract: "Hợp đồng",
  };
  return labels[type];
}

function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  return (
    <div className="bg-white rounded-sm shadow-sm hover:shadow-xl transition-shadow border border-gray-100 p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-bold text-gray-900 text-lg leading-snug mb-1">{job.title}</h3>
          <p className="text-orange-500 font-semibold text-sm">{job.department}</p>
        </div>
        <span className="px-3 py-1 rounded-sm text-xs font-semibold text-white flex-shrink-0 ml-3" style={{ backgroundColor: "var(--teal)" }}>
          {getTypeLabel(job.type)}
        </span>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><MapPin size={12} className="text-orange-400" />{job.location}</span>
        <span className="flex items-center gap-1"><Building2 size={12} className="text-orange-400" />{job.department}</span>
        <span className="flex items-center gap-1"><Calendar size={12} className="text-orange-400" />HSD: {new Date(job.deadline).toLocaleDateString("vi-VN")}</span>
      </div>

      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {job.requirements.slice(0, 1).map((req, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-sm text-xs line-clamp-1 max-w-[200px]">{req}</span>
          ))}
        </div>
        <button onClick={() => onApply(job)} className="btn-primary text-sm px-4 py-2 flex-shrink-0">
          Ứng tuyển
        </button>
      </div>
    </div>
  );
}

export default function TuyenDungClient({ initialJobs }: { initialJobs: Job[] }) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  // @typescript-best-practices: typed state, no 'any'
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const filtered = activeFilter === "Tất cả"
    ? initialJobs
    : initialJobs.filter((j) => j.department === activeFilter);

  // @react-best-practices rerender-functional-setstate: stable close callback
  const handleClose = useCallback(() => setApplyJob(null), []);

  return (
    <div>
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="container-wide py-16">
          <Breadcrumb items={[{ label: "Tuyển dụng" }]} />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">Tuyển dụng</h1>
          <p className="text-blue-200 text-lg mt-2">Cùng HTX Tân Phú — Xây dựng sự nghiệp bền vững</p>
        </div>
      </div>

      <div className="container-wide section-padding">
        {/* Why join */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14 p-8 rounded-sm" style={{ backgroundColor: "var(--ivory)" }}>
            {[
              { icon: "💰", title: "Thu nhập cạnh tranh", desc: "Lương + thưởng + hoa hồng hấp dẫn" },
              { icon: "📈", title: "Cơ hội thăng tiến", desc: "Môi trường phát triển rõ ràng" },
              { icon: "🏥", title: "Phúc lợi đầy đủ", desc: "BHXH, BHYT, BHTN theo quy định" },
              { icon: "🎓", title: "Đào tạo chuyên sâu", desc: "Được đào tạo bài bản tại chỗ" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-heading font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <SectionHeading title="VỊ TRÍ ĐANG TUYỂN" subtitle={`${initialJobs.length} vị trí đang chờ ứng viên tài năng`} />

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {fieldFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-sm font-body font-semibold text-sm transition-all ${
                activeFilter === f ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={activeFilter === f ? { backgroundColor: "var(--navy)" } : {}}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Jobs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((job, i) => (
            <ScrollReveal key={job.id} delay={i * 0.08}>
              <JobCard job={job} onApply={setApplyJob} />
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Không có vị trí nào trong lĩnh vực này hiện tại.</p>
          </div>
        )}

        {/* CTA */}
        <ScrollReveal delay={0.2}>
          <div className="mt-14 p-8 rounded-sm text-center" style={{ background: "linear-gradient(135deg, var(--navy-dark), var(--navy))" }}>
            <h3 className="font-heading font-bold text-white text-2xl mb-3">Không thấy vị trí phù hợp?</h3>
            <p className="text-blue-200 mb-6">Gửi CV của bạn cho chúng tôi — chúng tôi luôn tìm kiếm nhân tài xuất sắc.</p>
            <a href="mailto:tuyendung@htxtanphu.com" className="btn-primary inline-flex">
              <Send size={16} /> Gửi CV ứng tuyển tự do
            </a>
          </div>
        </ScrollReveal>
      </div>

      {/* @react-best-practices: Modal only renders when applyJob is set */}
      {applyJob && <ApplyModal job={applyJob} onClose={handleClose} />}
    </div>
  );
}
