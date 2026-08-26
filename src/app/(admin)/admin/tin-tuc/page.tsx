import { getJobs, getNews } from '@/lib/data-service'
import { getPageEditorContent } from '@/lib/page-content'
import PageContentEditor from '@/components/admin/PageContentEditor'

export default async function AdminPage() {
  const [content, news, jobs] = await Promise.all([
    getPageEditorContent(),
    getNews(),
    getJobs(),
  ])

  return (
    <PageContentEditor
      page="tin-tuc"
      initialContent={content}
      initialNews={news}
      initialJobs={jobs}
    />
  )
}
