import { createTransport, type Transporter } from 'nodemailer'

/**
 * Gửi email qua SMTP (mặc định Gmail).
 *
 * Với Gmail cần bật xác minh 2 bước rồi tạo "Mật khẩu ứng dụng" (App Password)
 * tại https://myaccount.google.com/apppasswords và đặt vào SMTP_PASS.
 * Mật khẩu Gmail thường sẽ không đăng nhập được qua SMTP.
 */
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = (process.env.SMTP_PASS || '').replace(/\s+/g, '')
const MAIL_FROM = process.env.MAIL_FROM || (SMTP_USER ? `HTX Tân Phú <${SMTP_USER}>` : '')

export function isMailerConfigured() {
  return Boolean(SMTP_USER && SMTP_PASS)
}

let transporter: Transporter | null = null

function getTransporter() {
  if (!isMailerConfigured()) {
    throw new Error('Chưa cấu hình SMTP_USER / SMTP_PASS để gửi email.')
  }

  if (!transporter) {
    transporter = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }

  return transporter
}

export async function sendMail(input: { to: string; subject: string; text: string; html: string }) {
  const transport = getTransporter()
  await transport.sendMail({
    from: MAIL_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  })
}
