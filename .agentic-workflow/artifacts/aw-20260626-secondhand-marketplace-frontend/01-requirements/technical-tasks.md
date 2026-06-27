# Technical Tasks — Second-Hand Marketplace Frontend

**Total tasks:** 12  
**Total estimated hours:** 31h  
**Change type:** NEW_PATTERN (no existing frontend codebase)  
**Target location:** `/Users/r0p0aib/baby-items/frontend/`

---

## TASK-001 · Project Scaffold
**Change Type:** NEW_PATTERN  
**Justification:** First frontend file — bootstrapping from scratch  
**Estimate:** 2h  
**Dependencies:** none

### What to do
- `npm create vite@latest frontend -- --template react-ts` inside `baby-items/`
- Install: `tailwindcss`, `@tailwindcss/vite`, `react-router-dom`, `@tanstack/react-query`, `lucide-react`
- Configure Tailwind (`tailwind.config.ts`, `src/index.css`)
- Add `shadcn/ui` init (`npx shadcn@latest init`)
- Set up `VITE_API_BASE_URL` in `.env.example`
- Configure path aliases: `@/` → `src/`
- Add `frontend/` to Docker/docker-compose for local dev proxy

### Acceptance Criteria
- [ ] `npm run dev` starts on port 5173 with no errors
- [ ] Tailwind classes render correctly
- [ ] shadcn Button component renders
- [ ] `import.meta.env.VITE_API_BASE_URL` resolves

---

## TASK-002 · API Client + Types
**Change Type:** NEW_PATTERN  
**Estimate:** 3h  
**Dependencies:** TASK-001  
**Files:** `src/lib/api.ts`, `src/types/index.ts`

### What to do
- Define TypeScript types matching backend schemas exactly:
  ```ts
  // src/types/index.ts
  interface ListingResponse { id, source, source_url, title, description, price, currency, condition, category, subcategory, images, location_city, location_state, posted_at, scraped_at, is_active, dedup_cluster_id }
  interface ListingDetailResponse extends ListingResponse { seller_name, seller_rating, location_zip, location_lat, location_lon }
  interface PageMeta { total, page, page_size, pages }
  interface ListingsPage { items: ListingResponse[], meta: PageMeta }
  interface CategoryNode { slug, label, subcategories: SubcategoryNode[] }
  interface SourceResponse { name, display_name, url, is_enabled, last_crawl_at, last_crawl_status }
  ```
- Create `src/lib/api.ts` with typed fetch functions:
  - `fetchListings(params: ListingQueryParams): Promise<ListingsPage>`
  - `fetchListing(id: string): Promise<ListingDetailResponse>`
  - `fetchCategories(): Promise<CategoryNode[]>`
  - `fetchSources(): Promise<SourceResponse[]>`
- Set up TanStack Query `QueryClient` in `src/main.tsx`

### Acceptance Criteria
- [ ] All API calls use `VITE_API_BASE_URL` as base
- [ ] TypeScript compiles with no errors
- [ ] 404/500 errors throw typed `ApiError`

---

## TASK-003 · Core UI Components
**Change Type:** NEW_PATTERN  
**Estimate:** 2h  
**Dependencies:** TASK-001  
**Files:** `src/components/ui/` (shadcn), `src/components/SourceBadge.tsx`, `src/components/ConditionBadge.tsx`, `src/components/PriceTag.tsx`, `src/components/RelativeTime.tsx`

### What to do
- Install shadcn components: `badge`, `button`, `card`, `input`, `skeleton`, `separator`, `dialog`, `sheet`, `select`, `slider`, `checkbox`
- **SourceBadge:** platform logo (emoji or SVG) + name from `source` field. Sources: craigslist, ebay, facebook, etsy, offerup, mercari
- **ConditionBadge:** colored badge for `new` (green), `used` (blue), `fair` (amber), etc.
- **PriceTag:** `$15.00` formatted from `price + currency`
- **RelativeTime:** "2 days ago" from `posted_at` or `scraped_at`
- **ListingImageThumbnail:** `<img loading="lazy">` with fallback placeholder SVG

### Acceptance Criteria
- [ ] All badges render with correct colors
- [ ] PriceTag handles `null` price gracefully ("Price not listed")
- [ ] RelativeTime shows "Just now" for < 1 min, "X days ago" for older
- [ ] Image shows placeholder when `images` array is empty or URL 404s

---

## TASK-004 · ListingCard Component
**Change Type:** NEW_PATTERN  
**Estimate:** 2h  
**Dependencies:** TASK-003  
**Files:** `src/components/ListingCard.tsx`

### What to do
- Thumbnail (first image or placeholder)
- Title (2-line clamp with `line-clamp-2`)
- PriceTag + ConditionBadge inline
- SourceBadge (small, bottom-left)
- Location (`location_city, location_state`)
- RelativeTime (bottom-right)
- Dedup indicator: "Also on N other sites" when `dedup_cluster_id` is non-null (subtle tag)
- Entire card links to `/listing/:id`
- Hover: subtle shadow + scale transform

### Acceptance Criteria
- [ ] Card renders all fields from `ListingResponse`
- [ ] Clicking card navigates to detail page
- [ ] Dedup tag only appears when `dedup_cluster_id` is non-null
- [ ] Graceful fallback for all null/empty fields

---

## TASK-005 · Navigation Component
**Change Type:** NEW_PATTERN  
**Estimate:** 2h  
**Dependencies:** TASK-001  
**Files:** `src/components/Navbar.tsx`, `src/components/MobileMenu.tsx`

### What to do
- Sticky top navbar: Logo (left) + search input (center, wide) + category dropdown (right)
- Search input triggers navigation to `/search?q=...`
- Category dropdown links to `/category/:slug` for each category
- Mobile (< 768px): hamburger → slide-in side drawer with same links
- Active route highlight

### Acceptance Criteria
- [ ] Navbar sticks to top on scroll
- [ ] Search submission navigates to `/search?q=<input>`
- [ ] Mobile drawer opens/closes correctly
- [ ] Active category link is highlighted

---

## TASK-006 · HomePage
**Change Type:** NEW_PATTERN  
**Estimate:** 3h  
**Dependencies:** TASK-002, TASK-003, TASK-004, TASK-005  
**Files:** `src/pages/HomePage.tsx`, `src/hooks/useListings.ts`, `src/hooks/useCategories.ts`

### What to do
- **Hero section:** Full-width gradient banner, centered search bar, subtitle text
- **Category grid:** 3×3 or 4×3 grid of category cards from `GET /categories`. Each card: icon (emoji mapped per slug) + label + count (optional). Links to `/category/:slug`
- **Recent listings:** Horizontal scroll of 20 latest listings (`GET /listings?page_size=20&page=1`)
- **Source strip:** Platform logos row ("Find listings from...")
- TanStack Query hooks for data fetching with loading skeletons

### Acceptance Criteria
- [ ] Category grid renders all categories from API (or static fallback if API down)
- [ ] Recent listings scroll horizontally on mobile
- [ ] Loading state shows skeleton cards
- [ ] Hero search bar works (submits to `/search?q=...`)

---

## TASK-007 · SearchPage + Filter System
**Change Type:** NEW_PATTERN  
**Estimate:** 4h  
**Dependencies:** TASK-002, TASK-004  
**Files:** `src/pages/SearchPage.tsx`, `src/components/FilterSidebar.tsx`, `src/components/FilterChips.tsx`, `src/hooks/useListings.ts`

### What to do
- **URL-synced state:** all filters live in URL search params (`useSearchParams`)
- **Filter sidebar (desktop):** Category select, Subcategory select, Price range slider (dual thumb), Condition checkboxes, Source checkboxes, ZIP input + radius select, Posted after date picker
- **Mobile:** Filters in a `Sheet` (bottom drawer), triggered by "Filters" button
- **Active filter chips:** row of removable chips above results showing active filters
- **Results grid:** 2-col mobile, 3-col tablet, 4-col desktop
- **Sort select:** Newest / Price ↑ / Price ↓
- **Pagination:** page selector at bottom, `page_size` selector
- Debounce text search (300ms)

### Acceptance Criteria
- [ ] All filters map to correct API query params
- [ ] Changing any filter resets to page 1
- [ ] Filter chips show human-readable labels (not raw slugs)
- [ ] URL is shareable (reload preserves filters)
- [ ] Empty state shows "No listings found" with clear-filters CTA

---

## TASK-008 · CategoryPage
**Change Type:** NEW_PATTERN  
**Estimate:** 2h  
**Dependencies:** TASK-007  
**Files:** `src/pages/CategoryPage.tsx`

### What to do
- Route: `/category/:slug`
- Category hero banner (emoji icon + category label)
- Subcategory chip row (links to SearchPage with `category=X&subcategory=Y`)
- Pre-filtered SearchPage results embedded (reuses SearchPage internals with `category` locked)
- Breadcrumb: Home > Category Name

### Acceptance Criteria
- [ ] Navigating to `/category/safety` shows only safety listings
- [ ] Subcategory chips filter correctly
- [ ] Unknown slug shows 404 page

---

## TASK-009 · ListingDetailPage
**Change Type:** NEW_PATTERN  
**Estimate:** 4h  
**Dependencies:** TASK-002, TASK-003, TASK-010, TASK-011  
**Files:** `src/pages/ListingDetailPage.tsx`

### What to do
- Route: `/listing/:id`
- **Image gallery** (TASK-011) at top
- Title (h1) + PriceTag + ConditionBadge + SourceBadge
- Description (pre-wrap, full text)
- Category breadcrumb: Home > Category > Subcategory
- **Seller section:** name + star rating (if available)
- **Location section:** city/state/zip + **Leaflet map** (TASK-010) if lat/lon present
- External link: "View on [Source]" button → opens `source_url` in new tab
- **Dedup section:** when `dedup_cluster_id` non-null, fetch similar listings and show "Also listed on [source] for $X"
- Back button / breadcrumb navigation
- Loading skeleton matching layout

### Acceptance Criteria
- [ ] Page renders all `ListingDetailResponse` fields
- [ ] Map renders when lat/lon available; hidden otherwise
- [ ] External link opens in new tab with `rel="noopener noreferrer"`
- [ ] Dedup section only appears when `dedup_cluster_id` is non-null

---

## TASK-010 · Leaflet Map Component
**Change Type:** NEW_PATTERN  
**Estimate:** 2h  
**Dependencies:** TASK-001  
**Files:** `src/components/ListingMap.tsx`  
**Packages:** `leaflet`, `react-leaflet`

### What to do
- Install: `npm i leaflet react-leaflet`
- `ListingMap` props: `lat: number, lon: number, title: string`
- Centered on listing lat/lon with zoom 13
- Custom marker with listing title popup
- Lazy-import (dynamic import) to avoid SSR issues
- Fix leaflet icon path issue (standard workaround via `delete L.Icon.Default.prototype._getIconUrl`)
- Fallback: renders nothing if lat/lon null/undefined

### Acceptance Criteria
- [ ] Map renders OpenStreetMap tiles at correct location
- [ ] Marker shows listing title on click
- [ ] No console errors about missing icon URLs
- [ ] Component renders `null` without crashing when coords absent

---

## TASK-011 · Image Gallery Component
**Change Type:** NEW_PATTERN  
**Estimate:** 2h  
**Dependencies:** TASK-001  
**Files:** `src/components/ImageGallery.tsx`

### What to do
- Props: `images: string[]`
- Main large image (selected) + thumbnail strip
- Left/right arrow navigation
- Click main image → opens fullscreen dialog (shadcn `Dialog`)
- Keyboard: left/right arrows navigate in lightbox
- Fallback: single placeholder card if `images` is empty
- Lazy loading on all images

### Acceptance Criteria
- [ ] Clicking thumbnails changes main image
- [ ] Lightbox opens on click, closes on Esc or click-outside
- [ ] Keyboard arrow navigation works in lightbox
- [ ] Empty `images` array shows placeholder, no crash

---

## TASK-012 · 404 Page + Error Boundaries
**Change Type:** NEW_PATTERN  
**Estimate:** 1h  
**Dependencies:** TASK-001  
**Files:** `src/pages/NotFoundPage.tsx`, `src/components/ErrorBoundary.tsx`

### What to do
- `NotFoundPage`: friendly "Page not found" with link back to Home
- `ErrorBoundary`: React class component wrapping main routes, shows error card on uncaught errors
- API error states: inline "Failed to load listings. Try again." with retry button

### Acceptance Criteria
- [ ] `/unknown-route` renders NotFoundPage (not blank)
- [ ] API fetch error shows retry UI, not blank page
- [ ] ErrorBoundary catches render errors and shows fallback

---

## Dependency Graph

```
TASK-001 (Scaffold)
  └── TASK-002 (API + Types)
  └── TASK-003 (Core UI Components)
        └── TASK-004 (ListingCard)
  └── TASK-005 (Navbar)
  └── TASK-010 (Map)
  └── TASK-011 (Image Gallery)
  └── TASK-012 (404 + Errors)

TASK-002 + TASK-004 + TASK-005 → TASK-006 (HomePage)
TASK-002 + TASK-004 → TASK-007 (SearchPage)
TASK-007 → TASK-008 (CategoryPage)
TASK-002 + TASK-003 + TASK-010 + TASK-011 → TASK-009 (DetailPage)
```
