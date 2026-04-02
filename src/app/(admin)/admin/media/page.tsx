'use client'

import { useState, useEffect } from 'react'
import { Copy, Trash2, X, Plus, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/admin/ImageUploader'

const FOLDERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'hero', label: 'Hero Banner' },
  { id: 'news', label: 'Tin tức' },
  { id: 'fields', label: 'Lĩnh vực' },
  { id: 'equipment', label: 'Thiết bị' },
  { id: 'awards', label: 'Giải thưởng' },
  { id: 'logos', label: 'Logo / Đối tác' },
  { id: 'general', label: 'Ảnh chung' },
]

export default function MediaLibraryPage() {
  const [activeFolder, setActiveFolder] = useState('all')
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFolder, setUploadFolder] = useState('general')

  useEffect(() => {
    fetchImages()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFolder])

  const fetchImages = async () => {
    setLoading(true)
    const foldersToFetch = activeFolder === 'all' 
      ? FOLDERS.filter(f => f.id !== 'all').map(f => f.id) 
      : [activeFolder]

    let allFiles: any[] = []

    try {
      // Pass bucket
      for (const folder of foldersToFetch) {
        const { data, error } = await supabase.storage.from('website-images').list(folder, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        })
        
        if (data) {
          const files = data
            .filter(f => f.name !== '.emptyFolderPlaceholder' && f.metadata?.size != null && f.metadata.size > 0)
            .map(f => {
              const path = `${folder}/${f.name}`
              const publicUrl = supabase.storage.from('website-images').getPublicUrl(path).data.publicUrl
              return {
                ...f,
                folder,
                path,
                publicUrl
              }
            })
          allFiles = [...allFiles, ...files]
        }
      }

      // Sort globally if 'all'
      allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setImages(allFiles)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (path: string) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này khỏi hệ thống? (Các trang đang dùng ảnh này sẽ bị lỗi)')) return
    
    // Attempt delete
    try {
      await fetch('/api/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      })
      fetchImages()
    } catch (e) {
      alert('Xóa ảnh thất bại')
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Đã copy URL ảnh!')
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ImageIcon className="text-orange-500" />
          Thư viện ảnh
        </h1>
        <button
          onClick={() => {
            setUploadFolder(activeFolder === 'all' ? 'general' : activeFolder)
            setShowUploadModal(true)
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Tải lên ảnh mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {FOLDERS.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setActiveFolder(folder.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeFolder === folder.id
                ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 border border-transparent'
            }`}
          >
            {folder.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 font-medium">Đang tải thư viện ảnh...</div>
      ) : images.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
           <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
           <p className="text-gray-500 font-medium">Thư mục này hiện không có ảnh nào.</p>
           <p className="text-gray-400 text-sm mt-1">Bấm "Tải lên ảnh mới" để thêm ảnh vào đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden group shadow-sm">
              <div className="relative aspect-video bg-gray-100 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.publicUrl} alt={img.name} className="w-full h-full object-cover" />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    onClick={() => copyUrl(img.publicUrl)}
                    className="p-2.5 rounded-full bg-white text-gray-800 hover:text-orange-600 hover:bg-orange-50 transition-colors shadow-sm"
                    title="Copy Link URL"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(img.path)}
                    className="p-2.5 rounded-full bg-white text-gray-800 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                    title="Xóa ảnh khỏi hệ thống"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-3 bg-white">
                <p className="text-sm font-semibold text-gray-800 truncate" title={img.name}>{img.name}</p>
                <div className="flex justify-between items-center mt-1.5 text-xs text-gray-500">
                  <span>{formatSize(img.metadata?.size || 0)}</span>
                  <span>{formatDate(img.created_at)}</span>
                </div>
                {activeFolder === 'all' && (
                   <div className="mt-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 w-fit px-2 py-0.5 rounded">
                     {FOLDERS.find(f => f.id === img.folder)?.label || img.folder}
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Tải lên ảnh mới</h3>
              <button onClick={() => { setShowUploadModal(false); fetchImages(); }} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5">
               <div className="mb-4">
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lưu vào thư mục:</label>
                 <select 
                   value={uploadFolder} 
                   onChange={(e) => setUploadFolder(e.target.value)}
                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                 >
                   {FOLDERS.filter(f => f.id !== 'all').map(f => (
                     <option key={f.id} value={f.id}>{f.label} ({f.id})</option>
                   ))}
                 </select>
               </div>

               <div className="border border-gray-200 rounded-xl p-2 bg-gray-50">
                  <ImageUploader 
                    value="" 
                    onChange={(url) => { if(url) { setShowUploadModal(false); fetchImages(); } }} 
                    folder={uploadFolder} 
                    aspectRatio="video"
                    label="" 
                  />
               </div>

               <button 
                 onClick={() => { setShowUploadModal(false); fetchImages(); }} 
                 className="w-full mt-4 bg-gray-900 text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-gray-800 transition-colors"
               >
                 Đóng
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
