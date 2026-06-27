import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { SearchPage } from './SearchPage'
import { categoryEmoji } from '@/lib/utils'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: categories = [] } = useCategories()

  const category = categories.find(c => c.slug === slug)

  if (!slug) {
    navigate('/404')
    return null
  }

  return (
    <div>
      {/* Category hero */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{category?.label ?? slug}</span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-4xl">{categoryEmoji(slug)}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {category?.label ?? slug}
              </h1>
              <p className="text-sm text-gray-500">
                Browse second-hand {category?.label.toLowerCase() ?? slug} listings
              </p>
            </div>
          </div>

          {/* Subcategory chips */}
          {category && category.subcategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {category.subcategories.map(sub => (
                <Link
                  key={sub.slug}
                  to={`/search?category=${slug}&subcategory=${sub.slug}`}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition"
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Listings — reuse SearchPage with locked category */}
      <SearchPage lockedCategory={slug} />
    </div>
  )
}
