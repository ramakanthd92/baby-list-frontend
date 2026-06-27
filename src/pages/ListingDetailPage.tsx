import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, MapPin, Star, Copy, User } from 'lucide-react'
import { useListing, useListings } from '@/hooks/useListings'
import { ImageGallery } from '@/components/ImageGallery'
import { ListingMap } from '@/components/ListingMap'
import { SourceBadge } from '@/components/SourceBadge'
import { ConditionBadge } from '@/components/ConditionBadge'
import { PriceTag } from '@/components/PriceTag'
import { RelativeTime } from '@/components/RelativeTime'
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard'
import { categoryEmoji, slugToLabel } from '@/lib/utils'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: listing, isLoading, isError } = useListing(id ?? '')

  // Fetch dedup cluster listings when dedup_cluster_id is present
  const { data: clusterData } = useListings(
    listing?.dedup_cluster_id
      ? { page_size: 6, page: 1 }
      : {},
  )
  // Filter out current listing from cluster results
  const clusterListings = clusterData?.items.filter(
    l => l.id !== id && l.dedup_cluster_id === listing?.dedup_cluster_id
  ) ?? []

  if (isLoading) return <DetailSkeleton />

  if (isError || !listing) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-5xl">😕</p>
        <h2 className="text-xl font-semibold text-gray-800">Listing not found</h2>
        <p className="text-sm text-gray-500">It may have been removed or the link is incorrect.</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Go back
        </button>
      </div>
    )
  }

  const location = [listing.location_city, listing.location_state, listing.location_zip]
    .filter(Boolean)
    .join(', ')
  const hasMap = listing.location_lat != null && listing.location_lon != null

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
        <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
        {listing.category && (
          <>
            <span>/</span>
            <Link to={`/category/${listing.category}`} className="hover:text-indigo-600 transition capitalize">
              {categoryEmoji(listing.category)} {slugToLabel(listing.category)}
            </Link>
          </>
        )}
        {listing.subcategory && (
          <>
            <span>/</span>
            <span className="text-gray-800">{slugToLabel(listing.subcategory)}</span>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr]">
        {/* Left — Gallery */}
        <div className="w-full lg:w-[480px]">
          <ImageGallery images={listing.images} title={listing.title} />
        </div>

        {/* Right — Details */}
        <div className="flex flex-col gap-5">
          {/* Title + Price */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <SourceBadge source={listing.source} />
              <ConditionBadge condition={listing.condition} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl leading-tight">
              {listing.title}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <PriceTag price={listing.price} currency={listing.currency} size="lg" />
            </div>
          </div>

          {/* Seller */}
          {(listing.seller_name || listing.seller_rating) && (
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                {listing.seller_name && (
                  <p className="text-sm font-medium text-gray-900">{listing.seller_name}</p>
                )}
                {listing.seller_rating && (
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{listing.seller_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span>{location}</span>
            </div>
          )}

          {/* Time */}
          <div className="text-sm text-gray-500">
            <RelativeTime dateStr={listing.posted_at} fallback={listing.scraped_at} />
            {listing.posted_at && (
              <span className="ml-1 text-gray-400">
                · {new Date(listing.posted_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
              </span>
            )}
          </div>

          {/* External link */}
          <a
            href={listing.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            View on {slugToLabel(listing.source)}
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* Dedup cross-listing notice */}
          {listing.dedup_cluster_id && clusterListings.length > 0 && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-800">
                <Copy className="h-4 w-4" />
                Also listed on other platforms
              </div>
              <div className="flex flex-wrap gap-2">
                {clusterListings.map(cl => (
                  <Link
                    key={cl.id}
                    to={`/listing/${cl.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <SourceBadge source={cl.source} size="sm" />
                    {cl.price ? `$${parseFloat(cl.price).toFixed(0)}` : ''}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {listing.description}
            </p>
          </div>
        </section>
      )}

      {/* Map */}
      {hasMap && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Location</h2>
          <ListingMap
            lat={listing.location_lat!}
            lon={listing.location_lon!}
            title={listing.title}
            className="h-64 w-full rounded-xl overflow-hidden border border-gray-200"
          />
        </section>
      )}
    </main>
  )
}

function DetailSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 h-5 w-16 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[480px_1fr]">
        <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
        <div className="flex flex-col gap-4">
          {[80, 60, 40, 100, 32].map((w, i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-gray-200" style={{ width: `${w}%` }} />
          ))}
          <div className="h-10 w-40 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
