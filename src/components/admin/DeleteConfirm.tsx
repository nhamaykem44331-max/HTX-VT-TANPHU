import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  loading?: boolean
}

export default function DeleteConfirm({ open, onClose, onConfirm, title, message, loading }: DeleteConfirmProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />
      
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-fade-in z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
