import { createHash, randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { isAdminDatabaseConfigured, queryAdminDb } from '@/lib/admin-db'
import {
  ADMIN_RECOVERY_EMAIL,
  ENV_ADMIN_USERNAME,
  getDatabaseAdminByEmail,
  getDatabaseAdminByUsername,
  normalizeEmail,
  normalizeUsername,
} from '@/lib/auth'
import { isMailerConfigured, sendMail } from '@/lib/mailer'

/** Link đặt lại mật khẩu có hiệu lực trong bao nhiêu phút. */
const TOKEN_TTL_MINUTES = 30
/** Chống spam: tối đa N yêu cầu / tài khoản trong cửa sổ thời gian. */
const MAX_REQUESTS_PER_WINDOW = 3
const REQUEST_WINDOW_MINUTES = 15

interface PasswordResetRow {
  id: string
  username: string
  email: string
  token_hash: string
  expires_at: string
  used_at: string | null
  created_at: string
}

interface ResetTarget {
  username: string
  email: string
  displayName: string | null
}

let schemaReady: Promise<void> | null = null

/**
 * Tạo cột email + bảng token nếu chưa có. Idempotent, chạy 1 lần / process.
 * Giúp chức năng hoạt động ngay trên production mà không cần chạy migration tay.
 * Nội dung trùng với supabase-admin-password-reset-migration.sql.
 */
export function ensurePasswordResetSchema() {
  if (!schemaReady) {
    schemaReady = queryAdminDb(`
      ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS email TEXT;

      CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_email_unique
        ON public.admin_users (LOWER(email))
        WHERE email IS NOT NULL AND email <> '';

      CREATE TABLE IF NOT EXISTS public.admin_password_resets (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_admin_password_resets_username
        ON public.admin_password_resets (username, created_at DESC);

      ALTER TABLE public.admin_password_resets ENABLE ROW LEVEL SECURITY;
    `)
      .then(() => undefined)
      .catch((error) => {
        schemaReady = null
        throw error
      })
  }

  return schemaReady
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function assertPasswordResetConfigured() {
  if (!isAdminDatabaseConfigured()) {
    throw new Error('Chưa cấu hình SUPABASE_DB_URL nên không thể đặt lại mật khẩu.')
  }
  if (!isMailerConfigured()) {
    throw new Error('Chưa cấu hình SMTP_USER / SMTP_PASS để gửi email khôi phục.')
  }
}

/**
 * Tìm tài khoản và email nhận link từ "tên đăng nhập hoặc email" người dùng nhập.
 * Ưu tiên email lưu trong database; nếu tài khoản chưa có email thì dùng
 * ADMIN_RECOVERY_EMAIL (email chủ website) làm phương án dự phòng.
 */
async function resolveResetTarget(identifier: string): Promise<ResetTarget | null> {
  const raw = identifier.trim()
  if (!raw) return null

  if (raw.includes('@')) {
    const email = normalizeEmail(raw)
    const userByEmail = await getDatabaseAdminByEmail(email)
    if (userByEmail) {
      return { username: userByEmail.username, email, displayName: userByEmail.display_name }
    }

    if (ADMIN_RECOVERY_EMAIL && email === ADMIN_RECOVERY_EMAIL) {
      const envUser = await getDatabaseAdminByUsername(ENV_ADMIN_USERNAME)
      return {
        username: ENV_ADMIN_USERNAME,
        email: envUser?.email || ADMIN_RECOVERY_EMAIL,
        displayName: envUser?.display_name || 'Tài khoản hệ thống',
      }
    }

    return null
  }

  const username = normalizeUsername(raw)
  const user = await getDatabaseAdminByUsername(username)
  if (user) {
    const email = user.email ? normalizeEmail(user.email) : ADMIN_RECOVERY_EMAIL
    if (!email) return null
    return { username: user.username, email, displayName: user.display_name }
  }

  if (username === ENV_ADMIN_USERNAME && ADMIN_RECOVERY_EMAIL) {
    return { username, email: ADMIN_RECOVERY_EMAIL, displayName: 'Tài khoản hệ thống' }
  }

  return null
}

async function isRateLimited(username: string) {
  const result = await queryAdminDb<{ count: number }>(
    `
      SELECT COUNT(*)::int AS count
      FROM public.admin_password_resets
      WHERE username = $1
        AND created_at > NOW() - ($2 || ' minutes')::interval
    `,
    [username, String(REQUEST_WINDOW_MINUTES)]
  )

  return (result.rows[0]?.count ?? 0) >= MAX_REQUESTS_PER_WINDOW
}

function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 3))}@${domain}`
}

function buildResetEmail(input: { displayName: string | null; username: string; link: string }) {
  const name = input.displayName || input.username
  const subject = 'Đặt lại mật khẩu quản trị website HTX Tân Phú'
  const text = [
    `Xin chào ${name},`,
    '',
    `Có yêu cầu đặt lại mật khẩu cho tài khoản quản trị "${input.username}" trên website HTX Vận tải Ô tô Tân Phú.`,
    `Bấm vào liên kết sau để đặt mật khẩu mới (hiệu lực ${TOKEN_TTL_MINUTES} phút, chỉ dùng được 1 lần):`,
    '',
    input.link,
    '',
    'Nếu bạn không yêu cầu, hãy bỏ qua email này. Mật khẩu hiện tại vẫn giữ nguyên.',
  ].join('\n')

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1f2937">
      <div style="background:#2C3576;padding:20px 24px;border-radius:12px 12px 0 0">
        <p style="margin:0;color:#fff;font-size:18px;font-weight:700">HTX Vận tải Ô tô Tân Phú</p>
        <p style="margin:4px 0 0;color:#c7cbe6;font-size:13px">Quản trị website</p>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:0;padding:24px;border-radius:0 0 12px 12px">
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Có yêu cầu đặt lại mật khẩu cho tài khoản quản trị <strong>${input.username}</strong>.</p>
        <p>Bấm nút bên dưới để đặt mật khẩu mới. Liên kết có hiệu lực <strong>${TOKEN_TTL_MINUTES} phút</strong> và chỉ dùng được một lần.</p>
        <p style="text-align:center;margin:28px 0">
          <a href="${input.link}" style="background:#E3783A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;display:inline-block">Đặt lại mật khẩu</a>
        </p>
        <p style="font-size:13px;color:#6b7280">Nếu nút không bấm được, dán liên kết này vào trình duyệt:<br><a href="${input.link}" style="color:#2C3576;word-break:break-all">${input.link}</a></p>
        <p style="font-size:13px;color:#6b7280">Nếu bạn không yêu cầu, hãy bỏ qua email này. Mật khẩu hiện tại vẫn giữ nguyên.</p>
      </div>
    </div>
  `

  return { subject, text, html }
}

/**
 * Gửi link đặt lại mật khẩu. Luôn trả về kết quả "mềm" để không lộ tài khoản nào tồn tại;
 * chỉ ném lỗi khi server chưa cấu hình (DB / SMTP) hoặc gửi mail thất bại.
 */
export async function requestPasswordReset(identifier: string, baseUrl: string) {
  assertPasswordResetConfigured()
  await ensurePasswordResetSchema()

  const target = await resolveResetTarget(identifier)
  if (!target) return { sent: false as const, reason: 'no-target' as const }

  if (await isRateLimited(target.username)) {
    return { sent: false as const, reason: 'rate-limited' as const }
  }

  const token = randomBytes(32).toString('hex')
  await queryAdminDb(
    `
      INSERT INTO public.admin_password_resets (username, email, token_hash, expires_at)
      VALUES ($1, $2, $3, NOW() + ($4 || ' minutes')::interval)
    `,
    [target.username, target.email, hashToken(token), String(TOKEN_TTL_MINUTES)]
  )

  const link = `${baseUrl.replace(/\/+$/, '')}/admin/dat-lai-mat-khau?token=${token}`
  const mail = buildResetEmail({ displayName: target.displayName, username: target.username, link })
  await sendMail({ to: target.email, ...mail })

  return { sent: true as const, maskedEmail: maskEmail(target.email) }
}

export async function getValidPasswordReset(token: string): Promise<PasswordResetRow | null> {
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) return null
  if (!isAdminDatabaseConfigured()) return null
  await ensurePasswordResetSchema()

  const result = await queryAdminDb<PasswordResetRow>(
    `
      SELECT id, username, email, token_hash, expires_at, used_at, created_at
      FROM public.admin_password_resets
      WHERE token_hash = $1
        AND used_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
    `,
    [hashToken(token)]
  )

  return result.rows[0] || null
}

/**
 * Đặt mật khẩu mới bằng token. Nếu tài khoản mới chỉ tồn tại dạng env (chưa có trong database)
 * thì tạo bản ghi database, giống cách changeAdminPassword chuyển đổi.
 */
export async function resetPasswordWithToken(token: string, newPassword: string) {
  const reset = await getValidPasswordReset(token)
  if (!reset) {
    throw new Error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.')
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)
  const existingUser = await getDatabaseAdminByUsername(reset.username)

  if (existingUser) {
    await queryAdminDb(
      `
        UPDATE public.admin_users
        SET password_hash = $2,
            email = COALESCE(NULLIF(email, ''), $3)
        WHERE id = $1
      `,
      [existingUser.id, passwordHash, reset.email]
    )
  } else {
    await queryAdminDb(
      `
        INSERT INTO public.admin_users (username, display_name, email, password_hash, is_active)
        VALUES ($1, $2, $3, $4, true)
        ON CONFLICT (username) DO UPDATE
          SET password_hash = EXCLUDED.password_hash,
              is_active = true
      `,
      [reset.username, 'Quản trị viên', reset.email, passwordHash]
    )
  }

  // Vô hiệu mọi token còn lại của tài khoản này
  await queryAdminDb(
    `
      UPDATE public.admin_password_resets
      SET used_at = NOW()
      WHERE username = $1 AND used_at IS NULL
    `,
    [reset.username]
  )

  return { username: reset.username }
}
