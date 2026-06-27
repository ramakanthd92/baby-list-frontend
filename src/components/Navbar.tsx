import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, ChevronDown, ShoppingBag } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { cn, categoryEmoji } from '@/lib/utils'

export function Navbar() {
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: categories = [] } = useCategories()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="hidden font-bold text-gray-900 sm:block text-lg">Remarket</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-1 items-center">
            <div className="relative w-full max-w-2xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search listings…"
                className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </form>

          {/* Category dropdown (desktop) */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setCatOpen(v => !v)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Categories
              <ChevronDown className={cn('h-4 w-4 transition-transform', catOpen && 'rotate-180')} />
            </button>

            {catOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <div className="grid grid-cols-2 gap-1">
                  {categories.map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <span>{categoryEmoji(cat.slug)}</span>
                      <span className="truncate">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-30 border-b border-gray-200 bg-white px-4 pb-4 shadow-lg sm:hidden">
          <p className="pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Categories
          </p>
          <div className="grid grid-cols-2 gap-1">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>{categoryEmoji(cat.slug)}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
