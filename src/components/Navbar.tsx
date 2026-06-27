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

  const isHome = location.pathname === '/'

  return (
    <>
      <header className={cn(
        'sticky top-0 z-40 w-full border-b transition-colors',
        isHome
          ? 'border-white/20 bg-indigo-700/95 backdrop-blur-md'
          : 'border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 shadow-sm'
      )}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl shadow-sm',
              isHome ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
            )}>
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
            <span className={cn(
              'hidden font-extrabold sm:block text-lg tracking-tight',
              isHome ? 'text-white' : 'text-gray-900'
            )}>
              Remarket
            </span>
          </Link>

          {/* Search bar — hidden on home (hero has its own) */}
          {!isHome && (
            <form onSubmit={handleSearch} className="flex flex-1 items-center">
              <div className="relative w-full max-w-2xl">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search listings…"
                  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </form>
          )}

          {/* Spacer on home */}
          {isHome && <div className="flex-1" />}

          {/* Category dropdown (desktop) */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setCatOpen(v => !v)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                isHome
                  ? 'text-white/90 hover:bg-white/15'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              Categories
              <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', catOpen && 'rotate-180')} />
            </button>

            {catOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  All Categories
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {categories.filter(c => c.slug !== 'uncategorized').map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      <span className="text-base">{categoryEmoji(cat.slug)}</span>
                      <span className="truncate font-medium">{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              'sm:hidden rounded-xl p-2 transition-colors',
              isHome ? 'text-white hover:bg-white/15' : 'text-gray-700 hover:bg-gray-100'
            )}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-30 border-b border-gray-200 bg-white px-4 pb-5 shadow-xl sm:hidden">
          {!isHome && (
            <form onSubmit={handleSearch} className="pt-3 pb-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search listings…"
                  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </form>
          )}
          <p className="pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Categories
          </p>
          <div className="grid grid-cols-2 gap-1">
            {categories.filter(c => c.slug !== 'uncategorized').map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <span className="text-base">{categoryEmoji(cat.slug)}</span>
                <span className="font-medium">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
