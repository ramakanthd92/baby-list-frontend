import type {
  CategoriesResponse,
  CategoryNode,
  ListingDetailResponse,
  ListingQueryParams,
  ListingsPage,
  SourcesResponse,
} from '@/types'
import { ApiError } from '@/types'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

async function request<T>(path: string, params?: Record<string, string>): Promise<T> {
  // new URL() requires an absolute URL — use window.location.origin as base when
  // VITE_API_BASE_URL is empty (nginx same-origin proxy mode)
  const url = BASE_URL
    ? new URL(`${BASE_URL}${path}`)
    : new URL(path, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, v)
      }
    })
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as { detail?: string }
      if (body.detail) message = body.detail
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, message)
  }

  return res.json() as Promise<T>
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export async function fetchListings(params: ListingQueryParams = {}): Promise<ListingsPage> {
  const p: Record<string, string> = {}
  if (params.q)             p.q = params.q
  if (params.category)      p.category = params.category
  if (params.subcategory)   p.subcategory = params.subcategory
  if (params.price_min != null) p.price_min = String(params.price_min)
  if (params.price_max != null) p.price_max = String(params.price_max)
  if (params.condition)     p.condition = params.condition
  if (params.source)        p.source = params.source
  if (params.location_zip)  p.location_zip = params.location_zip
  if (params.radius_miles != null) p.radius_miles = String(params.radius_miles)
  if (params.posted_after)  p.posted_after = params.posted_after
  if (params.deduplicated != null) p.deduplicated = String(params.deduplicated)
  p.page = String(params.page ?? 1)
  p.page_size = String(params.page_size ?? 20)

  return request<ListingsPage>('/listings', p)
}

export async function fetchListing(id: string): Promise<ListingDetailResponse> {
  return request<ListingDetailResponse>(`/listings/${id}`)
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<CategoryNode[]> {
  const res = await request<CategoriesResponse>('/categories')
  return res.categories
}

// ─── Sources ──────────────────────────────────────────────────────────────────

export async function fetchSources(): Promise<SourcesResponse['sources']> {
  const res = await request<SourcesResponse>('/sources')
  return res.sources
}
