import { relativeTime } from '@/lib/utils'

interface RelativeTimeProps {
  dateStr: string | null
  fallback?: string | null
  className?: string
}

export function RelativeTime({ dateStr, fallback, className }: RelativeTimeProps) {
  const display = relativeTime(dateStr ?? fallback ?? null)
  if (!display) return null
  return <span className={className}>{display}</span>
}
