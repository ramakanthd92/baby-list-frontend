import { cn, conditionMeta } from '@/lib/utils'

interface ConditionBadgeProps {
  condition: string
  className?: string
}

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  const meta = conditionMeta(condition)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        meta.color,
        className,
      )}
    >
      {meta.label}
    </span>
  )
}
