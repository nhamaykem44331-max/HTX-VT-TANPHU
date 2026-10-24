'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import AuthShell, { AuthSubmitButton, authInputClass } from '@/components/admin/AuthShell'

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ message: string; maskedEmail: string | null } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'Không thể gửi email khôi phục. Vui lòng thử lại.')
        return
      }

      setDone({ message: data.message, maskedEmail: data.maskedEmail || null })
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="QUÊN MẬT KHẨU" subtitle="Nhận liên kết đặt lại mật khẩu qua email">
      {done ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
            <MailCheck size={28} />
          </div>
          <p className="text-sm text-gray-700">{done.message}</p>
          {done.maskedEmail ? (
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900">
              Đã gửi tới: {done.maskedEmail}
            </p>
          ) : null}
          <p className="text-xs text-gray-500">
            Liên kết có hiệu lực trong 30 phút. Không nhận được? Kiểm tra mục Spam hoặc thử lại sau ít phút.
          </p>
          <Link
            href="/admin/login"
            className="inline-block text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Nhập tên đăng nhập hoặc email khôi phục của tài khoản. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu
            tới hộp thư của bạn.
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên đăng nhập hoặc email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin hoặc ban@gmail.com"
              required
              autoComplete="username"
              className={authInputClass}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2 px-3">{error}</p>
          )}

          <AuthSubmitButton loading={loading} loadingText="Đang gửi email...">
            Gửi liên kết đặt lại
          </AuthSubmitButton>

          <p className="text-center">
            <Link
              href="/admin/login"
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 hover:underline"
            >
              ← Quay lại đăng nhập
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}
