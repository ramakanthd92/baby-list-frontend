import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useListings } from '@/hooks/useListings'
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard'
import { FilterSidebar } from '@/components/FilterSidebar'
import { FilterChips } from '@/components/FilterChips'
import { cn, slugToLabel } from '@/lib/utils'

const PAGE_SIZES = [20, 40, 60]

export function SearchPage({ lockedCategory }: { lockedCategory?: string }) {
  const [sp, setSp] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedQ, setDebouncedQ] = useState(sp.get('q') ?? '')

  // Read filters from URL
  const q          = sp.get('q') ?? ''
  const category   = lockedCategory ?? sp.get('category') ?? ''
  const subcategory= sp.get('subcategory') ?? ''
  const priceMin   = sp.get('price_min') ?? ''
  const priceMax   = sp.get('price_max') ?? ''
  const conditions = sp.get('condition')?.split(',').filter(Boolean) ?? []
  const sources    = sp.get('source')?.split(',').filter(Boolean) ?? []
  const locationZip= sp.get('location_zip') ?? ''
  const radiusMiles= sp.get('radius_miles') ?? '25'
  const postedAfter= sp.get('posted_after') ?? ''
  const sort       = sp.get('sort') ?? 'newest'
  const page       = parseInt(sp.get('page') ?? '1', 10)
  const pageSize   = parseInt(sp.get('page_size') ?? '20', 10)

  // Debounce search query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQ(q), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [q])

  const { data, isLoading, isError } = useListings({
    q: debouncedQ || undefined,
    category: category || undefined,
    subcategory: subcategory || undefined,
    price_min: priceMin ? parseFloat(priceMin) : undefined,
    price_max: priceMax ? parseFloat(priceMax) : undefined,
    condition: conditions.length ? conditions.join(',') : undefined,
    source: sources.length ? sources.join(',') : undefined,
    location_zip: locationZip || undefined,
    radius_miles: locationZip ? parseInt(radiusMiles, 10) : undefined,
    posted_after: postedAfter || undefined,
    page,
    page_size: pageSize,
  })

  // Helper to set a single param (resets to page 1)
  function setParam(key: string, value: string) {
    setSp(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.set('page', '1')
      return next
    })
  }

  function toggleArray(key: string, current: string[], value: string) {
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    setParam(key, next.join(','))
  }

  function clearAll() {
    setSp(prev => {
      const next = new URLSearchParams()
      if (lockedCategory) next.set('category', lockedCategory)
      const q = prev.get('q')
      if (q) next.set('q', q)
      return next
    })
  }

  // Build filter chips
  const chips = [
    ...(category && !lockedCategory ? [{ key: 'category', label: slugToLabel(category), onRemove: () => { setParam('category', ''); setParam('subcategory', '') } }] : []),
    ...(subcategory ? [{ key: 'subcategory', label: slugToLabel(subcategory), onRemove: () => setParam('subcategory', '') }] : []),
    ...(priceMin ? [{ key: 'price_min', label: `From $${priceMin}`, onRemove: () => setParam('price_min', '') }] : []),
    ...(priceMax ? [{ key: 'price_max', label: `Up to $${priceMax}`, onRemove: () => setParam('price_max', '') }] : []),
    ...conditions.map(c => ({ key: `cond-${c}`, label: slugToLabel(c), onRemove: () => toggleArray('condition', conditions, c) })),
    ...sources.map(s => ({ key: `src-${s}`, label: slugToLabel(s), onRemove: () => toggleArray('source', sources, s) })),
    ...(locationZip ? [{ key: 'zip', label: `ZIP ${locationZip} • ${radiusMiles}mi`, onRemove: () => { setParam('location_zip', ''); setParam('radius_miles', '') } }] : []),
    ...(postedAfter ? [{ key: 'after', label: `After ${postedAfter}`, onRemove: () => setParam('posted_after', '') }] : []),
  ]

  const meta = data?.meta
  const totalPages = meta?.pages ?? 1

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6">
      {/* ── Sidebar (desktop) ──────────────────────────────────────────────── */}
      <FilterSidebar
        category={category}
        subcategory={subcategory}
        priceMin={priceMin}
        priceMax={priceMax}
        conditions={conditions}
        sources={sources}
        locationZip={locationZip}
        radiusMiles={radiusMiles}
        postedAfter={postedAfter}
        onCategory={v => setParam('category', v)}
        onSubcategory={v => setParam('subcategory', v)}
        onPriceMin={v => setParam('price_min', v)}
        onPriceMax={v => setParam('price_max', v)}
        onToggleCondition={v => toggleArray('condition', conditions, v)}
        onToggleSource={v => toggleArray('source', sources, v)}
        onLocationZip={v => setParam('location_zip', v)}
        onRadiusMiles={v => setParam('radius_miles', v)}
        onPostedAfter={v => setParam('posted_after', v)}
        onClear={clearAll}
        className="hidden w-60 shrink-0 lg:flex"
      />

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(v => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {chips.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                {chips.length}
              </span>
            )}
          </button>

          {/* Result count */}
          {meta && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{meta.total.toLocaleString()}</span> listing{meta.total !== 1 ? 's' : ''}
            </p>
          )}

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setParam('sort', e.target.value)}
            className="ml-auto rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {/* Page size */}
          <select
            value={pageSize}
            onChange={e => setParam('page_size', e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
          >
            {PAGE_SIZES.map(s => (
              <option key={s} value={s}>{s} per page</option>
            ))}
          </select>
        </div>

        {/* Mobile filters drawer */}
        {mobileFiltersOpen && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-gray-900">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <FilterSidebar
              category={category}
              subcategory={subcategory}
              priceMin={priceMin}
              priceMax={priceMax}
              conditions={conditions}
              sources={sources}
              locationZip={locationZip}
              radiusMiles={radiusMiles}
              postedAfter={postedAfter}
              onCategory={v => setParam('category', v)}
              onSubcategory={v => setParam('subcategory', v)}
              onPriceMin={v => setParam('price_min', v)}
              onPriceMax={v => setParam('price_max', v)}
              onToggleCondition={v => toggleArray('condition', conditions, v)}
              onToggleSource={v => toggleArray('source', sources, v)}
              onLocationZip={v => setParam('location_zip', v)}
              onRadiusMiles={v => setParam('radius_miles', v)}
              onPostedAfter={v => setParam('posted_after', v)}
              onClear={clearAll}
            />
          </div>
        )}

        {/* Active filter chips */}
        <FilterChips chips={chips} />

        {/* Results */}
        {isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-gray-600">Failed to load listings. Check your API connection.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className={cn('grid gap-4', 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4')}>
            {Array.from({ length: pageSize }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : !data?.items.length ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-2xl">🔍</p>
            <p className="font-semibold text-gray-800">No listings found</p>
            <p className="text-sm text-gray-500">Try different keywords or adjust your filters.</p>
            {chips.length > 0 && (
              <button
                onClick={clearAll}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className={cn('grid gap-4', 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4')}>
            {data.items.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setParam('page', String(page - 1))}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setParam('page', String(page + 1))}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
