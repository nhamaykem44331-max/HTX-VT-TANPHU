'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X } from 'lucide-react'
import FormField from './FormField'
import { supabase } from '@/lib/supabase'
import { fields } from '@/data/fields'

const jobSchema = z.object({
  title: z.string().min(3, "Tên vị trí ít nhất 3 ký tự"),
  department: z.string().min(2, "Nhập phòng ban"),
  location: z.string().default("Thái Nguyên"),
  type: z.enum(["full-time", "part-time", "contract"]),
  deadline: z.string().min(1, "Chọn hạn nộp"),
  fieldId: z.string().min(1, "Chọn lĩnh vực"),
  description: z.string().min(20, "Mô tả ít nhất 20 ký tự"),
  requirements: z.array(z.object({ value: z.string().min(1, 'Yêu cầu không được để trống') })).min(1, "Ít nhất 1 yêu cầu"),
  benefits: z.array(z.object({ value: z.string().min(1, 'Quyền lợi không được để trống') })).min(1, "Ít nhất 1 quyền lợi"),
  published: z.boolean().default(true),
})

type JobFormDataRaw = z.infer<typeof jobSchema>

// Map UI arrays of objects to simple string arrays for Supabase DB
type JobFormDataSupabase = Omit<JobFormDataRaw, 'requirements' | 'benefits' | 'fieldId'> & {
  requirements: string[],
  benefits: string[],
  field_id: string
}

interface JobFormProps {
  initialData?: Partial<JobFormDataSupabase> & { id?: string }
  mode: 'create' | 'edit'
}

export default function JobForm({ initialData, mode }: JobFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Map incoming Supabase data string arrays back to object arrays for useFieldArray
  const defaultValues: Partial<JobFormDataRaw> = initialData ? {
    ...initialData,
    fieldId: initialData.field_id,
    requirements: initialData.requirements?.map(r => ({ value: r })) || [{ value: '' }],
    benefits: initialData.benefits?.map(b => ({ value: b })) || [{ value: '' }]
  } : {
    location: 'Thái Nguyên',
    type: 'full-time',
    published: true,
    requirements: [{ value: '' }],
    benefits: [{ value: '' }]
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormDataRaw>({
    resolver: zodResolver(jobSchema),
    defaultValues: defaultValues as any,
  })

  const {
    fields: reqFields,
    append: appendReq,
    remove: removeReq
  } = useFieldArray({ control, name: "requirements" })

  const {
    fields: benFields,
    append: appendBen,
    remove: removeBen
  } = useFieldArray({ control, name: "benefits" })

  const onSubmit = async (data: JobFormDataRaw) => {
    setLoading(true)
    setErrorMsg('')
    try {
      const dbPayload: JobFormDataSupabase = {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        deadline: data.deadline,
        description: data.description,
        published: data.published,
        field_id: data.fieldId,
        requirements: data.requirements.map((r: any) => r.value),
        benefits: data.benefits.map((b: any) => b.value),
      }

      if (mode === 'create') {
        const { error } = await supabase.from('jobs').insert(dbPayload)
        if (error) throw error
      } else if (mode === 'edit' && initialData?.id) {
        const { error } = await supabase.from('jobs').update(dbPayload).eq('id', initialData.id)
        if (error) throw error
      }
      router.push('/admin/tuyen-dung')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi lưu vị trí')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gap-6 flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-6">
          <FormField label="Tên vị trí" required error={errors.title?.message}>
            <input
              {...register('title')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="VD: Kế toán trưởng..."
            />
          </FormField>

          <FormField label="Mô tả công việc" required error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-y"
              placeholder="Mô tả tóm tắt về công việc..."
            />
          </FormField>

          {/* Yêu cầu ứng viên */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-gray-800">Yêu cầu ứng viên <span className="text-red-500 ml-1">*</span></label>
            {reqFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    {...register(`requirements.${index}.value` as const)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    placeholder={`Yêu cầu ${index + 1}...`}
                  />
                  {errors.requirements?.[index]?.value && (
                    <span className="text-xs text-red-500">{errors.requirements[index]?.value?.message}</span>
                  )}
                </div>
                <button type="button" onClick={() => removeReq(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-0.5">
                  <X size={18} />
                </button>
              </div>
            ))}
            {errors.requirements?.root && <p className="text-red-500 text-xs">{errors.requirements.root.message}</p>}
            <button
              type="button"
              onClick={() => appendReq({ value: '' })}
              className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 w-fit mt-1"
            >
              <Plus size={16} /> Thêm yêu cầu
            </button>
          </div>

          {/* Quyền lợi */}
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-5 mt-2">
            <label className="block text-sm font-semibold text-gray-800">Quyền lợi <span className="text-red-500 ml-1">*</span></label>
            {benFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  <input
                    {...register(`benefits.${index}.value` as const)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                    placeholder={`Quyền lợi ${index + 1}...`}
                  />
                  {errors.benefits?.[index]?.value && (
                    <span className="text-xs text-red-500">{errors.benefits[index]?.value?.message}</span>
                  )}
                </div>
                <button type="button" onClick={() => removeBen(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-0.5">
                  <X size={18} />
                </button>
              </div>
            ))}
            {errors.benefits?.root && <p className="text-red-500 text-xs">{errors.benefits.root.message}</p>}
            <button
              type="button"
              onClick={() => appendBen({ value: '' })}
              className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 w-fit mt-1"
            >
              <Plus size={16} /> Thêm quyền lợi
            </button>
          </div>

          {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
        </div>
      </div>

      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">Cài đặt</h3>
          
          <FormField label="Phòng ban" required error={errors.department?.message}>
            <input
              {...register('department')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500"
            />
          </FormField>

          <FormField label="Địa điểm làm việc" required error={errors.location?.message}>
            <input
              {...register('location')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500"
            />
          </FormField>

          <FormField label="Lĩnh vực" required error={errors.fieldId?.message}>
            <select
              {...register('fieldId')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Chọn lĩnh vực...</option>
              {fields.map((f) => (
                <option key={f.slug} value={f.slug}>{f.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Loại hình" required error={errors.type?.message}>
            <select
              {...register('type')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="full-time">Toàn thời gian (Full-time)</option>
              <option value="part-time">Bán thời gian (Part-time)</option>
              <option value="contract">Hợp đồng (Contract)</option>
            </select>
          </FormField>

          <FormField label="Hạn nộp hồ sơ" required error={errors.deadline?.message}>
            <input
              {...register('deadline')}
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500"
            />
          </FormField>

          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('published')} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 h-4 w-4" />
              <span className="text-sm text-gray-700">Công khai (Published)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/tuyen-dung')}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-center font-semibold transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2.5 font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : (mode === 'create' ? 'Tạo vị trí' : 'Lưu vị trí')}
          </button>
        </div>
      </div>
    </form>
  )
}
