'use client'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, ShieldAlert } from 'lucide-react'
import AuthShell, { AuthSubmitButton, authInputClass } from '@/components/admin/AuthShell'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [checking, setChecking] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let cancelled = false

    async function verify() {
      if (!token) {
        setChecking(false)
        setTokenValid(false)
        setError('Liên kết thiếu mã đặt lại mật khẩu.')
        return
      }

      try {
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
          cache: 'no-store',
        })
        const data = await res.json().catch(() => ({}))
        if (cancelled) return

        if (res.ok && data.valid) {
          setTokenValid(true)
          setUsername(data.username || '')
        } else {
          setTokenValid(false)
          setError(data.error || 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
        }
      } catch {
        if (!cancelled) {
          setTokenValid(false)
          setError('Không kiểm tra được liên kết. Vui lòng thử lại.')
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('Mật khẩu nhập lại chưa khớp.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, passwordConfirm }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || 'Không thể đặt lại mật khẩu.')
        return
      }

      setSuccess(data.message || 'Đã đặt lại mật khẩu thành công.')
      setTimeout(() => router.push('/admin/login'), 2500)
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return <p className="text-center text-sm text-gray-500 py-6">Đang kiểm tra liên kết...</p>
  }

  if (success) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 size={28} />
        </div>
        <p className="text-sm text-gray-700">{success}</p>
        <Link
          href="/admin/login"
          className="inline-block text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline"
        >
          Đăng nhập ngay →
        </Link>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <ShieldAlert size={28} />
        </div>
        <p className="text-sm text-gray-700">{error}</p>
        <Link
          href="/admin/quen-mat-khau"
          className="inline-block text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline"
        >
          Yêu cầu liên kết mới →
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {username ? (
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 text-center">
          Đặt mật khẩu mới cho tài khoản <span className="font-bold text-gray-900">@{username}</span>
        </p>
      ) : null}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu mới</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
          required
          autoComplete="new-password"
          className={authInputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nhập lại mật khẩu mới</label>
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className={authInputClass}
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2 px-3">{error}</p>}

      <AuthSubmitButton loading={loading} loadingText="Đang cập nhật...">
        Đặt lại mật khẩu
      </AuthSubmitButton>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthShell title="ĐẶT LẠI MẬT KHẨU" subtitle="Tạo mật khẩu mới cho tài khoản quản trị">
      <Suspense fallback={<p className="text-center text-sm text-gray-500 py-6">Đang tải...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
