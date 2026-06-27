import { Link } from 'react-router-dom'
import { MapPin, Copy, ExternalLink } from 'lucide-react'
import type { ListingResponse } from '@/types'
import { SourceBadge } from './SourceBadge'
import { ConditionBadge } from './ConditionBadge'
import { PriceTag } from './PriceTag'
import { RelativeTime } from './RelativeTime'
import { ListingImageThumbnail } from './ListingImageThumbnail'
import { cn, categoryEmoji, categoryGradient } from '@/lib/utils'

interface ListingCardProps {
  listing: ListingResponse
  className?: string
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const location = [listing.location_city, listing.location_state]
    .filter(Boolean)
    .join(', ')

  return (
    <Link
      to={`/listing/${listing.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm',
        'transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100',
        className,
      )}
    >
      {/* Image */}
      {listing.images?.length ? (
        <ListingImageThumbnail
          images={listing.images}
          title={listing.title}
          className="aspect-[4/3] w-full"
        />
      ) : (
        <div className={cn(
          'aspect-[4/3] w-full flex items-center justify-center',
          `bg-gradient-to-br ${categoryGradient(listing.category ?? 'uncategorized')}`,
        )}>
          <span className="text-5xl opacity-80">{categoryEmoji(listing.category ?? 'uncategorized')}</span>
        </div>
      )}

      {/* Source badge overlay */}
      <div className="absolute left-2.5 top-2.5">
        <SourceBadge source={listing.source} size="sm" />
      </div>

      {/* Dedup indicator overlay */}
      {listing.dedup_cluster_id && (
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-indigo-600/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          <Copy className="h-2.5 w-2.5" />
          Multi-platform
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Price */}
        <div className="flex items-start justify-between gap-2">
          <PriceTag price={listing.price} currency={listing.currency} size="md" />
          <ConditionBadge condition={listing.condition} />
        </div>

        {/* Title */}
        <p className="line-clamp-2 text-sm font-medium text-gray-800 leading-snug group-hover:text-indigo-700 transition-colors">
          {listing.title}
        </p>

        {/* Footer: Location + Time */}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
          {location ? (
            <span className="flex items-center gap-0.5 truncate">
              <MapPin className="h-3 w-3 shrink-0 text-gray-300" />
              <span className="truncate">{location}</span>
            </span>
          ) : <span />}
          <RelativeTime
            dateStr={listing.posted_at}
            fallback={listing.scraped_at}
            className="shrink-0 ml-2 font-medium"
          />
        </div>
      </div>

      {/* Hover: "View listing" pill that appears */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 p-2.5 bg-gradient-to-t from-white/95 to-transparent">
        <div className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white">
          <ExternalLink className="h-3.5 w-3.5" />
          View listing
        </div>
      </div>
    </Link>
  )
}

// Skeleton version
export function ListingCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm', className)}>
      <div className="aspect-[4/3] w-full animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-14 animate-pulse rounded-full bg-gray-100" />
        </div>
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="mt-1 h-3 w-20 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  )
}
