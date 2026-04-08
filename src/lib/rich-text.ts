const ALLOWED_TAGS = new Set([
  'a',
  'blockquote',
  'br',
  'em',
  'h2',
  'h3',
  'h4',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'u',
  'ul',
])

const STYLE_ALLOWED_TAGS = new Set(['blockquote', 'em', 'h2', 'h3', 'h4', 'p', 'span', 'strong', 'u'])
const DANGEROUS_TAGS = ['button', 'embed', 'form', 'iframe', 'input', 'link', 'meta', 'noscript', 'object', 'script', 'select', 'style', 'svg', 'textarea']
const BLOCK_TAGS = ['blockquote', 'h1', 'h2', 'h3', 'h4', 'li', 'ol', 'p', 'ul']

const BASIC_HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '&nbsp;': ' ',
  '&#39;': "'",
  '&quot;': '"',
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function decodeBasicHtmlEntities(value: string): string {
  return value.replace(/&amp;|&gt;|&lt;|&nbsp;|&#39;|&quot;/g, (match) => BASIC_HTML_ENTITIES[match] ?? match)
}

function extractAttribute(attributes: string, name: string): string | null {
  const pattern = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'=<>\\x60]+))`, 'i')
  const match = attributes.match(pattern)

  if (!match) {
    return null
  }

  return match[2] ?? match[3] ?? match[4] ?? ''
}

function sanitizeInlineStyle(value: string): string {
  const safeDeclarations: string[] = []

  for (const declaration of value.split(';')) {
    const [property, ...rest] = declaration.split(':')
    const styleName = property?.trim().toLowerCase()
    const styleValue = rest.join(':').trim().toLowerCase()

    if (!styleName || !styleValue) {
      continue
    }

    if (styleName === 'font-weight' && /^(bold|[5-9]00)$/.test(styleValue)) {
      safeDeclarations.push(`font-weight:${styleValue}`)
      continue
    }

    if (styleName === 'font-style' && /^(italic|oblique)$/.test(styleValue)) {
      safeDeclarations.push(`font-style:${styleValue}`)
      continue
    }

    if (styleName === 'text-decoration' && /^(underline|line-through|underline line-through|line-through underline)$/.test(styleValue)) {
      safeDeclarations.push(`text-decoration:${styleValue}`)
      continue
    }

    if (styleName === 'text-align' && /^(left|right|center|justify)$/.test(styleValue)) {
      safeDeclarations.push(`text-align:${styleValue}`)
    }
  }

  return safeDeclarations.join(';')
}

function sanitizeHref(value: string): string | null {
  const href = value.trim()

  if (!href) {
    return null
  }

  if (/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
    return href
  }

  return null
}

export function hasHtmlContent(content: string): boolean {
  return /<\/?[a-z][\w:-]*\b[^>]*>/i.test(content)
}

export function convertPlainTextToHtml(content: string): string {
  const normalized = content.replace(/\r\n?/g, '\n').trim()

  if (!normalized) {
    return ''
  }

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('')
}

export function sanitizeRichTextHtml(content: string): string {
  if (!content.trim()) {
    return ''
  }

  let sanitized = content
    .replace(/\r\n?/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<\/?o:[^>]*>/gi, '')
    .replace(/<\/?[a-z0-9-]+:[^>]*>/gi, '')
    .replace(/<o:p>\s*<\/o:p>/gi, '')
    .replace(/<o:p>[\s\S]*?<\/o:p>/gi, '')

  for (const tag of DANGEROUS_TAGS) {
    sanitized = sanitized
      .replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'), '')
      .replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi'), '')
  }

  sanitized = sanitized
    .replace(/<\s*b\b([^>]*)>/gi, '<strong$1>')
    .replace(/<\s*\/\s*b\s*>/gi, '</strong>')
    .replace(/<\s*i\b([^>]*)>/gi, '<em$1>')
    .replace(/<\s*\/\s*i\s*>/gi, '</em>')
    .replace(/<\s*h1\b([^>]*)>/gi, '<h2$1>')
    .replace(/<\s*\/\s*h1\s*>/gi, '</h2>')
    .replace(/<\s*div\b([^>]*)>/gi, '<p$1>')
    .replace(/<\s*\/\s*div\s*>/gi, '</p>')

  sanitized = sanitized.replace(/<\s*(\/?)\s*([a-z0-9-]+)([^>]*)>/gi, (_match, closingSlash: string, rawTag: string, rawAttributes: string) => {
    const tag = rawTag.toLowerCase()

    if (!ALLOWED_TAGS.has(tag)) {
      return ''
    }

    if (closingSlash) {
      return tag === 'br' ? '' : `</${tag}>`
    }

    if (tag === 'br') {
      return '<br />'
    }

    const safeAttributes: string[] = []

    if (STYLE_ALLOWED_TAGS.has(tag)) {
      const styleValue = extractAttribute(rawAttributes, 'style')
      const safeStyle = styleValue ? sanitizeInlineStyle(styleValue) : ''

      if (safeStyle) {
        safeAttributes.push(`style="${escapeHtml(safeStyle)}"`)
      }
    }

    if (tag === 'a') {
      const hrefValue = extractAttribute(rawAttributes, 'href')
      const safeHref = hrefValue ? sanitizeHref(hrefValue) : null

      if (safeHref) {
        safeAttributes.push(`href="${escapeHtml(safeHref)}"`)
        safeAttributes.push('rel="noopener noreferrer nofollow"')

        const targetValue = extractAttribute(rawAttributes, 'target')
        if (targetValue === '_blank') {
          safeAttributes.push('target="_blank"')
        }
      }
    }

    return safeAttributes.length > 0 ? `<${tag} ${safeAttributes.join(' ')}>` : `<${tag}>`
  })

  sanitized = sanitized
    .replace(/&nbsp;/gi, ' ')
    .replace(/<(p|h2|h3|h4|blockquote|li)>\s*(?:<br\s*\/?>|\s|&nbsp;)*<\/\1>/gi, '')
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br /><br />')
    .trim()

  return sanitized
}

export function normalizeRichTextContent(content: string): string {
  return hasHtmlContent(content) ? sanitizeRichTextHtml(content) : convertPlainTextToHtml(content)
}

export function getPlainTextFromRichText(content: string): string {
  const normalized = hasHtmlContent(content) ? content : convertPlainTextToHtml(content)
  const withLineBreaks = normalized
    .replace(new RegExp(`</(${BLOCK_TAGS.join('|')})>`, 'gi'), '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')

  return decodeBasicHtmlEntities(withLineBreaks)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}
