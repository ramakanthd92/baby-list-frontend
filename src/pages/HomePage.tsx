import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Zap, Shield, RefreshCw, TrendingUp } from 'lucide-react'
import { useListings } from '@/hooks/useListings'
import { useCategories, useSources } from '@/hooks/useCategories'
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard'
import { categoryEmoji, categoryGradient, sourceMeta } from '@/lib/utils'

const POPULAR_SEARCHES = ['baby stroller', 'iPhone 14', 'road bike', 'standing desk', 'LEGO']

export function HomePage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const { data: categories = [], isLoading: catsLoading } = useCategories()
  const { data: sourcesData = [] } = useSources()
  const { data: recent, isLoading: recentLoading } = useListings({ page_size: 8, page: 1 })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    else navigate('/search')
  }

  return (
    <main className="flex flex-col gap-0 pb-16">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-4 py-16 sm:py-24 text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-indigo-100 backdrop-blur-sm border border-white/20">
            <Zap className="h-3.5 w-3.5 text-yellow-300" />
            Aggregated from 6+ platforms in real-time
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
            Find amazing deals on<br />
            <span className="text-yellow-300">second-hand items</span>
          </h1>
          <p className="mb-8 text-lg text-indigo-200 sm:text-xl">
            Search Craigslist, eBay, Facebook Marketplace, OfferUp and more — all in one place.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex overflow-hidden rounded-2xl bg-white shadow-2xl shadow-indigo-900/30 ring-4 ring-white/20">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for anything…"
                className="h-14 w-full pl-12 pr-4 text-gray-900 text-base outline-none bg-transparent rounded-l-2xl"
              />
            </div>
            <button
              type="submit"
              className="m-1.5 rounded-xl px-6 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors text-sm sm:text-base"
            >
              Search
            </button>
          </form>

          {/* Popular searches */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-indigo-300">Try:</span>
            {POPULAR_SEARCHES.map(term => (
              <button
                key={term}
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-indigo-100 hover:bg-white/20 transition-colors border border-white/10"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {[
              { icon: TrendingUp, label: 'Live listings', value: '50K+' },
              { icon: RefreshCw, label: 'Updated', value: 'Hourly' },
              { icon: Shield, label: 'Platforms', value: '6+' },
              { icon: Zap, label: 'Categories', value: '15+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
                  <Icon className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-none">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-1 text-sm text-gray-500">Find exactly what you're looking for</p>
          </div>
        </div>

        {catsLoading ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {categories.filter(c => c.slug !== 'uncategorized').map(cat => (
              <button
                key={cat.slug}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${categoryGradient(cat.slug)} p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] aspect-square`}
              >
                <span className="text-3xl sm:text-4xl drop-shadow">{categoryEmoji(cat.slug)}</span>
                <span className="text-center text-xs font-semibold text-white leading-tight drop-shadow">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Recent Listings ───────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
            <p className="mt-1 text-sm text-gray-500">Fresh deals just posted</p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
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
        ) : !recent?.items.length ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-semibold text-gray-700">No listings yet</p>
            <p className="text-sm text-gray-500 mt-1">Check back soon — new items are added regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recent.items.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ── Sources Strip ─────────────────────────────────────────────────────── */}
      {sourcesData.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-10">
          <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-6 sm:p-8">
            <p className="mb-5 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Listing sources
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {sourcesData.filter(s => s.is_enabled).map(s => {
                const meta = sourceMeta(s.name)
                return (
                  <div
                    key={s.name}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="text-sm font-semibold text-gray-800">{s.display_name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
