import { getJobs, getNews } from '@/lib/data-service'
import { getPageEditorContent } from '@/lib/page-content'
import SectionContentAdminPage from './SectionContentAdminPage'

export default async function ChinhSuaDauMucPage() {
  const [content, news, jobs] = await Promise.all([
    getPageEditorContent(),
    getNews(),
    getJobs(),
  ])

  return (
    <SectionContentAdminPage
      initialContent={content}
      initialNews={news}
      initialJobs={jobs}
    />
  )
}
