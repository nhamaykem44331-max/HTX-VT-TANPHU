import { Pool, type QueryResultRow } from 'pg'

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || ''

let pool: Pool | null = null

function getNormalizedConnectionString() {
  if (!connectionString) return ''

  const url = new URL(connectionString)
  url.searchParams.delete('sslmode')
  return url.toString()
}

export function isAdminDatabaseConfigured() {
  return !!connectionString
}

function getPool() {
  if (!connectionString) {
    throw new Error('Missing SUPABASE_DB_URL or DATABASE_URL')
  }

  if (!pool) {
    pool = new Pool({
      connectionString: getNormalizedConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 3,
    })
  }

  return pool
}

export async function queryAdminDb<T extends QueryResultRow = QueryResultRow>(
  queryText: string,
  values: unknown[] = []
) {
  const activePool = getPool()
  return activePool.query<T>(queryText, values)
}
