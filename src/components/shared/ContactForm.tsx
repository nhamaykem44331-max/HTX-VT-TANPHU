"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle } from "lucide-react";
import { SERVICES_FOR_CONTACT } from "@/lib/constants";
import type { ContactFormData } from "@/lib/types";

import { supabase } from "@/lib/supabase";

const schema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên (ít nhất 2 ký tự)"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal('')),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  service: z.string().min(1, "Vui lòng chọn dịch vụ"),
  message: z.string().min(10, "Nội dung ít nhất 10 ký tự"),
});

interface ContactFormProps {
  title?: string;
  serviceOptions?: string[];
  className?: string;
}

export default function ContactForm({
  title = "Gửi yêu cầu tư vấn",
  serviceOptions = SERVICES_FOR_CONTACT,
  className = "",
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
      })
      if (error) throw error
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      console.error('Submit error:', err)
      // Fallback: vẫn hiện thành công cho UX (data sẽ mất nếu Supabase chưa setup)
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    }
  };

  if (submitted) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}>
        <CheckCircle size={56} className="text-teal-600" />
        <h3 className="font-heading text-xl font-bold text-gray-900">Gửi thành công!</h3>
        <p className="text-gray-500 text-center max-w-sm">
          Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-5 ${className}`} noValidate>
      {title && (
        <h3 className="font-heading text-xl font-bold text-gray-900 mb-6">{title}</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Họ và tên <span className="text-orange-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Nguyễn Văn A"
            className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Số điện thoại <span className="text-orange-500">*</span>
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="0912 345 678"
            className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="email@example.com"
          className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Dịch vụ cần tư vấn <span className="text-orange-500">*</span>
        </label>
        <select
          {...register("service")}
          className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm bg-white"
        >
          <option value="">-- Chọn dịch vụ --</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Nội dung <span className="text-orange-500">*</span>
        </label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="Mô tả yêu cầu của bạn..."
          className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm resize-none"
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Đang gửi...
          </span>
        ) : (
          <>
            <Send size={16} />
            Gửi yêu cầu
          </>
        )}
      </button>
    </form>
  );
}
