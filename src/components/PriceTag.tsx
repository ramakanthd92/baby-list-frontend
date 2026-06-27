import { cn, formatPrice } from '@/lib/utils'

interface PriceTagProps {
  price: string | null
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PriceTag({ price, currency = 'USD', size = 'md', className }: PriceTagProps) {
  const formatted = formatPrice(price, currency)
  const isListed = price !== null

  return (
    <span
      className={cn(
        'font-semibold',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-2xl',
        isListed ? 'text-gray-900' : 'text-gray-400 font-normal text-sm',
        className,
      )}
    >
      {formatted}
    </span>
  )
}
