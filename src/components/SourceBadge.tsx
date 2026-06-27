import { cn, sourceMeta } from '@/lib/utils'

interface SourceBadgeProps {
  source: string
  size?: 'sm' | 'md'
  className?: string
}

export function SourceBadge({ source, size = 'md', className }: SourceBadgeProps) {
  const meta = sourceMeta(source)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        meta.color,
        className,
      )}
    >
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  )
}
