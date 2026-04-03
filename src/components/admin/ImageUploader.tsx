'use client'

import React, { useRef, useState } from 'react'
import { Link as LinkIcon, Loader2, Pencil, Trash2, UploadCloud, X } from 'lucide-react'
import DeleteConfirm from './DeleteConfirm'

const MAX_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024
const MAX_UPLOAD_SIZE_LABEL = '4MB'
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
const COMPRESSED_MIME_TYPE = 'image/webp'
const MAX_IMAGE_DIMENSION = 2560
const MIN_IMAGE_DIMENSION = 480
const SCALE_STEP = 0.85

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto'
  className?: string
}

interface UploadApiResponse {
  success?: boolean
  error?: string
  url?: string
}

interface OptimizedImageResult {
  file: File
  compressed: boolean
  originalSize: number
  finalSize: number
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getFileExtensionFromMimeType(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg'
  if (mimeType === 'image/png') return 'png'
  if (mimeType === 'image/webp') return 'webp'
  return 'img'
}

function buildOptimizedFileName(originalName: string, mimeType: string) {
  const baseName = originalName.replace(/\.[^/.]+$/, '') || 'image'
  const extension = getFileExtensionFromMimeType(mimeType)
  return `${baseName}-optimized.${extension}`
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Khong the doc du lieu anh de toi uu.'))
    }

    image.src = objectUrl
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error('Khong the tao file anh toi uu.'))
      },
      mimeType,
      quality
    )
  })
}

async function compressImageToLimit(file: File): Promise<OptimizedImageResult> {
  if (file.size <= MAX_UPLOAD_SIZE_BYTES) {
    return {
      file,
      compressed: false,
      originalSize: file.size,
      finalSize: file.size,
    }
  }

  if (file.type === 'image/svg+xml') {
    throw new Error('SVG qua lon khong the tu dong nen. Vui long xuat lai SVG nho hon hoac doi sang PNG/JPG/WebP.')
  }

  const image = await loadImage(file)
  const aspectRatio = image.naturalWidth / image.naturalHeight

  let width = image.naturalWidth
  let height = image.naturalHeight

  if (Math.max(width, height) > MAX_IMAGE_DIMENSION) {
    if (width >= height) {
      width = MAX_IMAGE_DIMENSION
      height = Math.round(width / aspectRatio)
    } else {
      height = MAX_IMAGE_DIMENSION
      width = Math.round(height * aspectRatio)
    }
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Trinh duyet khong ho tro toi uu anh bang canvas.')
  }

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const quality = Math.max(0.35, 0.9 - attempt * 0.07)
    canvas.width = width
    canvas.height = height
    context.clearRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, COMPRESSED_MIME_TYPE, quality)
    if (blob.size <= MAX_UPLOAD_SIZE_BYTES) {
      const optimizedFile = new File([blob], buildOptimizedFileName(file.name, blob.type), {
        type: blob.type,
        lastModified: Date.now(),
      })

      return {
        file: optimizedFile,
        compressed: true,
        originalSize: file.size,
        finalSize: blob.size,
      }
    }

    const canReduceWidth = width > MIN_IMAGE_DIMENSION
    const canReduceHeight = height > MIN_IMAGE_DIMENSION
    if (!canReduceWidth && !canReduceHeight) {
      continue
    }

    width = Math.max(MIN_IMAGE_DIMENSION, Math.round(width * SCALE_STEP))
    height = Math.max(MIN_IMAGE_DIMENSION, Math.round(height * SCALE_STEP))
  }

  throw new Error(`Khong the tu dong giam anh xuong duoi ${MAX_UPLOAD_SIZE_LABEL}. Vui long nen anh truoc khi tai len.`)
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'general',
  label,
  aspectRatio = 'video',
  className = '',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [noticeMsg, setNoticeMsg] = useState('')
  const [uploadStage, setUploadStage] = useState<'compressing' | 'uploading' | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tempUrl, setTempUrl] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[2.35/1]',
    auto: 'h-auto min-h-[160px]',
  }

  const extractStoragePath = (url: string) => {
    try {
      const urlObj = new URL(url)
      const parts = urlObj.pathname.split('/website-images/')
      return parts.length > 1 ? parts[1] : ''
    } catch {
      return ''
    }
  }

  const parseApiResponse = async (res: Response): Promise<UploadApiResponse> => {
    const contentType = res.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      return res.json()
    }

    const text = await res.text()
    return { success: false, error: text }
  }

  const getFriendlyUploadError = (res: Response, data: UploadApiResponse) => {
    const rawError = data.error || ''

    if (
      res.status === 413 ||
      rawError.includes('Payload Too Large') ||
      rawError.includes('Request Entity Too Large') ||
      rawError.includes('FUNCTION_PAYLOAD_TOO_LARGE')
    ) {
      return `Anh qua lon de upload qua Vercel. He thong da co gang toi uu nhung van chua duoi ${MAX_UPLOAD_SIZE_LABEL}.`
    }

    return rawError || 'Upload that bai'
  }

  const handleUpload = async (selectedFile: File) => {
    if (!selectedFile) return

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setErrorMsg('Chi chap nhan file anh JPEG, PNG, WebP hoac SVG')
      return
    }

    setIsUploading(true)
    setErrorMsg('')
    setNoticeMsg('')
    setUploadStage(selectedFile.size > MAX_UPLOAD_SIZE_BYTES ? 'compressing' : 'uploading')
    setProgress(8)

    const interval = setInterval(() => {
      setProgress((current) => (current < 90 ? current + 8 : current))
    }, 220)

    try {
      const optimized = await compressImageToLimit(selectedFile)

      if (optimized.compressed) {
        setNoticeMsg(
          `Anh da duoc tu dong toi uu tu ${formatBytes(optimized.originalSize)} xuong ${formatBytes(optimized.finalSize)}.`
        )
      }

      setUploadStage('uploading')

      const formData = new FormData()
      formData.append('file', optimized.file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await parseApiResponse(res)

      if (!res.ok || !data.success || !data.url) {
        throw new Error(getFriendlyUploadError(res, data))
      }

      setProgress(100)
      onChange(data.url)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Upload that bai')
      setNoticeMsg('')
    } finally {
      clearInterval(interval)
      setTimeout(() => {
        setIsUploading(false)
        setProgress(0)
        setUploadStage(null)
      }, 500)
    }
  }

  const handleDelete = async () => {
    const pathToDelete = extractStoragePath(value)

    setShowDeleteConfirm(false)
    setErrorMsg('')
    setNoticeMsg('')
    onChange('')

    if (!pathToDelete) return

    setIsUploading(true)
    try {
      const res = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathToDelete }),
      })

      const data = await parseApiResponse(res)
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Xoa anh that bai')
      }
    } catch (err: any) {
      console.error('Delete API error', err)
      setErrorMsg(err?.message || 'Khong the xoa file cu tren storage')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tempUrl.trim()) return

    setErrorMsg('')
    setNoticeMsg('')
    onChange(tempUrl.trim())
    setShowUrlInput(false)
    setTempUrl('')
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const onDragLeave = () => {
    setIsDragOver(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (e.dataTransfer.files?.length) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const uploadStageLabel =
    uploadStage === 'compressing' ? 'Dang toi uu anh truoc khi tai len...' : 'Dang tai anh...'

  return (
    <div className={`space-y-2 ${className}`}>
      {label ? <label className="block text-sm font-semibold text-gray-700">{label}</label> : null}

      {value ? (
        <div className={`relative overflow-hidden rounded-xl bg-gray-100 group ${aspectClasses[aspectRatio]}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-full w-full object-cover" />

          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-white p-2.5 text-gray-800 shadow-sm transition-colors hover:bg-orange-50 hover:text-orange-600"
              title="Doi anh"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-full bg-white p-2.5 text-gray-800 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
              title="Xoa anh"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ) : showUrlInput ? (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
            autoFocus
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </form>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={[
            'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all',
            aspectClasses[aspectRatio],
            isDragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100',
            isUploading ? 'pointer-events-none opacity-80' : '',
          ].join(' ')}
        >
          {isUploading ? (
            <div className="flex w-full max-w-[220px] flex-col items-center gap-3">
              <Loader2 className="animate-spin text-orange-500" size={28} />
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-orange-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs font-medium text-gray-500">{uploadStageLabel} {progress}%</p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <UploadCloud className="text-gray-400" size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Keo tha anh vao day hoac click de chon</p>
              <p className="mt-1 text-xs text-gray-400">
                JPEG, PNG, WebP - Tu dong toi uu neu vuot {MAX_UPLOAD_SIZE_LABEL}
              </p>
            </>
          )}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between px-1">
        <div className="space-y-1">
          {errorMsg ? <p className="text-xs font-medium text-red-500">{errorMsg}</p> : null}
          {noticeMsg ? <p className="text-xs font-medium text-emerald-600">{noticeMsg}</p> : null}
        </div>

        {!value && !showUrlInput && !isUploading ? (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-orange-500"
          >
            <LinkIcon size={12} /> Hoac nhap URL
          </button>
        ) : (
          <div />
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUpload(e.target.files[0])
          }
          e.currentTarget.value = ''
        }}
        accept="image/jpeg, image/png, image/webp, image/svg+xml"
        className="hidden"
      />

      <DeleteConfirm
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Xoa anh hien tai?"
        message="Anh se bi go khoi form ngay lap tuc. Neu file nay dang nam trong Supabase Storage, he thong se thu xoa no o nen."
        loading={isUploading}
      />
    </div>
  )
}
