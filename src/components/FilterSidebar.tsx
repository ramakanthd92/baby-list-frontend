import { useCategories } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'

const SOURCES = ['craigslist', 'ebay', 'facebook', 'etsy', 'offerup', 'mercari']
const SOURCE_LABELS: Record<string, string> = {
  craigslist: 'Craigslist', ebay: 'eBay', facebook: 'Facebook',
  etsy: 'Etsy', offerup: 'OfferUp', mercari: 'Mercari',
}
const CONDITIONS = ['new', 'excellent', 'good', 'used', 'fair', 'poor']

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

  return (
    <aside className={cn('flex flex-col gap-6', props.className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={props.onClear}
          className="text-xs text-indigo-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <select
          value={props.category}
          onChange={e => { props.onCategory(e.target.value); props.onSubcategory('') }}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
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
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
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
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
            <input
              type="number"
              min={0}
              value={props.priceMin}
              onChange={e => props.onPriceMin(e.target.value)}
              placeholder="Min"
              className="w-full rounded-lg border border-gray-200 py-2 pl-6 pr-2 text-sm focus:border-indigo-400 focus:outline-none"
            />
          </div>
          <span className="text-gray-400">–</span>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
            <input
              type="number"
              min={0}
              value={props.priceMax}
              onChange={e => props.onPriceMax(e.target.value)}
              placeholder="Max"
              className="w-full rounded-lg border border-gray-200 py-2 pl-6 pr-2 text-sm focus:border-indigo-400 focus:outline-none"
            />
          </div>
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        <div className="flex flex-col gap-1.5">
          {CONDITIONS.map(cond => (
            <label key={cond} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.conditions.includes(cond)}
                onChange={() => props.onToggleCondition(cond)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="capitalize text-gray-700">{cond}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Source */}
      <FilterSection title="Platform">
        <div className="flex flex-col gap-1.5">
          {SOURCES.map(src => (
            <label key={src} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={props.sources.includes(src)}
                onChange={() => props.onToggleSource(src)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-700">{SOURCE_LABELS[src] ?? src}</span>
            </label>
          ))}
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
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
        {props.locationZip && (
          <select
            value={props.radiusMiles}
            onChange={e => props.onRadiusMiles(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
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
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
      </FilterSection>
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      {children}
    </div>
  )
}
