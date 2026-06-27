import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { SearchPage } from '@/pages/SearchPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ListingDetailPage } from '@/pages/ListingDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/search"            element={<SearchPage />} />
          <Route path="/category/:slug"    element={<CategoryPage />} />
          <Route path="/listing/:id"       element={<ListingDetailPage />} />
          <Route path="*"                  element={<NotFoundPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}
