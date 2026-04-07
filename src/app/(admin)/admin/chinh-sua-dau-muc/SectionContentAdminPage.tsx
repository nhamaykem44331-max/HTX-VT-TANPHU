'use client'

import { type ReactNode, useState } from 'react'
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  CheckCircle,
  Factory,
  Newspaper,
  Phone,
  Plus,
  Save,
  Trash2,
  Truck,
} from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { supabase } from '@/lib/supabase'
import {
  PAGE_EDITOR_CONTENT_KEY,
  type EditableBranchItem,
  type EditableCardItem,
  type EditableLeaderItem,
  type EditableSpecialContactItem,
  type EditableStatItem,
  type EditableTimelineItem,
  type PageEditorContent,
} from '@/lib/page-content'
import type { Job, NewsArticle } from '@/lib/types'
import FieldsAdminPage from '../linh-vuc/page'
import EquipmentsAdminPage from '../thiet-bi/page'
import AwardsAdminPage from '../giai-thuong/page'
import NewsTable from '../tin-tuc/NewsTable'
import JobTable from '../tuyen-dung/JobTable'

type TabKey =
  | 'gioi-thieu'
  | 'linh-vuc'
  | 'nang-luc'
  | 'tin-tuc'
  | 'tuyen-dung'
  | 'lien-he'

const tabs: Array<{
  id: TabKey
  label: string
  icon: typeof BookOpen
  description: string
}> = [
  {
    id: 'gioi-thieu',
    label: 'Giới thiệu',
    icon: BookOpen,
    description: 'Banner, nội dung, ảnh, timeline, lãnh đạo và giải thưởng',
  },
  {
    id: 'linh-vuc',
    label: 'Lĩnh vực',
    icon: Factory,
    description: 'Banner trang lĩnh vực và toàn bộ đầu mục lĩnh vực',
  },
  {
    id: 'nang-luc',
    label: 'Năng lực',
    icon: Truck,
    description: 'Banner, chỉ số tổng quan, chứng nhận và thiết bị',
  },
  {
    id: 'tin-tuc',
    label: 'Tin tức',
    icon: Newspaper,
    description: 'Banner, nhóm danh mục và danh sách bài viết',
  },
  {
    id: 'tuyen-dung',
    label: 'Tuyển dụng',
    icon: Briefcase,
    description: 'Banner, lợi ích, bộ lọc và danh sách vị trí',
  },
  {
    id: 'lien-he',
    label: 'Liên hệ',
    icon: Phone,
    description: 'Banner, thông tin liên hệ, chi nhánh và bản đồ',
  },
]

function cloneList<T>(list: T[]) {
  return JSON.parse(JSON.stringify(list)) as T[]
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-heading text-xl font-bold text-gray-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      />
    </div>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm leading-relaxed focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      />
    </div>
  )
}

function ArrayToolbar({
  title,
  description,
  addLabel,
  onAdd,
}: {
  title: string
  description?: string
  addLabel: string
  onAdd: () => void
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description ? <p className="mt-1 text-xs text-gray-500">{description}</p> : null}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  )
}

function ImageField({
  label,
  value,
  onChange,
  aspectRatio = 'wide',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto'
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
        <ImageUploader
          value={value}
          onChange={onChange}
          folder="page-content"
          aspectRatio={aspectRatio}
        />
      </div>
    </div>
  )
}

function StringListEditor({
  title,
  description,
  values,
  onChange,
  addLabel,
  placeholder,
  multiline = false,
}: {
  title: string
  description?: string
  values: string[]
  onChange: (values: string[]) => void
  addLabel: string
  placeholder?: string
  multiline?: boolean
}) {
  const updateItem = (index: number, nextValue: string) => {
    const nextItems = [...values]
    nextItems[index] = nextValue
    onChange(nextItems)
  }

  const removeItem = (index: number) => {
    onChange(values.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <SectionCard title={title} description={description}>
      <ArrayToolbar
        title="Danh sách mục"
        description="Thêm, sửa hoặc xóa trực tiếp từng dòng nội dung."
        addLabel={addLabel}
        onAdd={() => onChange([...values, ''])}
      />

      <div className="space-y-4">
        {values.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
            Chưa có dữ liệu.
          </div>
        ) : null}

        {values.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Mục {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </div>

            {multiline ? (
              <textarea
                value={item}
                onChange={(event) => updateItem(index, event.target.value)}
                rows={4}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            ) : (
              <input
                value={item}
                onChange={(event) => updateItem(index, event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function StatListEditor({
  title,
  description,
  items,
  onChange,
}: {
  title: string
  description?: string
  items: EditableStatItem[]
  onChange: (items: EditableStatItem[]) => void
}) {
  const updateItem = (index: number, patch: Partial<EditableStatItem>) => {
    const nextItems = cloneList(items)
    nextItems[index] = { ...nextItems[index], ...patch }
    onChange(nextItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <SectionCard title={title} description={description}>
      <ArrayToolbar
        title="Danh sách chỉ số"
        addLabel="Thêm chỉ số"
        onAdd={() => onChange([...items, { label: '', value: '', color: '' }])}
      />

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Chỉ số {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <InputField
                label="Nhãn"
                value={item.label}
                onChange={(value) => updateItem(index, { label: value })}
              />
              <InputField
                label="Giá trị"
                value={item.value}
                onChange={(value) => updateItem(index, { value })}
              />
              <InputField
                label="Màu chữ"
                value={item.color || ''}
                onChange={(value) => updateItem(index, { color: value })}
                placeholder="var(--orange) hoặc #1d4ed8"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function CardListEditor({
  title,
  description,
  items,
  onChange,
  addLabel,
}: {
  title: string
  description?: string
  items: EditableCardItem[]
  onChange: (items: EditableCardItem[]) => void
  addLabel: string
}) {
  const updateItem = (index: number, patch: Partial<EditableCardItem>) => {
    const nextItems = cloneList(items)
    nextItems[index] = { ...nextItems[index], ...patch }
    onChange(nextItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <SectionCard title={title} description={description}>
      <ArrayToolbar
        title="Danh sách thẻ nội dung"
        addLabel={addLabel}
        onAdd={() =>
          onChange([...items, { title: '', description: '', iconKey: '', color: '' }])
        }
      />

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Thẻ {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Tiêu đề"
                value={item.title}
                onChange={(value) => updateItem(index, { title: value })}
              />
              <InputField
                label="Khóa icon"
                value={item.iconKey || ''}
                onChange={(value) => updateItem(index, { iconKey: value })}
                placeholder="target, eye, heart, shield..."
              />
            </div>
            <div className="mt-4">
              <TextareaField
                label="Mô tả"
                value={item.description}
                onChange={(value) => updateItem(index, { description: value })}
                rows={4}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Màu nhấn"
                value={item.color || ''}
                onChange={(value) => updateItem(index, { color: value })}
                placeholder="var(--teal) hoặc #f97316"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function TimelineListEditor({
  title,
  description,
  items,
  onChange,
}: {
  title: string
  description?: string
  items: EditableTimelineItem[]
  onChange: (items: EditableTimelineItem[]) => void
}) {
  const updateItem = (index: number, patch: Partial<EditableTimelineItem>) => {
    const nextItems = cloneList(items)
    nextItems[index] = { ...nextItems[index], ...patch }
    onChange(nextItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <SectionCard title={title} description={description}>
      <ArrayToolbar
        title="Các mốc lịch sử"
        addLabel="Thêm mốc"
        onAdd={() =>
          onChange([...items, { year: '', title: '', description: '', milestone: false }])
        }
      />

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Mốc {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Năm"
                value={item.year}
                onChange={(value) => updateItem(index, { year: value })}
              />
              <InputField
                label="Tiêu đề"
                value={item.title}
                onChange={(value) => updateItem(index, { title: value })}
              />
            </div>
            <div className="mt-4">
              <TextareaField
                label="Mô tả"
                value={item.description}
                onChange={(value) => updateItem(index, { description: value })}
                rows={4}
              />
            </div>
            <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(item.milestone)}
                onChange={(event) => updateItem(index, { milestone: event.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              Đánh dấu là mốc quan trọng
            </label>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function LeaderListEditor({
  title,
  description,
  items,
  onChange,
}: {
  title: string
  description?: string
  items: EditableLeaderItem[]
  onChange: (items: EditableLeaderItem[]) => void
}) {
  const updateItem = (index: number, patch: Partial<EditableLeaderItem>) => {
    const nextItems = cloneList(items)
    nextItems[index] = { ...nextItems[index], ...patch }
    onChange(nextItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <SectionCard title={title} description={description}>
      <ArrayToolbar
        title="Thành viên lãnh đạo"
        addLabel="Thêm người"
        onAdd={() =>
          onChange([...items, { name: '', title: '', bio: '', image: '', awards: [] }])
        }
      />

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Lãnh đạo {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
              <ImageField
                label="Ảnh đại diện"
                value={item.image}
                onChange={(value) => updateItem(index, { image: value })}
                aspectRatio="square"
              />
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Họ tên"
                    value={item.name}
                    onChange={(value) => updateItem(index, { name: value })}
                  />
                  <InputField
                    label="Chức vụ"
                    value={item.title}
                    onChange={(value) => updateItem(index, { title: value })}
                  />
                </div>
                <TextareaField
                  label="Tiểu sử"
                  value={item.bio}
                  onChange={(value) => updateItem(index, { bio: value })}
                  rows={5}
                />
                <TextareaField
                  label="Thành tích, mỗi dòng một mục"
                  value={item.awards.join('\n')}
                  onChange={(value) =>
                    updateItem(index, {
                      awards: value
                        .split('\n')
                        .map((award) => award.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function BranchListEditor({
  title,
  description,
  items,
  onChange,
}: {
  title: string
  description?: string
  items: EditableBranchItem[]
  onChange: (items: EditableBranchItem[]) => void
}) {
  const updateItem = (index: number, patch: Partial<EditableBranchItem>) => {
    const nextItems = cloneList(items)
    nextItems[index] = { ...nextItems[index], ...patch }
    onChange(nextItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <SectionCard title={title} description={description}>
      <ArrayToolbar
        title="Danh sách chi nhánh"
        addLabel="Thêm chi nhánh"
        onAdd={() =>
          onChange([
            ...items,
            { name: '', address: '', phone: '', hours: '', mapEmbed: '', main: false },
          ])
        }
      />

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Chi nhánh {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Tên hiển thị"
                value={item.name}
                onChange={(value) => updateItem(index, { name: value })}
              />
              <InputField
                label="Số điện thoại"
                value={item.phone}
                onChange={(value) => updateItem(index, { phone: value })}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextareaField
                label="Địa chỉ"
                value={item.address}
                onChange={(value) => updateItem(index, { address: value })}
                rows={3}
              />
              <TextareaField
                label="Giờ làm việc"
                value={item.hours}
                onChange={(value) => updateItem(index, { hours: value })}
                rows={3}
              />
            </div>
            <div className="mt-4">
              <TextareaField
                label="Google Maps embed"
                value={item.mapEmbed || ''}
                onChange={(value) => updateItem(index, { mapEmbed: value })}
                rows={4}
              />
            </div>
            <label className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={Boolean(item.main)}
                onChange={(event) => updateItem(index, { main: event.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              Đặt là chi nhánh chính
            </label>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function SpecialContactListEditor({
  title,
  description,
  items,
  onChange,
}: {
  title: string
  description?: string
  items: EditableSpecialContactItem[]
  onChange: (items: EditableSpecialContactItem[]) => void
}) {
  const updateItem = (index: number, patch: Partial<EditableSpecialContactItem>) => {
    const nextItems = cloneList(items)
    nextItems[index] = { ...nextItems[index], ...patch }
    onChange(nextItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <SectionCard title={title} description={description}>
      <ArrayToolbar
        title="Liên hệ chuyên biệt"
        addLabel="Thêm liên hệ"
        onAdd={() => onChange([...items, { title: '', phone: '', subtitle: '' }])}
      />

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Liên hệ {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Xóa
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Tiêu đề"
                value={item.title}
                onChange={(value) => updateItem(index, { title: value })}
              />
              <InputField
                label="Số điện thoại"
                value={item.phone}
                onChange={(value) => updateItem(index, { phone: value })}
              />
            </div>
            <div className="mt-4">
              <TextareaField
                label="Mô tả phụ"
                value={item.subtitle}
                onChange={(value) => updateItem(index, { subtitle: value })}
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default function SectionContentAdminPage({
  initialContent,
  initialNews,
  initialJobs,
}: {
  initialContent: PageEditorContent
  initialNews: NewsArticle[]
  initialJobs: Job[]
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('gioi-thieu')
  const [content, setContent] = useState<PageEditorContent>(initialContent)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const updateSectionField = (
    section: keyof PageEditorContent,
    field: string,
    value: unknown
  ) => {
    setContent((prev) => {
      const currentSection = prev[section] as Record<string, unknown>
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value,
        },
      } as PageEditorContent
    })
  }

  const saveContent = async () => {
    setSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const { error } = await supabase.from('site_settings').upsert({
        key: PAGE_EDITOR_CONTENT_KEY,
        value: content,
      })

      if (error) throw error

      setSuccessMessage('Đã lưu nội dung đầu mục thành công.')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      setErrorMessage(error?.message || 'Không thể lưu nội dung đầu mục.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Chỉnh sửa đầu mục</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-500">
            Quản lý tập trung toàn bộ nội dung của các đầu mục trên website. Những phần đã có CRUD
            riêng như lĩnh vực, thiết bị, tin tức, tuyển dụng và giải thưởng được gom lại tại đây để
            thao tác thuận tiện hơn.
          </p>
        </div>

        <button
          type="button"
          onClick={saveContent}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Đang lưu...' : 'Lưu nội dung đầu mục'}
        </button>
      </div>

      {successMessage ? (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle className="mt-0.5 shrink-0" size={18} />
          <p>{successMessage}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                    active
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <tab.icon size={18} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${active ? 'text-orange-700' : 'text-gray-900'}`}>
                        {tab.label}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{tab.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        <div className="space-y-6">
          {activeTab === 'gioi-thieu' ? (
            <>
              <SectionCard
                title="Banner trang Giới thiệu"
                description="Cho phép đổi tiêu đề, mô tả và ảnh đầu trang."
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <InputField
                      label="Tiêu đề banner"
                      value={content.gioiThieu.bannerTitle}
                      onChange={(value) => updateSectionField('gioiThieu', 'bannerTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả banner"
                      value={content.gioiThieu.bannerSubtitle}
                      onChange={(value) => updateSectionField('gioiThieu', 'bannerSubtitle', value)}
                      rows={3}
                    />
                  </div>
                  <ImageField
                    label="Ảnh banner"
                    value={content.gioiThieu.bannerImage}
                    onChange={(value) => updateSectionField('gioiThieu', 'bannerImage', value)}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Giới thiệu chung"
                description="Sửa tiêu đề phần mở đầu, các đoạn mô tả, ảnh minh họa và các ô chỉ số."
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <InputField
                      label="Tiêu đề phần"
                      value={content.gioiThieu.introTitle}
                      onChange={(value) => updateSectionField('gioiThieu', 'introTitle', value)}
                    />
                    <StringListEditor
                      title="Các đoạn nội dung"
                      description="Mỗi mục sẽ hiển thị thành một đoạn văn riêng."
                      values={content.gioiThieu.introParagraphs}
                      onChange={(values) => updateSectionField('gioiThieu', 'introParagraphs', values)}
                      addLabel="Thêm đoạn"
                      placeholder="Nhập đoạn mô tả..."
                      multiline
                    />
                  </div>
                  <ImageField
                    label="Ảnh minh họa"
                    value={content.gioiThieu.introImage}
                    onChange={(value) => updateSectionField('gioiThieu', 'introImage', value)}
                    aspectRatio="video"
                  />
                </div>
              </SectionCard>

              <StatListEditor
                title="Chỉ số giới thiệu"
                description="Bạn có thể thay số liệu doanh thu bằng chỉ số khác ngay tại đây."
                items={content.gioiThieu.introStats}
                onChange={(items) => updateSectionField('gioiThieu', 'introStats', items)}
              />

              <SectionCard
                title="Tiêu đề các khối Giới thiệu"
                description="Điều chỉnh các heading lớn xuất hiện trong trang Giới thiệu."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Tiêu đề khối sứ mệnh"
                    value={content.gioiThieu.missionTitle}
                    onChange={(value) => updateSectionField('gioiThieu', 'missionTitle', value)}
                  />
                  <InputField
                    label="Tiêu đề khối lịch sử"
                    value={content.gioiThieu.timelineTitle}
                    onChange={(value) => updateSectionField('gioiThieu', 'timelineTitle', value)}
                  />
                  <InputField
                    label="Tiêu đề khối lãnh đạo"
                    value={content.gioiThieu.leadersTitle}
                    onChange={(value) => updateSectionField('gioiThieu', 'leadersTitle', value)}
                  />
                  <InputField
                    label="Tiêu đề khối trách nhiệm xã hội"
                    value={content.gioiThieu.responsibilityTitle}
                    onChange={(value) =>
                      updateSectionField('gioiThieu', 'responsibilityTitle', value)
                    }
                  />
                </div>
              </SectionCard>

              <CardListEditor
                title="Sứ mệnh, tầm nhìn, giá trị cốt lõi"
                description="Quản lý các thẻ nội dung ở phần định hướng phát triển."
                items={content.gioiThieu.missionCards}
                onChange={(items) => updateSectionField('gioiThieu', 'missionCards', items)}
                addLabel="Thêm thẻ"
              />

              <TimelineListEditor
                title="Lịch sử phát triển"
                description="Thêm, sửa, xóa các mốc thời gian của HTX."
                items={content.gioiThieu.timelineItems}
                onChange={(items) => updateSectionField('gioiThieu', 'timelineItems', items)}
              />

              <LeaderListEditor
                title="Ban lãnh đạo"
                description="Quản lý thông tin và ảnh từng thành viên lãnh đạo."
                items={content.gioiThieu.leaders}
                onChange={(items) => updateSectionField('gioiThieu', 'leaders', items)}
              />

              <CardListEditor
                title="Trách nhiệm xã hội"
                description="Danh sách nội dung về đóng góp cộng đồng và phát triển bền vững."
                items={content.gioiThieu.responsibilities}
                onChange={(items) => updateSectionField('gioiThieu', 'responsibilities', items)}
                addLabel="Thêm nội dung"
              />

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-heading text-xl font-bold text-gray-900">Giải thưởng</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Phần này đã được nhúng trực tiếp để quản lý cùng nhóm Giới thiệu.
                  </p>
                </div>
                <AwardsAdminPage />
              </div>
            </>
          ) : null}

          {activeTab === 'linh-vuc' ? (
            <>
              <SectionCard
                title="Banner trang Lĩnh vực"
                description="Tiêu đề và ảnh đầu trang của mục Lĩnh vực."
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <InputField
                      label="Tiêu đề banner"
                      value={content.linhVuc.bannerTitle}
                      onChange={(value) => updateSectionField('linhVuc', 'bannerTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả banner"
                      value={content.linhVuc.bannerSubtitle}
                      onChange={(value) => updateSectionField('linhVuc', 'bannerSubtitle', value)}
                      rows={3}
                    />
                    <InputField
                      label="Tiêu đề section"
                      value={content.linhVuc.sectionTitle}
                      onChange={(value) => updateSectionField('linhVuc', 'sectionTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả section"
                      value={content.linhVuc.sectionSubtitle}
                      onChange={(value) => updateSectionField('linhVuc', 'sectionSubtitle', value)}
                      rows={3}
                    />
                  </div>
                  <ImageField
                    label="Ảnh banner"
                    value={content.linhVuc.bannerImage}
                    onChange={(value) => updateSectionField('linhVuc', 'bannerImage', value)}
                  />
                </div>
              </SectionCard>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-heading text-xl font-bold text-gray-900">Toàn bộ lĩnh vực</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Quản lý tên, mô tả, ảnh đại diện, bài viết chi tiết và thư viện ảnh của từng lĩnh vực.
                  </p>
                </div>
                <FieldsAdminPage />
              </div>
            </>
          ) : null}

          {activeTab === 'nang-luc' ? (
            <>
              <SectionCard
                title="Banner trang Năng lực"
                description="Tiêu đề, mô tả và ảnh đầu trang."
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <InputField
                      label="Tiêu đề banner"
                      value={content.nangLuc.bannerTitle}
                      onChange={(value) => updateSectionField('nangLuc', 'bannerTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả banner"
                      value={content.nangLuc.bannerSubtitle}
                      onChange={(value) => updateSectionField('nangLuc', 'bannerSubtitle', value)}
                      rows={3}
                    />
                    <InputField
                      label="Tiêu đề khối thiết bị"
                      value={content.nangLuc.equipmentTitle}
                      onChange={(value) => updateSectionField('nangLuc', 'equipmentTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả khối thiết bị"
                      value={content.nangLuc.equipmentSubtitle}
                      onChange={(value) => updateSectionField('nangLuc', 'equipmentSubtitle', value)}
                      rows={3}
                    />
                  </div>
                  <ImageField
                    label="Ảnh banner"
                    value={content.nangLuc.bannerImage}
                    onChange={(value) => updateSectionField('nangLuc', 'bannerImage', value)}
                  />
                </div>
              </SectionCard>

              <StatListEditor
                title="Chỉ số tổng quan"
                description="Các số liệu hiển thị ngay đầu trang Năng lực."
                items={content.nangLuc.overviewStats}
                onChange={(items) => updateSectionField('nangLuc', 'overviewStats', items)}
              />

              <SectionCard
                title="Chứng nhận và tiêu chuẩn"
                description="Quản lý tiêu đề, mô tả và danh sách chứng nhận."
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <InputField
                    label="Tiêu đề khối chứng nhận"
                    value={content.nangLuc.certificationsTitle}
                    onChange={(value) => updateSectionField('nangLuc', 'certificationsTitle', value)}
                  />
                  <TextareaField
                    label="Mô tả khối chứng nhận"
                    value={content.nangLuc.certificationsSubtitle}
                    onChange={(value) =>
                      updateSectionField('nangLuc', 'certificationsSubtitle', value)
                    }
                    rows={3}
                  />
                </div>
              </SectionCard>

              <StringListEditor
                title="Danh sách chứng nhận"
                values={content.nangLuc.certifications}
                onChange={(values) => updateSectionField('nangLuc', 'certifications', values)}
                addLabel="Thêm chứng nhận"
                placeholder="Nhập chứng nhận hoặc tiêu chuẩn..."
              />

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-heading text-xl font-bold text-gray-900">Thiết bị</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Thêm, sửa, xóa thiết bị và hình ảnh thiết bị của HTX.
                  </p>
                </div>
                <EquipmentsAdminPage />
              </div>
            </>
          ) : null}

          {activeTab === 'tin-tuc' ? (
            <>
              <SectionCard
                title="Banner trang Tin tức"
                description="Tiêu đề, mô tả và ảnh đầu trang tin tức."
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <InputField
                      label="Tiêu đề banner"
                      value={content.tinTuc.bannerTitle}
                      onChange={(value) => updateSectionField('tinTuc', 'bannerTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả banner"
                      value={content.tinTuc.bannerSubtitle}
                      onChange={(value) => updateSectionField('tinTuc', 'bannerSubtitle', value)}
                      rows={3}
                    />
                    <InputField
                      label="Tiêu đề danh sách bài viết"
                      value={content.tinTuc.listTitle}
                      onChange={(value) => updateSectionField('tinTuc', 'listTitle', value)}
                    />
                  </div>
                  <ImageField
                    label="Ảnh banner"
                    value={content.tinTuc.bannerImage}
                    onChange={(value) => updateSectionField('tinTuc', 'bannerImage', value)}
                  />
                </div>
              </SectionCard>

              <StringListEditor
                title="Nhóm danh mục tin"
                description="Các nút lọc ở đầu trang Tin tức."
                values={content.tinTuc.categories}
                onChange={(values) => updateSectionField('tinTuc', 'categories', values)}
                addLabel="Thêm danh mục"
                placeholder="Nhập tên danh mục..."
              />

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-heading text-xl font-bold text-gray-900">Danh sách bài viết</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Quản lý bài viết và ảnh minh họa của từng tin tức.
                  </p>
                </div>
                <NewsTable initialData={initialNews} />
              </div>
            </>
          ) : null}

          {activeTab === 'tuyen-dung' ? (
            <>
              <SectionCard
                title="Banner trang Tuyển dụng"
                description="Tiêu đề, mô tả và ảnh đầu trang tuyển dụng."
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <InputField
                      label="Tiêu đề banner"
                      value={content.tuyenDung.bannerTitle}
                      onChange={(value) => updateSectionField('tuyenDung', 'bannerTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả banner"
                      value={content.tuyenDung.bannerSubtitle}
                      onChange={(value) => updateSectionField('tuyenDung', 'bannerSubtitle', value)}
                      rows={3}
                    />
                    <InputField
                      label="Tiêu đề khối vị trí"
                      value={content.tuyenDung.sectionTitle}
                      onChange={(value) => updateSectionField('tuyenDung', 'sectionTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả khối vị trí"
                      value={content.tuyenDung.sectionSubtitle}
                      onChange={(value) => updateSectionField('tuyenDung', 'sectionSubtitle', value)}
                      rows={3}
                    />
                  </div>
                  <ImageField
                    label="Ảnh banner"
                    value={content.tuyenDung.bannerImage}
                    onChange={(value) => updateSectionField('tuyenDung', 'bannerImage', value)}
                  />
                </div>
              </SectionCard>

              <CardListEditor
                title="Lý do gia nhập"
                description="Các lợi ích hiển thị phía trên danh sách tuyển dụng."
                items={content.tuyenDung.benefits}
                onChange={(items) => updateSectionField('tuyenDung', 'benefits', items)}
                addLabel="Thêm lợi ích"
              />

              <StringListEditor
                title="Bộ lọc phòng ban"
                description="Các nút lọc ở phần Tuyển dụng."
                values={content.tuyenDung.filters}
                onChange={(values) => updateSectionField('tuyenDung', 'filters', values)}
                addLabel="Thêm bộ lọc"
                placeholder="Nhập tên phòng ban hoặc nhóm công việc..."
              />

              <SectionCard title="Khối kêu gọi gửi CV" description="Nội dung cuối trang tuyển dụng.">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Tiêu đề CTA"
                    value={content.tuyenDung.ctaTitle}
                    onChange={(value) => updateSectionField('tuyenDung', 'ctaTitle', value)}
                  />
                  <InputField
                    label="Email nhận CV"
                    value={content.tuyenDung.ctaEmail}
                    onChange={(value) => updateSectionField('tuyenDung', 'ctaEmail', value)}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextareaField
                    label="Mô tả CTA"
                    value={content.tuyenDung.ctaDescription}
                    onChange={(value) => updateSectionField('tuyenDung', 'ctaDescription', value)}
                    rows={4}
                  />
                  <InputField
                    label="Nhãn nút CTA"
                    value={content.tuyenDung.ctaButtonLabel}
                    onChange={(value) => updateSectionField('tuyenDung', 'ctaButtonLabel', value)}
                  />
                </div>
              </SectionCard>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-heading text-xl font-bold text-gray-900">Danh sách tuyển dụng</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Quản lý các vị trí tuyển dụng đang hiển thị trên website.
                  </p>
                </div>
                <JobTable initialData={initialJobs} />
              </div>
            </>
          ) : null}

          {activeTab === 'lien-he' ? (
            <>
              <SectionCard
                title="Banner trang Liên hệ"
                description="Tiêu đề, mô tả và ảnh đầu trang."
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <InputField
                      label="Tiêu đề banner"
                      value={content.lienHe.bannerTitle}
                      onChange={(value) => updateSectionField('lienHe', 'bannerTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả banner"
                      value={content.lienHe.bannerSubtitle}
                      onChange={(value) => updateSectionField('lienHe', 'bannerSubtitle', value)}
                      rows={3}
                    />
                    <InputField
                      label="Tiêu đề form tư vấn"
                      value={content.lienHe.consultationTitle}
                      onChange={(value) => updateSectionField('lienHe', 'consultationTitle', value)}
                    />
                    <TextareaField
                      label="Mô tả form tư vấn"
                      value={content.lienHe.consultationSubtitle}
                      onChange={(value) =>
                        updateSectionField('lienHe', 'consultationSubtitle', value)
                      }
                      rows={3}
                    />
                  </div>
                  <ImageField
                    label="Ảnh banner"
                    value={content.lienHe.bannerImage}
                    onChange={(value) => updateSectionField('lienHe', 'bannerImage', value)}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Thanh liên hệ nhanh"
                description="Thông tin hotline, email và liên kết mạng xã hội."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Hotline hiển thị"
                    value={content.lienHe.quickHotlineLabel}
                    onChange={(value) => updateSectionField('lienHe', 'quickHotlineLabel', value)}
                  />
                  <InputField
                    label="Email hiển thị"
                    value={content.lienHe.quickEmailLabel}
                    onChange={(value) => updateSectionField('lienHe', 'quickEmailLabel', value)}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Link Zalo"
                    value={content.lienHe.zaloUrl}
                    onChange={(value) => updateSectionField('lienHe', 'zaloUrl', value)}
                    placeholder="https://zalo.me/..."
                  />
                  <InputField
                    label="Link Facebook"
                    value={content.lienHe.facebookUrl}
                    onChange={(value) => updateSectionField('lienHe', 'facebookUrl', value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Khối trụ sở chính"
                description="Thông tin chính hiển thị cạnh form liên hệ."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Tiêu đề khối"
                    value={content.lienHe.headquartersTitle}
                    onChange={(value) => updateSectionField('lienHe', 'headquartersTitle', value)}
                  />
                  <InputField
                    label="Điện thoại"
                    value={content.lienHe.headquartersPhone}
                    onChange={(value) => updateSectionField('lienHe', 'headquartersPhone', value)}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextareaField
                    label="Địa chỉ"
                    value={content.lienHe.headquartersAddress}
                    onChange={(value) =>
                      updateSectionField('lienHe', 'headquartersAddress', value)
                    }
                    rows={3}
                  />
                  <TextareaField
                    label="Giờ làm việc"
                    value={content.lienHe.headquartersHours}
                    onChange={(value) => updateSectionField('lienHe', 'headquartersHours', value)}
                    rows={3}
                  />
                </div>
                <div className="mt-4">
                  <InputField
                    label="Email"
                    value={content.lienHe.headquartersEmail}
                    onChange={(value) => updateSectionField('lienHe', 'headquartersEmail', value)}
                  />
                </div>
              </SectionCard>

              <BranchListEditor
                title="Danh sách chi nhánh"
                description="Các thẻ chi nhánh bên phải và cuối trang liên hệ."
                items={content.lienHe.branches}
                onChange={(items) => updateSectionField('lienHe', 'branches', items)}
              />

              <SpecialContactListEditor
                title="Liên hệ chuyên biệt"
                description="Các khối như đặt phòng, resort hoặc đầu mối riêng."
                items={content.lienHe.specialContacts}
                onChange={(items) => updateSectionField('lienHe', 'specialContacts', items)}
              />

              <SectionCard title="Bản đồ" description="Tiêu đề và mã nhúng Google Maps hiển thị trên trang.">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label="Tiêu đề bản đồ"
                    value={content.lienHe.mapTitle}
                    onChange={(value) => updateSectionField('lienHe', 'mapTitle', value)}
                  />
                  <TextareaField
                    label="Mô tả bản đồ"
                    value={content.lienHe.mapSubtitle}
                    onChange={(value) => updateSectionField('lienHe', 'mapSubtitle', value)}
                    rows={3}
                  />
                </div>
                <div className="mt-4">
                  <TextareaField
                    label="Google Maps embed"
                    value={content.lienHe.mapEmbed}
                    onChange={(value) => updateSectionField('lienHe', 'mapEmbed', value)}
                    rows={6}
                  />
                </div>
              </SectionCard>
            </>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveContent}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Đang lưu...' : 'Lưu nội dung đầu mục'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
