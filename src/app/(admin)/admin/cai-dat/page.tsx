'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, KeyRound, Save, ShieldCheck, UserPlus } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const INITIAL_SETTINGS = {
  hotline: '0208.383.2608',
  email: 'info@htxtanphu.com',
  address: '',
  facebook: '',
  zalo: '',
  slogan: '',
}

interface AdminUserItem {
  id: string
  username: string
  displayName: string | null
  authSource: 'database' | 'env'
  isActive: boolean
  createdAt: string | null
}

interface CurrentAdminUser {
  userId: string | null
  username: string
  displayName: string | null
  authSource: 'database' | 'env'
}

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [settings, setSettings] = useState(INITIAL_SETTINGS)

  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [accountSuccessMsg, setAccountSuccessMsg] = useState('')
  const [legacyMode, setLegacyMode] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentAdminUser | null>(null)

  const [newUsername, setNewUsername] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [creatingUser, setCreatingUser] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [nextPasswordConfirm, setNextPasswordConfirm] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchUsers()
  }, [])

  const sortedUsers = useMemo(
    () =>
      [...users].sort((left, right) => {
        if (left.authSource !== right.authSource) {
          return left.authSource === 'env' ? -1 : 1
        }
        return left.username.localeCompare(right.username)
      }),
    [users]
  )

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*')
      if (error && error.code !== '42P01') throw error

      if (data && data.length > 0) {
        const nextSettings = { ...INITIAL_SETTINGS }
        data.forEach((item) => {
          if (item.key in nextSettings) {
            ;(nextSettings as Record<string, string>)[item.key] = item.value?.text || ''
          }
        })
        setSettings(nextSettings)
      }
    } catch (error: any) {
      console.warn('Could not load settings.', error?.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    setUsersError('')
    try {
      const response = await fetch('/api/auth/users', { cache: 'no-store' })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Không thể tải danh sách tài khoản admin.')
      }

      setUsers(result.users || [])
      setCurrentUser(result.currentUser || null)
      setLegacyMode(Boolean(result.legacyMode))
    } catch (error: any) {
      setUsersError(error?.message || 'Không thể tải danh sách tài khoản admin.')
    } finally {
      setUsersLoading(false)
    }
  }

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: { text: value },
      }))

      for (const item of updates) {
        const { error } = await supabase.from('site_settings').upsert(item)
        if (error) throw error
      }

      setSuccessMsg('Đã lưu cài đặt website thành công.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      setErrorMsg('Kết nối Supabase chưa được cấu hình đầy đủ. Cài đặt website sẽ được lưu khi bạn hoàn thành setup Supabase.')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateAccount = async (event: React.FormEvent) => {
    event.preventDefault()
    setUsersError('')
    setAccountSuccessMsg('')

    if (newPassword !== newPasswordConfirm) {
      setUsersError('Mật khẩu xác nhận cho tài khoản mới chưa khớp.')
      return
    }

    setCreatingUser(true)
    try {
      const response = await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          displayName: newDisplayName,
          password: newPassword,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Không thể tạo tài khoản mới.')
      }

      setNewUsername('')
      setNewDisplayName('')
      setNewPassword('')
      setNewPasswordConfirm('')
      setAccountSuccessMsg('Đã tạo tài khoản admin mới thành công.')
      await fetchUsers()
    } catch (error: any) {
      setUsersError(error?.message || 'Không thể tạo tài khoản mới.')
    } finally {
      setCreatingUser(false)
    }
  }

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setUsersError('')
    setAccountSuccessMsg('')

    if (nextPassword !== nextPasswordConfirm) {
      setUsersError('Mật khẩu mới xác nhận chưa khớp.')
      return
    }

    setChangingPassword(true)
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword: nextPassword,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Không thể đổi mật khẩu.')
      }

      setCurrentPassword('')
      setNextPassword('')
      setNextPasswordConfirm('')
      setAccountSuccessMsg(result.message || 'Đã đổi mật khẩu thành công.')
      await fetchUsers()
    } catch (error: any) {
      setUsersError(error?.message || 'Không thể đổi mật khẩu.')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleChangeSetting = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Cài đặt Website</h1>

      {errorMsg ? (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <AlertCircle className="mt-0.5 shrink-0 text-amber-500" size={18} />
          <p className="text-sm font-medium leading-relaxed">{errorMsg}</p>
        </div>
      ) : null}

      {successMsg ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-800">
          {successMsg}
        </div>
      ) : null}

      <form onSubmit={handleSaveSettings} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-10 text-center text-gray-400">Đang tải cài đặt...</div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Hotline</label>
                <input
                  name="hotline"
                  value={settings.hotline}
                  onChange={handleChangeSetting}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
                <input
                  name="email"
                  value={settings.email}
                  onChange={handleChangeSetting}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Địa chỉ trụ sở</label>
              <input
                name="address"
                value={settings.address}
                onChange={handleChangeSetting}
                placeholder="VD: Số 200, đường ..., Thái Nguyên"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Link Facebook</label>
                <input
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleChangeSetting}
                  placeholder="https://facebook.com/..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Link Zalo</label>
                <input
                  name="zalo"
                  value={settings.zalo}
                  onChange={handleChangeSetting}
                  placeholder="https://zalo.me/..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Slogan</label>
              <input
                name="slogan"
                value={settings.slogan}
                onChange={handleChangeSetting}
                placeholder="Khẳng định thương hiệu - Vững bước tương lai"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </>
        )}
      </form>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 text-orange-500" size={20} />
            <div>
              <h2 className="font-heading text-xl font-bold text-gray-900">Tài khoản admin</h2>
              <p className="text-sm text-gray-500">
                Quản lý tài khoản đăng nhập cho admin panel và theo dõi trạng thái tài khoản hiện tại.
              </p>
            </div>
          </div>

          {legacyMode ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Tài khoản hiện tại đang đăng nhập bằng cấu hình cũ trong môi trường. Khi đổi mật khẩu ở đây, hệ thống sẽ tạo hoặc cập nhật tài khoản database tương ứng để bạn dùng đăng nhập về sau.
            </div>
          ) : null}

          {currentUser ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tài khoản hiện tại</p>
              <p className="mt-1 text-base font-bold text-gray-900">
                {currentUser.displayName || currentUser.username}
              </p>
              <p className="mt-1 text-sm text-gray-600">@{currentUser.username}</p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                  {currentUser.authSource === 'database' ? 'Database account' : 'Env fallback'}
                </span>
              </div>
            </div>
          ) : null}

          {usersError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              {usersError}
            </div>
          ) : null}

          {accountSuccessMsg ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
              {accountSuccessMsg}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="grid grid-cols-[1.2fr_1fr_140px] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Tên đăng nhập</span>
              <span>Hiển thị</span>
              <span>Loại</span>
            </div>

            {usersLoading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">Đang tải danh sách tài khoản...</div>
            ) : sortedUsers.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">Chưa có tài khoản nào.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sortedUsers.map((user) => (
                  <div key={user.id} className="grid grid-cols-[1.2fr_1fr_140px] gap-3 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">@{user.username}</p>
                      {user.createdAt ? (
                        <p className="mt-1 text-xs text-gray-500">
                          Tạo lúc {new Date(user.createdAt).toLocaleString('vi-VN')}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-gray-600">{user.displayName || 'Chưa đặt tên hiển thị'}</div>
                    <div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.authSource === 'database'
                            ? 'border border-green-200 bg-green-50 text-green-700'
                            : 'border border-blue-200 bg-blue-50 text-blue-700'
                        }`}
                      >
                        {user.authSource === 'database' ? 'Database' : 'Env'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <UserPlus className="mt-0.5 text-orange-500" size={20} />
              <div>
                <h2 className="font-heading text-xl font-bold text-gray-900">Thêm tài khoản</h2>
                <p className="text-sm text-gray-500">
                  Tạo thêm tài khoản để nhiều quản trị viên có thể đăng nhập riêng.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Tên đăng nhập</label>
                <input
                  value={newUsername}
                  onChange={(event) => setNewUsername(event.target.value)}
                  placeholder="vd: admin.marketing"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Tên hiển thị</label>
                <input
                  value={newDisplayName}
                  onChange={(event) => setNewDisplayName(event.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(event) => setNewPasswordConfirm(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={creatingUser}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
              >
                <UserPlus size={16} />
                {creatingUser ? 'Đang tạo tài khoản...' : 'Thêm tài khoản admin'}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <KeyRound className="mt-0.5 text-orange-500" size={20} />
              <div>
                <h2 className="font-heading text-xl font-bold text-gray-900">Đổi mật khẩu</h2>
                <p className="text-sm text-gray-500">
                  Đổi mật khẩu cho tài khoản đang đăng nhập để tăng bảo mật.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                <input
                  type="password"
                  value={nextPassword}
                  onChange={(event) => setNextPassword(event.target.value)}
                  placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  value={nextPasswordConfirm}
                  onChange={(event) => setNextPasswordConfirm(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark disabled:opacity-50"
              >
                <KeyRound size={16} />
                {changingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
