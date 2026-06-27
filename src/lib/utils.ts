import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | null, currency = 'USD'): string {
  if (!price) return 'Price not listed'
  const num = parseFloat(price)
  if (isNaN(num)) return 'Price not listed'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export function relativeTime(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr  = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffWk  = Math.floor(diffDay / 7)
  const diffMo  = Math.floor(diffDay / 30)

  if (diffSec < 60)   return 'Just now'
  if (diffMin < 60)   return `${diffMin}m ago`
  if (diffHr < 24)    return `${diffHr}h ago`
  if (diffDay === 1)  return 'Yesterday'
  if (diffDay < 7)    return `${diffDay}d ago`
  if (diffWk < 5)     return `${diffWk}w ago`
  if (diffMo < 12)    return `${diffMo}mo ago`
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function slugToLabel(slug: string): string {
  return slug
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Category emoji map — data-driven fallback
export const CATEGORY_EMOJI: Record<string, string> = {
  safety:     '🛡️',
  mobility:   '🛺',
  feeding:    '🍼',
  sleeping:   '🛏️',
  clothing:   '👗',
  toys:       '🧸',
  bath_care:  '🛁',
  nursery:    '🏠',
  cars:       '🚗',
  phones:     '📱',
  bikes:      '🚲',
  bags:       '👜',
  clothes:    '👕',
  electronics:'💻',
  jewellery:  '💍',
  household:  '🏡',
  workstation:'🖥️',
  uncategorized: '📦',
}

export function categoryEmoji(slug: string): string {
  return CATEGORY_EMOJI[slug] ?? '📦'
}

// Source display map
export const SOURCE_META: Record<string, { label: string; emoji: string; color: string }> = {
  craigslist: { label: 'Craigslist', emoji: '📋', color: 'bg-purple-100 text-purple-800' },
  ebay:       { label: 'eBay',       emoji: '🛒', color: 'bg-yellow-100 text-yellow-800' },
  facebook:   { label: 'Facebook',   emoji: '👥', color: 'bg-blue-100 text-blue-800' },
  etsy:       { label: 'Etsy',       emoji: '🎨', color: 'bg-orange-100 text-orange-800' },
  offerup:    { label: 'OfferUp',    emoji: '🏷️', color: 'bg-green-100 text-green-800' },
  mercari:    { label: 'Mercari',    emoji: '🛍️', color: 'bg-red-100 text-red-800' },
}

export function sourceMeta(source: string) {
  return SOURCE_META[source.toLowerCase()] ?? {
    label: slugToLabel(source),
    emoji: '🔗',
    color: 'bg-gray-100 text-gray-800',
  }
}

// Condition display
export const CONDITION_META: Record<string, { label: string; color: string }> = {
  new:       { label: 'New',       color: 'bg-emerald-100 text-emerald-800' },
  used:      { label: 'Used',      color: 'bg-blue-100 text-blue-800' },
  fair:      { label: 'Fair',      color: 'bg-amber-100 text-amber-800' },
  good:      { label: 'Good',      color: 'bg-sky-100 text-sky-800' },
  excellent: { label: 'Excellent', color: 'bg-teal-100 text-teal-800' },
  poor:      { label: 'Poor',      color: 'bg-red-100 text-red-800' },
}

export function conditionMeta(condition: string) {
  return CONDITION_META[condition.toLowerCase()] ?? {
    label: slugToLabel(condition),
    color: 'bg-gray-100 text-gray-700',
  }
}
