"use client";
// ApplyModal extracted as separate file for dynamic import splitting.
// @react-best-practices bundle-dynamic-imports: this component is only loaded
// when user clicks "Ứng tuyển" — reduces initial JS bundle.
// @typescript-best-practices: typed React.FormEvent<HTMLFormElement>, no 'any'.

import { useState } from "react";
import { Send, Upload } from "lucide-react";
import type { Job } from "@/lib/types";

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
}

export default function ApplyModal({ job, onClose }: ApplyModalProps) {
  const [submitted, setSubmitted] = useState(false);

  // @typescript-best-practices: typed event handler, not `any`
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(onClose, 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

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
                  <Send size={16} /> Gửi hồ sơ
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
