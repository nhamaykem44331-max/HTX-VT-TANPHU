"use client";
// ApplyModal extracted as separate file for dynamic import splitting.
// @react-best-practices bundle-dynamic-imports: this component is only loaded
// when user clicks "Ứng tuyển" — reduces initial JS bundle.

import { useRef, useState } from "react";
import { AlertCircle, FileText, Send, Upload, X } from "lucide-react";
import type { Job } from "@/lib/types";

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
}

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

export default function ApplyModal({ job, onClose }: ApplyModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickCv = (file: File | null) => {
    setError("");

    if (file && file.size > MAX_CV_SIZE_BYTES) {
      setError("File CV tối đa 5MB.");
      return;
    }

    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const form = new FormData(e.currentTarget);
      form.set("jobId", job.id);
      form.set("jobTitle", job.title);
      form.set("jobDepartment", job.department);

      if (cvFile) form.set("cv", cvFile);
      else form.delete("cv");

      const res = await fetch("/api/apply", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));

      // Chỉ báo thành công khi hồ sơ thật sự đã được lưu.
      if (!res.ok) {
        setError(data?.error || "Không gửi được hồ sơ. Vui lòng thử lại.");
        return;
      }

      setSubmitted(true);
      setTimeout(onClose, 3500);
    } catch {
      setError(
        "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại, hoặc gọi hotline 0208.383.2608."
      );
    } finally {
      setSubmitting(false);
    }
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
            <h3 className="font-heading font-bold text-gray-900 text-xl mb-2">Đã nhận hồ sơ!</h3>
            <p className="text-gray-500">Chúng tôi sẽ liên hệ bạn trong vòng 3–5 ngày làm việc.</p>
          </div>
        ) : (
          <>
            <h2 className="font-heading font-bold text-gray-900 text-xl mb-1">Ứng tuyển</h2>
            <p className="text-orange-500 font-semibold text-sm mb-6">
              {job.title} — {job.department}
            </p>

            {error ? (
              <div className="mb-4 flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Họ tên *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    required
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Số điện thoại *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    placeholder="0912 345 678"
                    className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Vị trí ứng tuyển
                </label>
                <input
                  type="text"
                  value={job.title}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-sm border border-gray-200 bg-gray-50 text-sm text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Giới thiệu bản thân
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={3}
                  placeholder="Kinh nghiệm, kỹ năng nổi bật..."
                  className="w-full px-4 py-2.5 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Đính kèm CV
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => pickCv(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />

                {cvFile ? (
                  <div className="flex items-center gap-3 rounded-sm border border-gray-200 bg-gray-50 px-4 py-3">
                    <FileText size={18} className="shrink-0 text-orange-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">{cvFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        pickCv(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      aria-label="Bỏ file CV"
                      className="shrink-0 p-1 text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-sm p-4 text-center hover:border-orange-300 transition-colors"
                  >
                    <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Bấm để chọn file — PDF, DOC, DOCX, tối đa 5MB</p>
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-sm border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="flex-1 btn-primary justify-center disabled:opacity-60">
                  <Send size={16} /> {submitting ? "Đang gửi..." : "Gửi hồ sơ"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
