import React from 'react'
import { Pencil, Trash2, Inbox } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  width?: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  emptyMessage?: string
}

export default function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  emptyMessage = 'Chưa có dữ liệu',
}: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Inbox size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right w-[100px]">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, rowIndex) => (
            <tr key={item.id ?? rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={col.key || colIndex} className="px-6 py-4 text-sm text-gray-700">
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  {onEdit && (
                    <button
                      title="Sửa"
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors inline-flex"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      title="Xóa"
                      onClick={() => onDelete(item)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors inline-flex"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
