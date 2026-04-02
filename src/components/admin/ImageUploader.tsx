'use client'

import React, { useState, useRef } from 'react'
import { UploadCloud, Pencil, Trash2, Link as LinkIcon, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto'
  className?: string
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'general',
  label,
  aspectRatio = 'video',
  className = ''
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [tempUrl, setTempUrl] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return

    // Pre-validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, SVG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File quá lớn (tối đa 5MB)')
      return
    }

    setIsUploading(true)
    setErrorMsg('')
    setProgress(10)

    // Fake progress for UX
    const interval = setInterval(() => {
      setProgress(p => (p < 90 ? p + 10 : p))
    }, 200)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload thất bại')
      }

      setProgress(100)
      onChange(data.url)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      clearInterval(interval)
      setTimeout(() => {
        setIsUploading(false)
        setProgress(0)
      }, 500)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xoá ảnh này? (Lưu ý: sẽ xóa file thật trên Storage)')) return

    // Extract path from URL roughly (assuming Supabase storage URL format)
    let pathToDelete = ''
    try {
      const urlObj = new URL(value)
      const parts = urlObj.pathname.split('/website-images/')
      if (parts.length > 1) {
        pathToDelete = parts[1]
      }
    } catch (e) {
      // Not a valid URL or not Supabase URL
    }

    if (pathToDelete) {
      setIsUploading(true)
      try {
         await fetch('/api/upload/delete', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ path: pathToDelete })
         })
         // ignore errors conceptually
      } catch (e) {
        console.error('Delete API error', e)
      } finally {
        setIsUploading(false)
      }
    }
    
    onChange('')
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempUrl.trim()) {
      onChange(tempUrl.trim())
      setShowUrlInput(false)
      setTempUrl('')
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[2.35/1]', // for hero banner
    auto: 'h-auto min-h-[160px]'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}

      {value ? (
        // IMAGE PREVIEW STATE
        <div className={`relative rounded-xl overflow-hidden group bg-gray-100 ${aspectClasses[aspectRatio]}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-800 p-2.5 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-sm"
              title="Đổi ảnh"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-white text-gray-800 p-2.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
              title="Xóa ảnh"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ) : showUrlInput ? (
        // URL INPUT STATE
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
          <button type="submit" className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
            OK
          </button>
          <button type="button" onClick={() => setShowUrlInput(false)} className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </form>
      ) : (
        // UPLOAD STATE
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all
            ${aspectClasses[aspectRatio]}
            ${isDragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
            ${isUploading ? 'pointer-events-none opacity-80' : ''}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
              <Loader2 className="animate-spin text-orange-500" size={28} />
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-orange-500 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs font-medium text-gray-500 mt-1">Đang tải biểu mẫu... {progress}%</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                <UploadCloud className="text-gray-400" size={24} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Kéo thả ảnh vào đây hoặc click để chọn</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — Tối đa 5MB</p>
            </>
          )}
        </div>
      )}

      {/* FOOTER ACTIONS & ERRORS */}
      {!value && !showUrlInput && !isUploading && (
        <div className="flex justify-between items-center mt-2 px-1">
          {errorMsg ? (
            <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-xs font-medium text-gray-500 hover:text-orange-500 flex items-center gap-1 transition-colors"
          >
            <LinkIcon size={12} /> Hoặc nhập URL
          </button>
        </div>
      )}

      {/* HIDDEN INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        accept="image/jpeg, image/png, image/webp, image/svg+xml"
        className="hidden"
      />
    </div>
  )
}
