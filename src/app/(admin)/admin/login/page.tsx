'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'

// Note: metadata must be in a server component. Since this is a client component,
// the title is set via next/head equivalent in the layout above.
// export const metadata: Metadata = { title: 'Đăng nhập Admin — HTX Tân Phú' }

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error || 'Đăng nhập thất bại')
      }
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #2C3576 0%, #0F2440 100%)' }}
    >
      <div
        className="w-full bg-white rounded-2xl shadow-2xl p-8"
        style={{ maxWidth: '400px' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-lg mb-4"
            style={{ backgroundColor: '#E3783A' }}
          >
            HTX
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">QUẢN TRỊ WEBSITE</h1>
          <p className="text-gray-400 text-sm mt-1">HTX Vận tải Ô tô Tân Phú</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: loading ? '#C2612B' : '#E3783A' }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#C2612B' }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#E3783A' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-6">
          HTX Vận tải Ô tô Tân Phú © 2025
        </p>
      </div>
    </div>
  )
}
