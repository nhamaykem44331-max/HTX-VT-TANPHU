-- Quen mat khau admin: them email khoi phuc va bang token dat lai mat khau.
-- Idempotent: chay nhieu lan khong loi. Code cung tu chay DDL nay khi can
-- (xem src/lib/password-reset.ts), file nay de doc va de run-sql.mjs dung.

ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS email TEXT;

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
