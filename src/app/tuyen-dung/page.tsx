"use client";
import { useState } from "react";
import { MapPin, Clock, Building2, Calendar, Send, Upload } from "lucide-react";
import { jobs } from "@/data/jobs";
import Breadcrumb from "@/components/shared/Breadcrumb";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import type { Job } from "@/lib/types";

const fieldFilters = [
  "Tất cả",
  "Tân Phú APG",
  "Vận tải",
  "Cẩu lắp đặt",
  "Khách sạn Phương Anh",
  "Nhà hàng & Sự kiện",
  "Kinh doanh Thép",
];

function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  const typeLabel = job.type === "full-time" ? "Toàn thời gian" : job.type === "part-time" ? "Bán thời gian" : "Hợp đồng";

  return (
    <div className="bg-white rounded-sm shadow-sm hover:shadow-xl transition-shadow border border-gray-100 p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-bold text-gray-900 text-lg leading-snug mb-1">{job.title}</h3>
          <p className="text-orange-500 font-semibold text-sm">{job.department}</p>
        </div>
        <span className="px-3 py-1 rounded-sm text-xs font-semibold text-white flex-shrink-0 ml-3" style={{ backgroundColor: "var(--teal)" }}>
          {typeLabel}
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
        <button
          onClick={() => onApply(job)}
          className="btn-primary text-sm px-4 py-2 flex-shrink-0"
        >
          Ứng tuyển
        </button>
      </div>
    </div>
  );
}

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(onClose, 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <Send size={28} className="text-teal-600" />
            </div>
            <h3 className="font-heading font-bold text-gray-900 text-xl mb-2">Ứng tuyển thành công!</h3>
            <p className="text-gray-500">Chúng tôi sẽ liên hệ bạn trong vòng 3–5 ngày làm việc.</p>
          </div>
        ) : (
          <>
            <h2 className="font-heading font-bold text-gray-900 text-xl mb-1">Ứng tuyển</h2>
            <p className="text-orange-500 font-semibold text-sm mb-6">{job.title} — {job.department}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ tên *</label>
                  <input required type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại *</label>
                  <input required type="tel" placeholder="0912 345 678" className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                <input required type="email" placeholder="email@example.com" className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vị trí ứng tuyển</label>
                <input type="text" value={job.title} readOnly className="w-full px-4 py-2.5 rounded-sm border border-gray-200 bg-gray-50 text-sm text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giới thiệu bản thân</label>
                <textarea rows={3} placeholder="Kinh nghiệm, kỹ năng nổi bật..." className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload CV (mock)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-sm p-4 text-center hover:border-orange-300 transition-colors cursor-pointer">
                  <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">PDF, DOC — Tối đa 5MB</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-sm border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Hủy
                </button>
                <button type="submit" className="flex-1 btn-primary justify-center">
                  <Send size={16} />
                  Gửi hồ sơ
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function TuyenDungPage() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const filtered = activeFilter === "Tất cả"
    ? jobs
    : jobs.filter((j) => j.department === activeFilter);

  return (
    <div>
      <div className="relative" style={{ backgroundColor: "var(--navy)" }}>
        <div className="container-wide py-16">
          <Breadcrumb items={[{ label: "Tuyển dụng" }]} />
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl mt-4">
            Tuyển dụng
          </h1>
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

        <SectionHeading
          title="VỊ TRÍ ĐANG TUYỂN"
          subtitle={`${jobs.length} vị trí đang chờ ứng viên tài năng`}
        />

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
            <h3 className="font-heading font-bold text-white text-2xl mb-3">
              Không thấy vị trí phù hợp?
            </h3>
            <p className="text-blue-200 mb-6">
              Gửi CV của bạn cho chúng tôi — chúng tôi luôn tìm kiếm nhân tài xuất sắc.
            </p>
            <a href="mailto:tuyendung@htxtanphu.com" className="btn-primary inline-flex">
              <Send size={16} />
              Gửi CV ứng tuyển tự do
            </a>
          </div>
        </ScrollReveal>
      </div>

      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
}
