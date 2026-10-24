/**
 * Khung dùng chung cho các trang xác thực admin (đăng nhập, quên mật khẩu, đặt lại mật khẩu):
 * nền gradient xanh navy + thẻ trắng + logo HTX.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #2C3576 0%, #0F2440 100%)' }}
    >
      <div className="w-full bg-white rounded-2xl shadow-2xl p-8" style={{ maxWidth: '400px' }}>
        <div className="flex flex-col items-center mb-8 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-lg mb-4"
            style={{ backgroundColor: '#E3783A' }}
          >
            HTX
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">{subtitle || 'HTX Vận tải Ô tô Tân Phú'}</p>
        </div>

        {children}

        <p className="text-center text-xs text-gray-300 mt-6">HTX Vận tải Ô tô Tân Phú © 2025</p>
      </div>
    </div>
  )
}

export const authInputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-sm'

export function AuthSubmitButton({
  loading,
  loadingText,
  children,
}: {
  loading: boolean
  loadingText: string
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ backgroundColor: loading ? '#C2612B' : '#E3783A' }}
      onMouseEnter={(e) => {
        if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#C2612B'
      }}
      onMouseLeave={(e) => {
        if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#E3783A'
      }}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
