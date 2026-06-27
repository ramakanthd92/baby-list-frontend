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

// Category gradient colors for cards
export const CATEGORY_GRADIENT: Record<string, string> = {
  safety:     'from-blue-500 to-indigo-600',
  mobility:   'from-purple-500 to-pink-600',
  feeding:    'from-orange-400 to-red-500',
  sleeping:   'from-sky-500 to-blue-600',
  clothing:   'from-pink-500 to-rose-600',
  toys:       'from-yellow-400 to-orange-500',
  bath_care:  'from-teal-400 to-emerald-500',
  nursery:    'from-green-500 to-teal-600',
  electronics:'from-violet-500 to-purple-700',
  bikes:      'from-lime-500 to-green-600',
  cars:       'from-gray-600 to-slate-700',
  phones:     'from-blue-400 to-cyan-500',
  bags:       'from-amber-500 to-yellow-600',
  household:  'from-emerald-500 to-teal-600',
  workstation:'from-indigo-500 to-violet-600',
  jewellery:  'from-yellow-500 to-amber-600',
  uncategorized: 'from-gray-400 to-gray-600',
}

export function categoryGradient(slug: string): string {
  return CATEGORY_GRADIENT[slug] ?? 'from-indigo-500 to-purple-600'
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
