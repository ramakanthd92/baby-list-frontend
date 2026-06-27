import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { useListings } from '@/hooks/useListings'
import { useCategories, useSources } from '@/hooks/useCategories'
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard'
import { categoryEmoji, sourceMeta } from '@/lib/utils'

export function HomePage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const { data: categories = [], isLoading: catsLoading } = useCategories()
  const { data: sourcesData = [] } = useSources()
  const { data: recent, isLoading: recentLoading } = useListings({ page_size: 16, page: 1 })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    else navigate('/search')
  }

  return (
    <main className="flex flex-col gap-12 pb-16">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-4 py-16 sm:py-24 text-white">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white" />
          <div className="absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Find great deals on<br />
            <span className="text-yellow-300">second-hand items</span>
          </h1>
          <p className="mb-8 text-lg text-indigo-200 sm:text-xl">
            Listings from Craigslist, eBay, Facebook Marketplace, OfferUp and more — all in one place.
          </p>

          <form onSubmit={handleSearch} className="flex overflow-hidden rounded-full bg-white shadow-xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for anything…"
                className="h-14 w-full rounded-l-full pl-12 pr-4 text-gray-900 text-base outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition rounded-r-full text-sm sm:text-base"
            >
              Search
            </button>
          </form>

          <p className="mt-4 text-sm text-indigo-300">
            Try: "baby stroller", "iPhone 14", "road bike", "standing desk"
          </p>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
        </div>

        {catsLoading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {categories.filter(c => c.slug !== 'uncategorized').map(cat => (
              <button
                key={cat.slug}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-3xl sm:text-4xl">{categoryEmoji(cat.slug)}</span>
                <span className="text-center text-xs font-medium text-gray-700 leading-tight">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Recent Listings ───────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recently Added</h2>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {recentLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recent?.items.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ── Sources Strip ─────────────────────────────────────────────────────── */}
      {sourcesData.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <p className="mb-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wide">
            Listings aggregated from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {sourcesData.filter(s => s.is_enabled).map(s => {
              const meta = sourceMeta(s.name)
              return (
                <div
                  key={s.name}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm"
                >
                  <span className="text-lg">{meta.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{s.display_name}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
