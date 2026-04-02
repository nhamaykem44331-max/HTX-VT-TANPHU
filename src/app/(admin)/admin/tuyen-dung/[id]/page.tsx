import Link from 'next/link'
import { notFound } from 'next/navigation'
import JobForm from '@/components/admin/JobForm'
import { createServerSupabase } from '@/lib/supabase'

export const metadata = { title: 'Sửa vị trí — Admin HTX Tân Phú' }

export default async function EditJobPage({ params }: { params: { id: string } }) {
  let initialData = null

  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) throw new Error('Not found')
    initialData = data
  } catch (err) {
    const { jobs } = await import('@/data/jobs')
    const found = jobs.find(j => j.id === params.id)
    if (found) {
      initialData = { ...found, published: true, field_id: found.fieldId }
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
          <Link href="/admin/tuyen-dung" className="hover:text-orange-500 transition-colors">Tuyển dụng</Link>
          <span>/</span>
          <span className="text-gray-900">Sửa vị trí</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Sửa vị trí</h1>
      </div>

      <JobForm mode="edit" initialData={initialData} />
    </div>
  )
}
