import { supabase } from './supabase'
import { newsArticles as staticNews } from '@/data/news'
import { jobs as staticJobs } from '@/data/jobs'
import { partners as staticPartners } from '@/data/partners'
import { awards as staticAwards } from '@/data/awards'
import type { NewsArticle, Job, Partner, Award, BusinessField } from './types'

// ============ HOMEPAGE SECTIONS ============
export async function getHeroSlides() {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('enabled', true)
      .order('sort_order', { ascending: true })
    if (error || !data?.length) throw new Error('fallback')
    return data
  } catch {
    return [
      { id: '1', title: '30 NĂM HÒA HỢP\nCÙNG PHÁT TRIỂN', subtitle: 'HTX Vận tải Ô tô Tân Phú', description: 'Đa ngành, Chuyên nghiệp, Uy tín', image: '', cta_text: 'Khám phá dịch vụ', cta_link: '/linh-vuc', sort_order: 1 },
      { id: '2', title: 'NĂNG LỰC CẨU LẮP\nHÀNG ĐẦU KHU VỰC', subtitle: 'Cần cẩu 330 tấn', description: '9 cần cẩu từ 20 đến 330 tấn', image: '', cta_text: 'Khám phá dịch vụ', cta_link: '/linh-vuc', sort_order: 2 },
      { id: '3', title: 'KHÁCH SẠN PHƯƠNG ANH\n41 PHÒNG TIÊU CHUẨN', subtitle: 'Số 345 Thống Nhất, Tích Lương', description: 'Không gian thoáng đãng, Dịch vụ tận tâm', image: '', cta_text: 'Khám phá dịch vụ', cta_link: '/linh-vuc', sort_order: 3 },
      { id: '4', title: 'NÔNG NGHIỆP SẠCH\nHỮU CƠ VIETGAP', subtitle: 'Nông nghiệp hữu cơ VietGAP', description: '2ha rau sạch không hóa chất', image: '', cta_text: 'Khám phá dịch vụ', cta_link: '/linh-vuc', sort_order: 4 },
    ]
  }
}

export async function getKeyFigures() {
  try {
    const { data, error } = await supabase
      .from('key_figures')
      .select('*')
      .eq('enabled', true)
      .order('sort_order', { ascending: true })
    if (error || !data?.length) throw new Error('fallback')
    return data
  } catch {
    const { KEY_FIGURES } = await import('./constants')
    return KEY_FIGURES.map((fig, i) => ({
      id: String(i + 1),
      label: fig.label,
      value: fig.value,
      suffix: fig.suffix,
      prefix: '',
      icon: fig.icon,
      sort_order: i + 1,
      enabled: true,
    }))
  }
}

export async function getHomepageSections() {
  try {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error || !data?.length) throw new Error('fallback')
    return data
  } catch {
    return [
      { id: 'hero', title: 'Hero Banner', subtitle: 'Banner chính trang chủ', enabled: true, sort_order: 1 },
      { id: 'fields', title: 'Lĩnh vực hoạt động', subtitle: '7 lĩnh vực kinh doanh đa dạng', enabled: true, sort_order: 2 },
      { id: 'key_figures', title: 'Con số biết nói', subtitle: '30 năm tích lũy', enabled: true, sort_order: 3 },
      { id: 'equipment', title: 'Năng lực và thiết bị', subtitle: 'Hệ thống hiện đại', enabled: true, sort_order: 4 },
      { id: 'news', title: 'Tin tức & Sự kiện', subtitle: 'Cập nhật mới nhất', enabled: true, sort_order: 5 },
      { id: 'awards', title: 'Thành tích nổi bật', subtitle: 'Giải thưởng và vinh danh', enabled: true, sort_order: 6 },
      { id: 'partners', title: 'Đối tác tin cậy', subtitle: 'Hợp tác cùng phát triển', enabled: true, sort_order: 7 },
      { id: 'cta', title: 'Liên hệ ngay', subtitle: 'Sẵn sàng phục vụ', enabled: true, sort_order: 8 },
    ]
  }
}

// ============ NEWS ============
export async function getNews(limit?: number): Promise<NewsArticle[]> {
  try {
    let query = supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false })
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    
    // Ignore postgrest error "relation does not exist" when table is not ready
    if (error && error.code !== '42P01') throw error
    if (!data?.length) throw new Error('fallback')
    
    // Map snake_case DB columns to camelCase interface
    return data.map(mapNewsFromDB)
  } catch {
    return limit ? staticNews.slice(0, limit) : staticNews
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase
      .from('news').select('*').eq('slug', slug).eq('published', true).single()
    if (error && error.code !== '42P01') throw error
    if (!data) throw new Error('fallback')
    return mapNewsFromDB(data)
  } catch {
    return staticNews.find(n => n.slug === slug) || null
  }
}

export async function getFeaturedNews(): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase
      .from('news').select('*').eq('published', true).eq('featured', true).order('date', { ascending: false }).limit(1).single()
    if (error && error.code !== '42P01') throw error
    if (!data) throw new Error('fallback')
    return mapNewsFromDB(data)
  } catch {
    return staticNews.find(n => n.featured) || null
  }
}

// ============ JOBS ============
export async function getJobs(): Promise<Job[]> {
  try {
    const { data, error } = await supabase
      .from('jobs').select('*').eq('published', true).order('deadline', { ascending: true })
    if (error && error.code !== '42P01') throw error
    if (!data?.length) throw new Error('fallback')
    return data.map(mapJobFromDB)
  } catch {
    return staticJobs
  }
}

// ============ PARTNERS ============
export async function getPartners(): Promise<Partner[]> {
  try {
    const { data, error } = await supabase
      .from('partners').select('*').order('sort_order', { ascending: true })
    if (error && error.code !== '42P01') throw error
    if (!data?.length) throw new Error('fallback')
    return data
  } catch {
    return staticPartners
  }
}

// ============ AWARDS ============
export async function getAwards(): Promise<Award[]> {
  try {
    const { data, error } = await supabase
      .from('awards').select('*').order('sort_order', { ascending: true })
    if (error && error.code !== '42P01') throw error
    if (!data?.length) throw new Error('fallback')
    return data
  } catch {
    return staticAwards
  }
}

// ============ FIELDS ============
export async function getFields(): Promise<BusinessField[]> {
  try {
    const { data, error } = await supabase
      .from('fields').select('*').order('sort_order', { ascending: true })
    if (error && error.code !== '42P01') throw error
    if (!data?.length) throw new Error('fallback')
    return data.map(mapFieldFromDB)
  } catch {
    const { fields: staticFields } = await import('@/data/fields')
    return staticFields
  }
}

// ============ EQUIPMENTS ============
export async function getEquipments(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('equipments').select('*').order('sort_order', { ascending: true })
    if (error && error.code !== '42P01') throw error
    if (!data?.length) throw new Error('fallback')
    return data
  } catch {
    // Return static mock data as fallback
    const equipmentItems = [
      { name: "Xe tải 40 tấn Hyundai", category: "Xe tải", desc: "Trọng tải 40 tấn, trang bị GPS Vietmap" },
      { name: "Xe tải 20 tấn", category: "Xe tải", desc: "Đội xe 26 chiếc phủ khắp cả nước" },
      { name: "Xe khách 29 chỗ", category: "Xe tải", desc: "5 xe khách phục vụ hợp đồng" },
      { name: "Cần cẩu 330 tấn", category: "Cần cẩu", desc: "Cẩu lớn nhất khu vực Đông Bắc" },
      { name: "Cần cẩu 100 tấn", category: "Cần cẩu", desc: "Linh hoạt trong các công trình vừa" },
      { name: "Cần cẩu 50 tấn", category: "Cần cẩu", desc: "Lắp đặt thiết bị công nghiệp nhẹ" },
      { name: "Kho bãi Yên Bình", category: "Kho bãi", desc: "5.000m² kho chứa thép hiện đại" },
      { name: "Kho bãi Tích Lương", category: "Kho bãi", desc: "Kho phân phối hàng trung chuyển" },
      { name: "Hệ thống GPS Vietmap", category: "Công nghệ", desc: "Theo dõi đội xe thời gian thực" },
      { name: "Phần mềm Skyhotel PMS", category: "Công nghệ", desc: "Quản lý khách sạn chuyên nghiệp" },
      { name: "GDS Amadeus", category: "Công nghệ", desc: "Hệ thống đặt vé toàn cầu" },
      { name: "Base.vn HRM/CRM", category: "Công nghệ", desc: "Quản lý nhân sự và khách hàng" },
    ];
    return equipmentItems;
  }
}

// ============ MAPPERS (DB snake_case → TS camelCase) ============
function mapNewsFromDB(row: any): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image || '',
    category: row.category,
    date: row.date,
    author: row.author,
    readTime: row.read_time,
    featured: row.featured,
  }
}

function mapJobFromDB(row: any): Job {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    deadline: row.deadline,
    description: row.description,
    requirements: row.requirements || [],
    benefits: row.benefits || [],
    fieldId: row.field_id,
  }
}

function mapFieldFromDB(row: any): BusinessField {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon: row.icon,
    shortDesc: row.short_desc,
    description: row.description,
    image: row.image,
    stats: row.stats || [],
    features: row.features || [],
    services: row.services || [],
    articleContent: row.article_content || '',
    articleImages: row.article_images || [],
  }
}
