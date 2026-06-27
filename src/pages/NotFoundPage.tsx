import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="text-7xl">🔍</p>
      <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
      <p className="max-w-md text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}
