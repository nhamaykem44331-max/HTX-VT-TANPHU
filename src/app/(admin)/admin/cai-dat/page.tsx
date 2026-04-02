'use client'

import { useState, useEffect } from 'react'
import { Save, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [settings, setSettings] = useState({
    hotline: '0208.383.2608',
    email: 'info@htxtanphu.com',
    address: '',
    facebook: '',
    zalo: '',
    slogan: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*')
      if (error && error.code !== '42P01') throw error
      
      if (data && data.length > 0) {
        const newSettings = { ...settings }
        data.forEach(item => {
          if (item.key in newSettings) {
            ;(newSettings as any)[item.key] = item.value?.text || ''
          }
        })
        setSettings(newSettings)
      }
    } catch (err: any) {
      console.warn('Could not load settings (maybe not setup yet).', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const updates = Object.entries(settings).map(([key, val]) => ({
        key,
        value: { text: val }
      }))

      for (const item of updates) {
        const { error } = await supabase.from('site_settings').upsert(item)
        if (error) throw error
      }
      
      setSuccessMsg('Đã lưu cài đặt thành công.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err: any) {
      setErrorMsg('Kết nối Supabase chưa được cấu hình. Cài đặt sẽ được lưu khi bạn hoàn thành setup Supabase.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Cài đặt Website</h1>
      
      {errorMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
          <p className="text-sm font-medium leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm font-medium text-center">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Đang tải cài đặt...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hotline</label>
                <input
                  name="hotline"
                  value={settings.hotline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ trụ sở</label>
              <input
                name="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="VD: Số 200, đường ..., Thái Nguyên"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Facebook</label>
                <input
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Zalo</label>
                <input
                  name="zalo"
                  value={settings.zalo}
                  onChange={handleChange}
                  placeholder="https://zalo.me/..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>

            <div className="mb-8 pl-0">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slogan</label>
              <input
                name="slogan"
                value={settings.slogan}
                onChange={handleChange}
                placeholder="Khẳng định thương hiệu - Vững bước tương lai"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="border-t border-gray-100 pt-5 pr-0 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-2.5 font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
