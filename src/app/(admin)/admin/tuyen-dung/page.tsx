import { createServerSupabase } from '@/lib/supabase'
import JobTable from './JobTable'

export const metadata = { title: 'Quản lý Tuyển dụng — Admin HTX Tân Phú' }

export default async function JobsAdminPage() {
  let data = []
  
  try {
    const supabase = createServerSupabase()
    const { data: dbData, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (error) throw error
    // map DB to type expected by UI
    data = dbData.map(row => ({
      ...row,
      fieldId: row.field_id
    })) || []
  } catch (err) {
    const { jobs } = await import('@/data/jobs')
    data = jobs
  }

  return <JobTable initialData={data as any} />
}
