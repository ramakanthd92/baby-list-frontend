// ─── Listing Types ────────────────────────────────────────────────────────────

export interface ListingResponse {
  id: string
  source: string
  source_url: string
  title: string
  description: string | null
  price: string | null   // Decimal comes as string from API
  currency: string
  condition: string
  category: string
  subcategory: string | null
  images: string[]
  location_city: string | null
  location_state: string | null
  posted_at: string | null
  scraped_at: string
  is_active: boolean
  dedup_cluster_id: string | null
}

export interface ListingDetailResponse extends ListingResponse {
  seller_name: string | null
  seller_rating: number | null
  location_zip: string | null
  location_lat: number | null
  location_lon: number | null
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PageMeta {
  total: number
  page: number
  page_size: number
  pages: number
}

export interface ListingsPage {
  items: ListingResponse[]
  meta: PageMeta
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface SubcategoryNode {
  slug: string
  label: string
}

export interface CategoryNode {
  slug: string
  label: string
  subcategories: SubcategoryNode[]
}

export interface CategoriesResponse {
  categories: CategoryNode[]
}

// ─── Sources ──────────────────────────────────────────────────────────────────

export interface SourceResponse {
  name: string
  display_name: string
  url: string
  is_enabled: boolean
  last_crawl_at: string | null
  last_crawl_status: string
  last_crawl_listing_count: number
  error_count_24h: number
}

export interface SourcesResponse {
  sources: SourceResponse[]
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ListingQueryParams {
  q?: string
  category?: string
  subcategory?: string
  price_min?: number
  price_max?: number
  condition?: string        // comma-separated
  source?: string           // comma-separated
  location_zip?: string
  radius_miles?: number
  posted_after?: string     // ISO date string
  deduplicated?: boolean
  page?: number
  page_size?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
}

// ─── API Error ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
