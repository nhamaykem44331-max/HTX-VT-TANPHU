'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField from './FormField'
import ImageUploader from './ImageUploader'
import { supabase } from '@/lib/supabase'

const newsSchema = z.object({
  title: z.string().min(5, "Tiêu đề ít nhất 5 ký tự"),
  slug: z.string().min(3, "Slug ít nhất 3 ký tự").regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang"),
  category: z.string().min(1, "Chọn chuyên mục"),
  excerpt: z.string().min(10, "Tóm tắt ít nhất 10 ký tự").max(300, "Tối đa 300 ký tự"),
  content: z.string().min(50, "Nội dung ít nhất 50 ký tự"),
  image: z.string().default(''),
  author: z.string().default('Ban Biên tập'),
  date: z.string().min(1, "Chọn ngày"),
  readTime: z.coerce.number().min(1).max(30).default(3),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})

type NewsFormData = z.infer<typeof newsSchema>
type NewsFormInputData = Partial<NewsFormData> & { id?: string; read_time?: number | null }
type NewsFormDataSupabase = Omit<NewsFormData, 'readTime'> & { read_time: number }

interface NewsFormProps {
  initialData?: NewsFormInputData
  mode: 'create' | 'edit'
}

function generateSlug(text: string) {
  return text
    .toString()
    .normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, '') // xóa các ký tự dấu
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // xóa ký tự đặc biệt
    .replace(/[\s_-]+/g, '-') // thay thế space, underscore, gạch ngang liên tiếp bằng một gạch ngang
    .replace(/^-+|-+$/g, '') // xóa gạch ngang ở đầu và cuối
}

export default function NewsForm({ initialData, mode }: NewsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [slugModified, setSlugModified] = useState(mode === 'edit')
  const defaultValues: NewsFormData = {
    category: initialData?.category ?? 'Tin tức',
    date: initialData?.date ?? new Date().toISOString().split('T')[0],
    author: initialData?.author ?? 'Ban Biên tập',
    readTime: initialData?.readTime ?? initialData?.read_time ?? 3,
    featured: initialData?.featured ?? false,
    published: initialData?.published ?? true,
    image: initialData?.image ?? '',
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    excerpt: initialData?.excerpt ?? '',
    content: initialData?.content ?? '',
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues,
  })

  // Auto-generate slug when title changes unless user has manually modified slug
  const title = watch('title')
  useEffect(() => {
    if (title && !slugModified) {
      setValue('slug', generateSlug(title), { shouldValidate: true })
    }
  }, [title, slugModified, setValue])

  const onSubmit = async (data: NewsFormData) => {
    setLoading(true)
    setErrorMsg('')
    try {
      // Supabase schema uses snake_case column names while the form uses camelCase.
      const dbPayload: NewsFormDataSupabase = {
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        author: data.author,
        date: data.date,
        read_time: data.readTime,
        featured: data.featured,
        published: data.published,
      }

      if (mode === 'create') {
        const { error } = await supabase.from('news').insert(dbPayload)
        if (error) throw error
      } else if (mode === 'edit' && initialData?.id) {
        const { error } = await supabase.from('news').update(dbPayload).eq('id', initialData.id)
        if (error) throw error
      }
      router.push('/admin/tin-tuc')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi lưu bài viết')
    } finally {
      setLoading(false)
    }
  }

  const excerptValue = watch('excerpt') || ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="gap-6 flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
          <FormField label="Tiêu đề" required error={errors.title?.message}>
            <input
              {...register('title')}
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Nhập tiêu đề bài viết..."
            />
          </FormField>

          <FormField label="Đường dẫn tĩnh (Slug)" required error={errors.slug?.message}>
            <input
              {...register('slug')}
              type="text"
              onChange={(e) => {
                setSlugModified(true)
                setValue('slug', e.target.value)
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="duong-dan-bai-viet"
            />
          </FormField>

          <FormField label="Tóm tắt" required error={errors.excerpt?.message}>
            <textarea
              {...register('excerpt')}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              placeholder="Đoạn tóm tắt ngắn gọn..."
            />
            <p className="text-right text-xs text-gray-500 mt-1">{excerptValue.length} / 300 ký tự</p>
          </FormField>

          <FormField label="Nội dung" required error={errors.content?.message}>
            <textarea
              {...register('content')}
              rows={12}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-y"
              placeholder="Nội dung chính của bài viết..."
            />
          </FormField>
          
          {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
        </div>
      </div>

      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">Cài đặt</h3>
          
          <FormField label="Chuyên mục" required error={errors.category?.message}>
            <select
              {...register('category')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="Tin tức">Tin tức</option>
              <option value="Sự kiện">Sự kiện</option>
              <option value="Thành tích">Thành tích</option>
              <option value="CSR">CSR</option>
            </select>
          </FormField>

          <FormField label="Ngày đăng" required error={errors.date?.message}>
            <input
              {...register('date')}
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </FormField>

          <FormField label="Tác giả" error={errors.author?.message}>
            <input
              {...register('author')}
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </FormField>

          <FormField label="Thời gian đọc (phút)" error={errors.readTime?.message}>
            <input
              {...register('readTime')}
              type="number"
              min={1}
              max={30}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </FormField>

          <FormField label="Hình ảnh cover" error={errors.image?.message}>
            <ImageUploader
              value={watch('image') || ''}
              onChange={(url) => setValue('image', url, { shouldValidate: true, shouldDirty: true })}
              folder="news"
              aspectRatio="video"
            />
          </FormField>

          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 h-4 w-4" />
              <span className="text-sm text-gray-700">Bài viết nổi bật</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('published')} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 h-4 w-4" />
              <span className="text-sm text-gray-700">Công khai (Published)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/tin-tuc')}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-center font-semibold transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2.5 font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : (mode === 'create' ? 'Tạo bài viết' : 'Lưu bài viết')}
          </button>
        </div>
      </div>
    </form>
  )
}
