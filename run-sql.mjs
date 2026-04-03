import fs from 'fs'
import pg from 'pg'

const { Client } = pg
const requiredTables = [
  'news',
  'jobs',
  'partners',
  'awards',
  'contact_submissions',
  'site_settings',
  'homepage_sections',
  'hero_slides',
  'key_figures',
  'fields',
  'equipments',
]

function loadLocalEnv(filePath = '.env.local') {
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

loadLocalEnv()

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.error('Missing SUPABASE_DB_URL or DATABASE_URL')
  process.exit(1)
}

const normalizedConnectionString = (() => {
  const url = new URL(connectionString)
  url.searchParams.delete('sslmode')
  return url.toString()
})()

const client = new Client({
  connectionString: normalizedConnectionString,
  ssl: { rejectUnauthorized: false },
})

async function executeFile(filePath, label) {
  const sql = fs.readFileSync(filePath, 'utf-8')
  console.log(`Executing ${label} from ${filePath}...`)
  await client.query(sql)
}

async function ensureExtensions() {
  await client.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `)
}

async function getExistingTableCount() {
  const { rows } = await client.query(
    `
      SELECT COUNT(*)::int AS count
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY($1::text[])
    `,
    [requiredTables]
  )

  return rows[0]?.count ?? 0
}

async function ensureStorage() {
  await client.query(`
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('website-images', 'website-images', true)
    ON CONFLICT (id) DO NOTHING;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Public read access'
      ) THEN
        CREATE POLICY "Public read access"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'website-images');
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Admin upload access'
      ) THEN
        CREATE POLICY "Admin upload access"
        ON storage.objects FOR INSERT
        WITH CHECK (bucket_id = 'website-images');
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Admin update access'
      ) THEN
        CREATE POLICY "Admin update access"
        ON storage.objects FOR UPDATE
        USING (bucket_id = 'website-images');
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Admin delete access'
      ) THEN
        CREATE POLICY "Admin delete access"
        ON storage.objects FOR DELETE
        USING (bucket_id = 'website-images');
      END IF;
    END $$;
  `)
}

async function run() {
  try {
    await client.connect()
    console.log('Connected to Supabase DB')

    await ensureExtensions()

    const existingTableCount = await getExistingTableCount()
    if (existingTableCount === 0) {
      await executeFile('supabase-schema.sql', 'schema')
    } else if (existingTableCount === requiredTables.length) {
      console.log('Schema already exists, skipping schema setup')
    } else {
      throw new Error(
        `Detected partial schema setup (${existingTableCount}/${requiredTables.length} tables). Please review the database before rerunning the full bootstrap script.`
      )
    }

    console.log('Ensuring storage bucket and policies...')
    await ensureStorage()

    console.log('Supabase setup completed successfully')
  } catch (error) {
    console.error('Supabase setup failed:')
    console.error(error)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()
