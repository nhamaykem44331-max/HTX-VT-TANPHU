// src/lib/queries.ts
// @supabase-postgres-best-practices: typed queries, select only needed cols,
// handle errors explicitly, fallback to static data when Supabase not configured.

import { createServerSupabase } from '@/lib/supabase'
import type { NewsArticle, Job, Partner, Award } from '@/lib/types'

// ─── NEWS ────────────────────────────────────────────────────────────────────

export async function getNewsFromDB(limit = 10): Promise<NewsArticle[]> {
  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('news')
      .select('id, slug, title, excerpt, content, image, category, date, author, read_time, featured')
      .eq('published', true)
      .order('date', { ascending: false })
      .limit(limit)

    if (error || !data) throw new Error(error?.message ?? 'No data')

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      image: row.image ?? '',
      category: row.category,
      date: row.date,
      author: row.author,
      readTime: row.read_time,
      featured: row.featured ?? false,
    }))
  } catch {
    // Fallback to static data when Supabase is not configured
    const { newsArticles } = await import('@/data/news')
    return newsArticles.slice(0, limit)
  }
}

export async function getNewsBySlugFromDB(slug: string): Promise<NewsArticle | null> {
  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('news')
      .select('id, slug, title, excerpt, content, image, category, date, author, read_time, featured')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error || !data) throw new Error(error?.message ?? 'Not found')

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image ?? '',
      category: data.category,
      date: data.date,
      author: data.author,
      readTime: data.read_time,
      featured: data.featured ?? false,
    }
  } catch {
    const { getNewsBySlug } = await import('@/data/news')
    return getNewsBySlug(slug) ?? null
  }
}

export async function getNewsCountFromDB(): Promise<number> {
  try {
    const supabase = createServerSupabase()
    const { count, error } = await supabase
      .from('news')
      .select('id', { count: 'exact', head: true })
      .eq('published', true)

    if (error) throw error
    return count ?? 0
  } catch {
    const { newsArticles } = await import('@/data/news')
    return newsArticles.length
  }
}

// ─── JOBS ────────────────────────────────────────────────────────────────────

export async function getJobsCountFromDB(): Promise<number> {
  try {
    const supabase = createServerSupabase()
    const { count, error } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('published', true)

    if (error) throw error
    return count ?? 0
  } catch {
    const { jobs } = await import('@/data/jobs')
    return jobs.length
  }
}

export async function getJobsFromDB(limit = 20): Promise<Job[]> {
  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, department, location, type, deadline, description, requirements, benefits, field_id')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) throw new Error(error?.message ?? 'No data')

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      department: row.department,
      location: row.location,
      type: row.type as Job['type'],
      deadline: row.deadline,
      description: row.description,
      requirements: row.requirements ?? [],
      benefits: row.benefits ?? [],
      fieldId: row.field_id,
    }))
  } catch {
    const { jobs } = await import('@/data/jobs')
    return jobs.slice(0, limit)
  }
}

// ─── PARTNERS ────────────────────────────────────────────────────────────────

export async function getPartnersCountFromDB(): Promise<number> {
  try {
    const supabase = createServerSupabase()
    const { count, error } = await supabase
      .from('partners')
      .select('id', { count: 'exact', head: true })

    if (error) throw error
    return count ?? 0
  } catch {
    const { partners } = await import('@/data/partners')
    return partners.length
  }
}

export async function getPartnersFromDB(): Promise<Partner[]> {
  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('partners')
      .select('id, name, logo, category')
      .order('sort_order', { ascending: true })

    if (error || !data) throw new Error(error?.message ?? 'No data')

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      logo: row.logo ?? undefined,
      category: row.category,
    }))
  } catch {
    const { partners } = await import('@/data/partners')
    return partners
  }
}

// ─── AWARDS ──────────────────────────────────────────────────────────────────

export async function getAwardsCountFromDB(): Promise<number> {
  try {
    const supabase = createServerSupabase()
    const { count, error } = await supabase
      .from('awards')
      .select('id', { count: 'exact', head: true })

    if (error) throw error
    return count ?? 0
  } catch {
    const { awards } = await import('@/data/awards')
    return awards.length
  }
}

export async function getAwardsFromDB(): Promise<Award[]> {
  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('awards')
      .select('id, title, issuer, year, image, description')
      .order('sort_order', { ascending: true })

    if (error || !data) throw new Error(error?.message ?? 'No data')

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      year: row.year,
      image: row.image ?? '',
      description: row.description ?? undefined,
    }))
  } catch {
    const { awards } = await import('@/data/awards')
    return awards
  }
}

// ─── CONTACT SUBMISSIONS ─────────────────────────────────────────────────────

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
}

export async function getNewContactsCountFromDB(): Promise<number> {
  try {
    const supabase = createServerSupabase()
    const { count, error } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')

    if (error) throw error
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getRecentContactsFromDB(limit = 5): Promise<ContactSubmission[]> {
  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('id, name, email, phone, service, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) throw new Error(error?.message ?? 'No data')

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      service: row.service,
      message: row.message,
      status: row.status as ContactSubmission['status'],
      createdAt: row.created_at,
    }))
  } catch {
    return []
  }
}
