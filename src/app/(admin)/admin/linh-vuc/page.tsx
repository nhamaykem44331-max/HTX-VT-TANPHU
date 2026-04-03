'use client'

import { useEffect, useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { supabase } from '@/lib/supabase'
import type { BusinessField } from '@/lib/types'

type FieldRecord = BusinessField & {
  short_desc?: string
  article_content?: string
  article_images?: string[]
}

function normalizeImageList(images: unknown) {
  if (!Array.isArray(images)) return []
  return images.map((image) => String(image).trim()).filter(Boolean)
}

function ensureEditableImageSlots(images: string[]) {
  return images.length > 0 ? images : ['']
}

interface ArticleImagesEditorProps {
  images: string[]
  onChange: (images: string[]) => void
}

function ArticleImagesEditor({ images, onChange }: ArticleImagesEditorProps) {
  const updateImage = (index: number, nextValue: string) => {
    onChange(images.map((image, imageIndex) => (imageIndex === index ? nextValue : image)))
  }

  const removeImage = (index: number) => {
    const nextImages = images.filter((_, imageIndex) => imageIndex !== index)
    onChange(ensureEditableImageSlots(nextImages))
  }

  const addImage = () => {
    onChange([...images, ''])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Hinh anh bai viet</h4>
          <p className="text-xs text-gray-500">Tai len nhieu anh de hien thi gallery o trang chi tiet.</p>
        </div>
        <button
          type="button"
          onClick={addImage}
          className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100"
        >
          <Plus size={16} /> Them anh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {images.map((image, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Anh {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} /> Xoa
              </button>
            </div>

            <ImageUploader
              value={image}
              onChange={(nextValue) => updateImage(index, nextValue)}
              folder="fields"
              aspectRatio="video"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FieldsAdminPage() {
  const [data, setData] = useState<FieldRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [editShortDesc, setEditShortDesc] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editImage, setEditImage] = useState('')
  const [editStatsStr, setEditStatsStr] = useState('[]')
  const [editFeaturesStr, setEditFeaturesStr] = useState('')
  const [editServicesStr, setEditServicesStr] = useState('')
  const [editArticleContent, setEditArticleContent] = useState('')
  const [editArticleImages, setEditArticleImages] = useState<string[]>([''])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: dbData, error } = await supabase
        .from('fields')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error || !dbData || dbData.length === 0) {
        throw new Error('No field data found in database')
      }

      setData(dbData as FieldRecord[])
    } catch {
      const { getFields } = await import('@/lib/data-service')
      const fallbackFields = await getFields()
      setData(fallbackFields as FieldRecord[])
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (field: FieldRecord) => {
    setEditingId(field.id)
    setEditName(field.name || '')
    setEditSlug(field.slug || field.id)
    setEditIcon(field.icon || '')
    setEditShortDesc(field.short_desc || field.shortDesc || '')
    setEditDesc(field.description || '')
    setEditImage(field.image || '')
    setEditStatsStr(field.stats ? JSON.stringify(field.stats, null, 2) : '[]')
    setEditFeaturesStr((field.features || []).join('\n'))
    setEditServicesStr((field.services || []).join('\n'))
    setEditArticleContent(field.article_content || field.articleContent || '')
    setEditArticleImages(
      ensureEditableImageSlots(
        normalizeImageList(field.article_images || field.articleImages || [])
      )
    )
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditArticleImages([''])
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return

    let stats: { label: string; value: string }[] = []
    if (editStatsStr.trim()) {
      try {
        const parsedStats = JSON.parse(editStatsStr)
        if (!Array.isArray(parsedStats)) {
          throw new Error('Stats must be an array')
        }
        stats = parsedStats
      } catch {
        window.alert('Truong "Cac chi so" phai la JSON hop le.')
        return
      }
    }

    setIsSaving(true)

    try {
      const features = editFeaturesStr.split('\n').map((item) => item.trim()).filter(Boolean)
      const services = editServicesStr.split('\n').map((item) => item.trim()).filter(Boolean)
      const articleImages = normalizeImageList(editArticleImages)

      const updateData = {
        name: editName.trim(),
        slug: editSlug.trim(),
        icon: editIcon.trim(),
        short_desc: editShortDesc.trim(),
        description: editDesc.trim(),
        image: editImage.trim(),
        stats,
        features,
        services,
        article_content: editArticleContent.trim(),
        article_images: articleImages,
      }

      const { error } = await supabase.from('fields').update(updateData).eq('id', id)
      if (error) throw error

      setEditingId(null)
      await fetchData()
    } catch (error: any) {
      window.alert(`Luu that bai: ${error?.message || 'Khong the cap nhat linh vuc.'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Quan ly Nganh nghe / Linh vuc</h1>
      <p className="text-sm text-gray-500">
        Chinh sua noi dung hien thi trang chu, trang chi tiet va bo anh bai viet cho tung linh vuc.
      </p>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Dang tai du lieu...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chua co du lieu linh vuc.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((item) => {
              const articleText = item.article_content || item.articleContent || ''
              const articleImages = normalizeImageList(item.article_images || item.articleImages || [])

              return (
                <div key={item.id} className="p-4 transition-colors hover:bg-gray-50">
                  {editingId === item.id ? (
                    <div className="space-y-5 rounded-xl border border-orange-200 bg-orange-50/50 p-5">
                      <h3 className="text-sm font-bold uppercase text-orange-800">
                        Sua: {item.name || item.slug}
                      </h3>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">Ten linh vuc *</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">Slug *</label>
                          <input
                            type="text"
                            value={editSlug}
                            onChange={(event) => setEditSlug(event.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">Icon Lucide *</label>
                          <input
                            type="text"
                            value={editIcon}
                            onChange={(event) => setEditIcon(event.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">Mo ta ngan</label>
                          <textarea
                            value={editShortDesc}
                            onChange={(event) => setEditShortDesc(event.target.value)}
                            rows={3}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">Mo ta gioi thieu</label>
                          <textarea
                            value={editDesc}
                            onChange={(event) => setEditDesc(event.target.value)}
                            rows={3}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Diem noi bat - moi dong 1 muc
                          </label>
                          <textarea
                            value={editFeaturesStr}
                            onChange={(event) => setEditFeaturesStr(event.target.value)}
                            rows={5}
                            className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none"
                            placeholder="Diem 1&#10;Diem 2"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Dich vu - moi dong 1 muc
                          </label>
                          <textarea
                            value={editServicesStr}
                            onChange={(event) => setEditServicesStr(event.target.value)}
                            rows={5}
                            className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none"
                            placeholder="Dich vu A&#10;Dich vu B"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">Cac chi so - JSON</label>
                          <textarea
                            value={editStatsStr}
                            onChange={(event) => setEditStatsStr(event.target.value)}
                            rows={5}
                            className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-gray-700">Anh dai dien</label>
                          <div className="rounded border border-gray-200 bg-white p-2">
                            <ImageUploader
                              value={editImage}
                              onChange={setEditImage}
                              folder="fields"
                              aspectRatio="video"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Noi dung bai viet
                          </label>
                          <textarea
                            value={editArticleContent}
                            onChange={(event) => setEditArticleContent(event.target.value)}
                            rows={10}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-orange-500 focus:outline-none"
                            placeholder="Nhap noi dung bai viet chi tiet. Co the xuong dong va tach doan de hien thi thanh nhieu doan van."
                          />
                          <p className="mt-2 text-xs text-gray-500">
                            Goi y: moi doan cach nhau bang 1 dong trong de giao dien tu tach thanh cac doan van.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <ArticleImagesEditor
                          images={editArticleImages}
                          onChange={setEditArticleImages}
                        />
                      </div>

                      <div className="flex justify-end gap-3 border-t border-orange-200 pt-4">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200"
                        >
                          <X size={16} /> Huy sua
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(item.id)}
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 disabled:opacity-60"
                        >
                          <Check size={16} /> {isSaving ? 'Dang luu...' : 'Luu thay doi'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-5 md:flex-row">
                      <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 md:w-48 shrink-0">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            Chua co anh
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900">{item.name || item.slug}</h3>
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-600">
                              /{item.slug}
                            </span>
                            <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                              Icon: {item.icon}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-orange-600">
                            {item.short_desc || item.shortDesc}
                          </p>
                          <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{item.description}</p>
                          {articleText ? (
                            <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                              {articleText}
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-500">
                            {item.features?.length || 0} features
                          </span>
                          <span className="rounded border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-500">
                            {item.services?.length || 0} services
                          </span>
                          <span className="rounded border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-500">
                            {item.stats?.length || 0} stats
                          </span>
                          <span className="rounded border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-500">
                            {articleText ? 'Co bai viet' : 'Chua co bai viet'}
                          </span>
                          <span className="rounded border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-500">
                            {articleImages.length} anh bai viet
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex w-full justify-end gap-2 border-t border-gray-100 pt-3 md:mt-0 md:w-auto md:border-l md:border-t-0 md:pl-4 md:pt-0">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 md:w-auto"
                        >
                          <Pencil size={14} /> Chinh sua
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
