import { useCategories } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'

const SOURCES = ['craigslist', 'ebay', 'facebook', 'etsy', 'offerup', 'mercari']
const SOURCE_LABELS: Record<string, string> = {
  craigslist: 'Craigslist', ebay: 'eBay', facebook: 'Facebook',
  etsy: 'Etsy', offerup: 'OfferUp', mercari: 'Mercari',
}
const SOURCE_EMOJI: Record<string, string> = {
  craigslist: '📋', ebay: '🛒', facebook: '👥', etsy: '🎨', offerup: '🏷️', mercari: '🛍️',
}
const CONDITIONS = ['new', 'excellent', 'good', 'used', 'fair', 'poor']
const CONDITION_COLORS: Record<string, string> = {
  new:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  excellent: 'bg-teal-50 text-teal-700 border-teal-200',
  good:      'bg-sky-50 text-sky-700 border-sky-200',
  used:      'bg-blue-50 text-blue-700 border-blue-200',
  fair:      'bg-amber-50 text-amber-700 border-amber-200',
  poor:      'bg-red-50 text-red-700 border-red-200',
}
const CONDITION_COLORS_ACTIVE: Record<string, string> = {
  new:       'bg-emerald-500 text-white border-emerald-500',
  excellent: 'bg-teal-500 text-white border-teal-500',
  good:      'bg-sky-500 text-white border-sky-500',
  used:      'bg-blue-500 text-white border-blue-500',
  fair:      'bg-amber-500 text-white border-amber-500',
  poor:      'bg-red-500 text-white border-red-500',
}

interface FilterSidebarProps {
  category: string
  subcategory: string
  priceMin: string
  priceMax: string
  conditions: string[]
  sources: string[]
  locationZip: string
  radiusMiles: string
  postedAfter: string
  onCategory: (v: string) => void
  onSubcategory: (v: string) => void
  onPriceMin: (v: string) => void
  onPriceMax: (v: string) => void
  onToggleCondition: (v: string) => void
  onToggleSource: (v: string) => void
  onLocationZip: (v: string) => void
  onRadiusMiles: (v: string) => void
  onPostedAfter: (v: string) => void
  onClear: () => void
  className?: string
}

export function FilterSidebar(props: FilterSidebarProps) {
  const { data: categories = [] } = useCategories()
  const selectedCat = categories.find(c => c.slug === props.category)

  const hasActiveFilters = !!(
    props.category || props.priceMin || props.priceMax ||
    props.conditions.length || props.sources.length ||
    props.locationZip || props.postedAfter
  )

  return (
    <aside className={cn('flex flex-col gap-5', props.className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-base">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={props.onClear}
            className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <select
          value={props.category}
          onChange={e => { props.onCategory(e.target.value); props.onSubcategory('') }}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        >
          <option value="">All Categories</option>
          {categories.filter(c => c.slug !== 'uncategorized').map(c => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
      </FilterSection>

      {/* Subcategory */}
      {selectedCat && selectedCat.subcategories.length > 0 && (
        <FilterSection title="Subcategory">
          <select
            value={props.subcategory}
            onChange={e => props.onSubcategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          >
            <option value="">All</option>
            {selectedCat.subcategories.map(s => (
              <option key={s.slug} value={s.slug}>{s.label}</option>
            ))}
          </select>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">$</span>
            <input
              type="number"
              min={0}
              value={props.priceMin}
              onChange={e => props.onPriceMin(e.target.value)}
              placeholder="Min"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-7 pr-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div className="w-3 h-px bg-gray-300 shrink-0" />
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">$</span>
            <input
              type="number"
              min={0}
              value={props.priceMax}
              onChange={e => props.onPriceMax(e.target.value)}
              placeholder="Max"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-7 pr-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>
      </FilterSection>

      {/* Condition — pill toggles */}
      <FilterSection title="Condition">
        <div className="flex flex-wrap gap-1.5">
          {CONDITIONS.map(cond => {
            const active = props.conditions.includes(cond)
            return (
              <button
                key={cond}
                onClick={() => props.onToggleCondition(cond)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-all',
                  active
                    ? CONDITION_COLORS_ACTIVE[cond] ?? 'bg-indigo-500 text-white border-indigo-500'
                    : CONDITION_COLORS[cond] ?? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                )}
              >
                {cond}
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* Source — pill toggles */}
      <FilterSection title="Platform">
        <div className="flex flex-col gap-1.5">
          {SOURCES.map(src => {
            const active = props.sources.includes(src)
            return (
              <button
                key={src}
                onClick={() => props.onToggleSource(src)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all text-left',
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                )}
              >
                <span className="text-base">{SOURCE_EMOJI[src]}</span>
                {SOURCE_LABELS[src] ?? src}
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <input
          type="text"
          value={props.locationZip}
          onChange={e => props.onLocationZip(e.target.value)}
          placeholder="ZIP code"
          maxLength={5}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        />
        {props.locationZip && (
          <select
            value={props.radiusMiles}
            onChange={e => props.onRadiusMiles(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          >
            <option value="10">Within 10 miles</option>
            <option value="25">Within 25 miles</option>
            <option value="50">Within 50 miles</option>
            <option value="100">Within 100 miles</option>
          </select>
        )}
      </FilterSection>

      {/* Posted After */}
      <FilterSection title="Posted After">
        <input
          type="date"
          value={props.postedAfter}
          onChange={e => props.onPostedAfter(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
        />
      </FilterSection>
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
      {children}
    </div>
  )
}
