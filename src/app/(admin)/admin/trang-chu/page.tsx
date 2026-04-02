'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X, GripVertical, CheckCircle2, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ImageUploader from '@/components/admin/ImageUploader'

// --- Tabs ---
type TabType = 'hero' | 'figures' | 'sections'

export default function HomepageManager() {
  const [activeTab, setActiveTab] = useState<TabType>('hero')

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Quản lý Trang chủ</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'hero' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Hero Banner
        </button>
        <button
          onClick={() => setActiveTab('figures')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'figures' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Con số
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'sections' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Sections
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'hero' && <HeroTab />}
        {activeTab === 'figures' && <FiguresTab />}
        {activeTab === 'sections' && <SectionsTab />}
      </div>
    </div>
  )
}

// ==============================================================================
// 1. HERO TAB
// ==============================================================================
function HeroTab() {
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // From state
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '', subtitle: '', description: '', image: '', cta_text: 'Khám phá dịch vụ', cta_link: '/linh-vuc', enabled: true
  })

  useEffect(() => { fetchSlides() }, [])

  const fetchSlides = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('hero_slides').select('*').order('sort_order')
    if (data) setSlides(data)
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await supabase.from('hero_slides').update(formData).eq('id', editingId)
    } else {
      const maxOrder = slides.length > 0 ? Math.max(...slides.map(s => s.sort_order)) : 0
      await supabase.from('hero_slides').insert({ ...formData, sort_order: maxOrder + 1 })
    }
    setShowForm(false)
    setEditingId(null)
    setFormData({ title: '', subtitle: '', description: '', image: '', cta_text: 'Khám phá dịch vụ', cta_link: '/linh-vuc', enabled: true })
    fetchSlides()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Xoá slide này?')) {
      await supabase.from('hero_slides').delete().eq('id', id)
      fetchSlides()
    }
  }

  const moveSlide = async (id: string, currentOrder: number, direction: 'up' | 'down') => {
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1
    const swapTarget = slides.find(s => s.sort_order === targetOrder)
    if (!swapTarget) return
    
    // Swap
    await supabase.from('hero_slides').update({ sort_order: currentOrder }).eq('id', swapTarget.id)
    await supabase.from('hero_slides').update({ sort_order: targetOrder }).eq('id', id)
    fetchSlides()
  }

  const toggleEnable = async (id: string, current: boolean) => {
    await supabase.from('hero_slides').update({ enabled: !current }).eq('id', id)
    fetchSlides()
  }

  return (
    <div className="space-y-4">
      {/* List */}
      <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? <div className="p-8 text-center text-gray-500">Đang tải...</div> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-gray-600">Thứ tự</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ảnh</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Tiêu đề</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Hiển thị</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slides.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 w-[100px]">
                    <div className="flex bg-gray-100 rounded w-fit divide-x divide-gray-300">
                       <button onClick={() => moveSlide(s.id, s.sort_order, 'up')} className="px-2 py-1 hover:bg-gray-200">▲</button>
                       <button onClick={() => moveSlide(s.id, s.sort_order, 'down')} className="px-2 py-1 hover:bg-gray-200">▼</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 w-[100px]">
                    <div className="w-[80px] h-[45px] bg-gray-200 flex items-center justify-center shrink-0 rounded overflow-hidden">
                      {s.image ? <img src={s.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-400">No img</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900 line-clamp-1">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.subtitle}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleEnable(s.id, s.enabled)} className={`px-2 py-1 rounded text-xs font-semibold ${s.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.enabled ? 'Bật' : 'Tắt'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setFormData(s); setEditingId(s.id); setShowForm(true) }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mx-1">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded mx-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!showForm && (
        <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ title: '', subtitle: '', description: '', image: '', cta_text: 'Khám phá dịch vụ', cta_link: '/linh-vuc', enabled: true }) }} className="btn-primary flex items-center gap-2">
          <Plus size={16}/> Thêm slide mới
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">{editingId ? 'Sửa Slide' : 'Thêm Slide mới'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tiêu đề (Cho phép xuống dòng \n)</label>
                <textarea required rows={2} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tiêu đề phụ (Subtitle)</label>
                <input required value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả nhỏ</label>
                <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nút CTA (Text)</label>
                  <input value={formData.cta_text} onChange={e => setFormData({...formData, cta_text: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nút CTA (Link)</label>
                  <input value={formData.cta_link} onChange={e => setFormData({...formData, cta_link: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={formData.enabled} onChange={e => setFormData({...formData, enabled: e.target.checked})} className="rounded text-orange-500 w-4 h-4" /> 
                <span className="text-sm font-semibold">Tự động Hiển thị trên website</span>
              </label>
            </div>
            <div>
              <ImageUploader value={formData.image} onChange={(url) => setFormData({...formData, image: url})} folder="hero" aspectRatio="wide" label="Hình background" />
            </div>
          </div>
          <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
             <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded px-5 py-2 font-semibold text-sm">Lưu slide</button>
             <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded px-5 py-2 font-semibold text-sm">Hủy</button>
          </div>
        </form>
      )}
    </div>
  )
}

// ==============================================================================
// 2. FIGURES TAB
// ==============================================================================
function FiguresTab() {
  const [figures, setFigures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const icons = ['calendar', 'users', 'truck', 'crane', 'warehouse', 'chart']

  const [formData, setFormData] = useState({ label: '', value: 0, prefix: '', suffix: '', icon: 'chart', enabled: true })
  
  useEffect(() => { fetchFigures() }, [])

  const fetchFigures = async () => {
    setLoading(true)
    const { data } = await supabase.from('key_figures').select('*').order('sort_order')
    if (data) setFigures(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (figures.length >= 8) return alert('Tối đa 8 con số')
    const maxOrder = figures.length > 0 ? Math.max(...figures.map(f => f.sort_order)) : 0
    await supabase.from('key_figures').insert({ ...formData, sort_order: maxOrder + 1 })
    setFormData({ label: '', value: 0, prefix: '', suffix: '', icon: 'chart', enabled: true })
    fetchFigures()
  }

  const updateFigure = async (id: string, updates: any) => {
    await supabase.from('key_figures').update(updates).eq('id', id)
    fetchFigures()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Xóa thông số này?')) {
      await supabase.from('key_figures').delete().eq('id', id)
      fetchFigures()
    }
  }

  const moveFig = async (id: string, currentOrder: number, direction: 'up' | 'down') => {
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1
    const swapTarget = figures.find(f => f.sort_order === targetOrder)
    if (!swapTarget) return
    await supabase.from('key_figures').update({ sort_order: currentOrder }).eq('id', swapTarget.id)
    await supabase.from('key_figures').update({ sort_order: targetOrder }).eq('id', id)
    fetchFigures()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 font-semibold text-gray-600">Thứ tự</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Icon</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Nhãn (Label)</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Tiền tố</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Giá trị số</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Hậu tố</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {figures.map(f => (
              <tr key={f.id} className="hover:bg-gray-50">
                 <td className="px-4 py-3">
                    <div className="flex bg-gray-100 rounded w-fit divide-x divide-gray-300">
                       <button onClick={() => moveFig(f.id, f.sort_order, 'up')} className="px-2 py-1 hover:bg-gray-200">▲</button>
                       <button onClick={() => moveFig(f.id, f.sort_order, 'down')} className="px-2 py-1 hover:bg-gray-200">▼</button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select value={f.icon} onChange={e => updateFigure(f.id, { icon: e.target.value })} className="border rounded p-1 text-sm bg-transparent">
                      {icons.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3"><input value={f.label} onChange={e => updateFigure(f.id, { label: e.target.value })} className="border border-transparent hover:border-gray-300 focus:border-orange-500 rounded px-2 py-1 w-full bg-transparent hover:bg-white" /></td>
                  <td className="px-4 py-3"><input value={f.prefix || ''} onChange={e => updateFigure(f.id, { prefix: e.target.value })} className="border border-transparent hover:border-gray-300 focus:border-orange-500 rounded px-2 py-1 w-16 bg-transparent hover:bg-white" /></td>
                  <td className="px-4 py-3"><input type="number" value={f.value} onChange={e => updateFigure(f.id, { value: Number(e.target.value) })} className="border border-transparent hover:border-gray-300 focus:border-orange-500 rounded px-2 py-1 w-20 bg-transparent hover:bg-white" /></td>
                  <td className="px-4 py-3"><input value={f.suffix || ''} onChange={e => updateFigure(f.id, { suffix: e.target.value })} className="border border-transparent hover:border-gray-300 focus:border-orange-500 rounded px-2 py-1 w-16 bg-transparent hover:bg-white" /></td>
                  <td className="px-4 py-3">
                     <button onClick={() => updateFigure(f.id, { enabled: !f.enabled })} className={`px-2 py-1 rounded text-xs font-semibold ${f.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {f.enabled ? 'Bật' : 'Tắt'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                     <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Thêm thông số mới</h3>
        <form onSubmit={handleAdd} className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nhãn (Label)</label>
            <input required value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="w-[100px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Icon</label>
            <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 bg-white">
              {icons.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="w-[80px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Prefix</label>
            <input value={formData.prefix} onChange={e => setFormData({...formData, prefix: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="w-[120px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Giá trị số</label>
            <input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="w-[80px]">
             <label className="block text-xs font-semibold text-gray-600 mb-1">Suffix</label>
             <input value={formData.suffix} onChange={e => setFormData({...formData, suffix: e.target.value})} className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
          </div>
          <button type="submit" disabled={figures.length >= 8} className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 font-semibold text-sm disabled:opacity-50 h-[38px]">Thêm</button>
        </form>
      </div>
    </div>
  )
}

// ==============================================================================
// 3. SECTIONS TAB
// ==============================================================================
function SectionsTab() {
  const [sections, setSections] = useState<any[]>([])
  
  useEffect(() => { fetchSections() }, [])

  const fetchSections = async () => {
    const { data } = await supabase.from('homepage_sections').select('*').order('sort_order')
    if (data) setSections(data)
  }

  const updateSection = async (id: string, updates: any) => {
    await supabase.from('homepage_sections').update(updates).eq('id', id)
    fetchSections()
  }

  const moveSec = async (id: string, currentOrder: number, direction: 'up' | 'down') => {
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1
    const swapTarget = sections.find(s => s.sort_order === targetOrder)
    if (!swapTarget) return
    await supabase.from('homepage_sections').update({ sort_order: currentOrder }).eq('id', swapTarget.id)
    await supabase.from('homepage_sections').update({ sort_order: targetOrder }).eq('id', id)
    fetchSections()
  }

  return (
     <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-4xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 font-semibold text-gray-600">Thứ tự</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-[150px]">Section ID</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Tiêu đề (Title)</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Phụ đề (Subtitle)</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sections.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 group">
                <td className="px-4 py-3">
                  <div className="flex bg-gray-100 rounded w-fit divide-x divide-gray-300">
                      <button onClick={() => moveSec(s.id, s.sort_order, 'up')} className="px-2 py-1 hover:bg-gray-200">▲</button>
                      <button onClick={() => moveSec(s.id, s.sort_order, 'down')} className="px-2 py-1 hover:bg-gray-200">▼</button>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.id}</td>
                <td className="px-4 py-3">
                   <input value={s.title} onChange={e => updateSection(s.id, { title: e.target.value })} className="border border-transparent hover:border-gray-300 focus:border-orange-500 rounded px-2 py-1 w-full bg-transparent hover:bg-white font-bold" />
                </td>
                <td className="px-4 py-3">
                   <input value={s.subtitle || ''} onChange={e => updateSection(s.id, { subtitle: e.target.value })} className="border border-transparent hover:border-gray-300 focus:border-orange-500 rounded px-2 py-1 w-full bg-transparent hover:bg-white text-gray-500 text-xs" />
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => updateSection(s.id, { enabled: !s.enabled })} className={`flex items-center gap-1 ml-auto px-3 py-1.5 rounded text-xs font-semibold transition-colors ${s.enabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                    {s.enabled ? <><CheckCircle2 size={14}/> Bật</> : <><XCircle size={14} /> Tắt</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-orange-50 text-orange-800 text-xs text-center border-t border-orange-100">
          Lưu ý: Mọi thay đổi ở bảng Sections sẽ tự động lưu và có hiệu lực ngay lập tức trên trang chủ.
        </div>
     </div>
  )
}
