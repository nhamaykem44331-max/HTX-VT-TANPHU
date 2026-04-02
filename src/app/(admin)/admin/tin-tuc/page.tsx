import { createServerSupabase } from '@/lib/supabase'
import NewsTable from './NewsTable'

export const metadata = { title: 'Quản lý Tin tức — Admin HTX Tân Phú' }

export default async function NewsAdminPage() {
  let data = []
  
  try {
    const supabase = createServerSupabase()
    const { data: dbData, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })
      
    if (error) throw error
    data = dbData || []
  } catch (err) {
    // Fallback to static data if Supabase isn't configured
    const { newsArticles } = await import('@/data/news')
    data = newsArticles
  }

  return <NewsTable initialData={data} />
}
