import Link from 'next/link'
import { notFound } from 'next/navigation'
import NewsForm from '@/components/admin/NewsForm'
import { createServerSupabase } from '@/lib/supabase'

export const metadata = { title: 'Sửa bài viết — Admin HTX Tân Phú' }

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  let initialData = null

  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) throw new Error('Not found')
    initialData = data
  } catch (err) {
    // Check fallback static data if Supabase isn't found
    const { newsArticles } = await import('@/data/news')
    const found = newsArticles.find(n => n.id === params.id)
    if (found) {
      initialData = { ...found, published: true } // Static data assumes published
    } else {
      notFound()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Link href="/admin" className="hover:text-orange-500 transition-colors">Admin</Link>
          <span>/</span>
          <Link href="/admin/tin-tuc" className="hover:text-orange-500 transition-colors">Tin tức</Link>
          <span>/</span>
          <span className="text-gray-900">Sửa bài viết</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Sửa bài viết</h1>
      </div>

      <NewsForm mode="edit" initialData={initialData} />
    </div>
  )
}
