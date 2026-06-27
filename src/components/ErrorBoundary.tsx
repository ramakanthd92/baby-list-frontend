import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-6xl">⚠️</p>
          <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
          <p className="max-w-sm text-sm text-gray-500">
            An unexpected error occurred. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
