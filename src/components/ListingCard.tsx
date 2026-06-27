import { Link } from 'react-router-dom'
import { MapPin, Copy } from 'lucide-react'
import type { ListingResponse } from '@/types'
import { SourceBadge } from './SourceBadge'
import { ConditionBadge } from './ConditionBadge'
import { PriceTag } from './PriceTag'
import { RelativeTime } from './RelativeTime'
import { ListingImageThumbnail } from './ListingImageThumbnail'
import { cn } from '@/lib/utils'

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
        'group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm',
        'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
    >
      {/* Image */}
      <ListingImageThumbnail
        images={listing.images}
        title={listing.title}
        className="aspect-[4/3] w-full rounded-t-xl"
      />

      {/* Source badge overlay */}
      <div className="absolute left-2 top-2">
        <SourceBadge source={listing.source} size="sm" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {/* Price + Condition */}
        <div className="flex items-center justify-between gap-2">
          <PriceTag price={listing.price} currency={listing.currency} size="md" />
          <ConditionBadge condition={listing.condition} />
        </div>

        {/* Title */}
        <p className="line-clamp-2 text-sm font-medium text-gray-800 leading-snug">
          {listing.title}
        </p>

        {/* Location + Time */}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          {location && (
            <span className="flex items-center gap-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{location}</span>
            </span>
          )}
          <RelativeTime
            dateStr={listing.posted_at}
            fallback={listing.scraped_at}
            className="shrink-0 ml-auto"
          />
        </div>

        {/* Dedup indicator */}
        {listing.dedup_cluster_id && (
          <div className="flex items-center gap-1 text-xs text-indigo-600">
            <Copy className="h-3 w-3" />
            <span>Listed on multiple sites</span>
          </div>
        )}
      </div>
    </Link>
  )
}

// Skeleton version
export function ListingCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-gray-200 bg-white', className)}>
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  )
}
