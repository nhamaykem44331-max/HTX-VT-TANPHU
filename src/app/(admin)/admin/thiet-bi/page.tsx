import { redirect } from 'next/navigation'

// Mục này đã được gộp vào /admin/nang-luc — giữ đường dẫn cũ cho ai đã lưu bookmark.
export default function RedirectPage() {
  redirect('/admin/nang-luc')
}
