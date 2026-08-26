import { redirect } from 'next/navigation'

// Mục này đã được gộp vào /admin/gioi-thieu — giữ đường dẫn cũ cho ai đã lưu bookmark.
export default function RedirectPage() {
  redirect('/admin/gioi-thieu')
}
