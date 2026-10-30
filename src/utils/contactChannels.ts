type ContactValues = { email: string; phone: string; behance: string; xiaohongshu: string }
export type ContactChannel = { id: keyof ContactValues; label: string; href: string | null; external: boolean }

function safeWebsite(value: string): string | null {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null
  } catch { return null }
}

/** Placeholders stay non-links; only owner-supplied, safe values can navigate. */
export function createContactChannels(values: ContactValues): ContactChannel[] {
  const email = values.email.trim()
  const phone = values.phone.trim()
  const number = phone.replace(/[\s()-]/g, '')
  const emailHref = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(email) ? `mailto:${encodeURIComponent(email).replace('%40', '@')}` : null
  const phoneHref = /^\+?[\d\s()-]+$/.test(phone) && /^\+?\d{7,15}$/.test(number) ? `tel:${number}` : null
  return [
    { id: 'email', label: 'Email', href: emailHref, external: false },
    { id: 'phone', label: 'Phone', href: phoneHref, external: false },
    { id: 'behance', label: 'Behance', href: safeWebsite(values.behance), external: true },
    { id: 'xiaohongshu', label: '小红书', href: safeWebsite(values.xiaohongshu), external: true },
  ]
}
