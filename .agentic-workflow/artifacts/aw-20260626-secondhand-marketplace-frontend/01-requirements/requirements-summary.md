# Requirements Summary — Second-Hand Marketplace Frontend

**Session:** aw-20260626-secondhand-marketplace-frontend  
**Date:** 2026-06-26  
**Project:** CraiglistScraper / baby-items  

---

## 1. Project Context

The backend is a fully operational FastAPI service (`/Users/r0p0aib/baby-items`) that aggregates second-hand listings from 6+ scrapers (Craigslist, eBay, Etsy, Facebook, Mercari, OfferUp). It exposes a **read-only REST API** with Redis caching, PostgreSQL storage, and full-text search via `search_vector`.

The frontend will be a **standalone React SPA** that consumes this API.

---

## 2. API Endpoints Available

| Method | Path | Description |
|--------|------|-------------|
| GET | `/listings` | Paginated listing search with filters |
| GET | `/listings/{id}` | Full listing detail |
| GET | `/categories` | Category + subcategory tree |
| GET | `/sources` | Available source platforms |
| GET | `/health` | Health check |

### Listing Schema (summary card)
```
id, source, source_url, title, description, price, currency,
condition, category, subcategory, images[], location_city,
location_state, posted_at, scraped_at, is_active, dedup_cluster_id
```

### Listing Schema (detail page, adds)
```
seller_name, seller_rating, location_zip, location_lat, location_lon
```

### Query Filters (`GET /listings`)
- `q` — full-text search (max 200 chars)
- `category`, `subcategory`
- `price_min`, `price_max`
- `condition` — comma-separated (new, used, fair, good, etc.)
- `source` — comma-separated (craigslist, ebay, facebook, etsy, offerup, mercari)
- `location_zip` + `radius_miles` (1–500)
- `posted_after` — date filter
- `deduplicated` — boolean (default: true)
- `page` + `page_size`

---

## 3. Functional Requirements

### FR-01: Homepage
- Hero section with search bar (prominent, centered)
- Category grid: Baby Items, Cars, Phones, Bikes, Bags, Clothes, Electronics, Jewellery, Household, Workstation
- Recent listings horizontal scroll (latest 20, no filter)
- Featured/trending listings section
- Source logos strip (Craigslist, eBay, Facebook, etc.)

### FR-02: Search & Filtering
- Full-text search via `q` parameter
- Sidebar/drawer filters: Category, Subcategory, Price Range (slider + inputs), Condition (checkboxes), Source (checkboxes), Location ZIP + radius, Posted After (date picker)
- Filter chips showing active filters, each removable
- Sort: Newest, Price low→high, Price high→low
- Pagination (page-based) with `page_size` selector (20/40/60)
- Mobile: filters in a bottom sheet / modal drawer

### FR-03: Listing Card (grid/list view)
- Thumbnail image (fallback placeholder if images=[])
- Title (truncated to 2 lines)
- Price with currency symbol
- Condition badge
- Source badge (platform logo + name)
- Location city + state
- Time ago (relative, from `posted_at` or `scraped_at`)
- "Also listed on N sites" indicator when `dedup_cluster_id` is set

### FR-04: Listing Detail Page
- Image gallery (carousel/lightbox, supports multiple images)
- Full title + description (rendered with line breaks)
- Price + currency
- Condition badge + category breadcrumb
- Source badge with external link (`source_url`)
- Seller info: name, star rating (if available)
- Location: city/state/zip + Leaflet.js map pin (lat/lon if available)
- "Also available on other platforms" section when dedup_cluster_id matches
- Posted date + scraped date
- Back navigation

### FR-05: Category Browse Page
- Grid of subcategory cards within a category
- Pre-filtered listing grid for that category
- Category hero/banner image

### FR-06: Navigation
- Sticky top navbar: Logo, Search bar, Category dropdown
- Breadcrumbs on detail page
- Mobile: hamburger menu / bottom tab bar

### FR-07: Deduplication Awareness
- When `dedup_cluster_id` is non-null, show "See N more listings for this item"
- On detail page, fetch other listings in same cluster and show as "Also listed on..."

---

## 4. Non-Functional Requirements

| NFR | Requirement |
|-----|-------------|
| Performance | LCP < 2.5s; paginated API responses cached |
| Responsive | Mobile-first; breakpoints: 375px, 768px, 1024px, 1280px |
| Accessibility | WCAG 2.1 AA — keyboard nav, ARIA labels, contrast ratios |
| SEO | SSR or pre-rendered HTML for listing pages (or meta tags minimum) |
| Images | Lazy load; `loading="lazy"`; fallback placeholder |
| No auth | Read-only public frontend; no user accounts in MVP |
| API base URL | Configurable via `VITE_API_BASE_URL` env variable |

---

## 5. Tech Stack Decision

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18 + TypeScript | Type safety, ecosystem |
| Build | Vite | Fast dev server, ESM |
| Styling | Tailwind CSS v3 | Utility-first, responsive |
| UI Components | shadcn/ui (Radix UI) | Accessible, unstyled primitives |
| State / Data | TanStack Query v5 | Server state, caching, pagination |
| Routing | React Router v6 | SPA routing |
| Maps | Leaflet.js + react-leaflet | Lightweight OSM maps |
| Icons | Lucide React | Clean, consistent |
| HTTP | Fetch API (via TanStack Query) | Native, no extra dep |

---

## 6. Pages / Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Hero + categories + recent listings |
| `/search` | `SearchPage` | Full search + filters |
| `/category/:slug` | `CategoryPage` | Category browse + filtered listings |
| `/listing/:id` | `ListingDetailPage` | Full listing detail |
| `*` | `NotFoundPage` | 404 |

---

## 7. Categories & Subcategory Map

| Category Slug | Display Name | Sample Subcategories |
|--------------|--------------|----------------------|
| `baby-items` | Baby Items | strollers, car_seats, clothing, toys, safety_gates |
| `cars` | Used Cars | sedan, suv, truck, van |
| `phones` | Phones & Tablets | iphone, android, tablets |
| `bikes` | Bikes | road, mountain, electric, bmx |
| `bags` | Bags & Luggage | backpacks, handbags, luggage |
| `clothes` | Clothing | men, women, kids |
| `electronics` | Electronics | laptops, cameras, audio |
| `jewellery` | Jewellery | rings, necklaces, watches |
| `household` | Household Items | furniture, kitchen, decor |
| `workstation` | Workstation | monitors, keyboards, chairs |

---

## 8. Source Platforms

| Source Key | Display Name |
|-----------|--------------|
| `craigslist` | Craigslist |
| `ebay` | eBay |
| `facebook` | Facebook Marketplace |
| `etsy` | Etsy |
| `offerup` | OfferUp |
| `mercari` | Mercari |

---

## 9. Acceptance Criteria

- [ ] Homepage renders category grid + recent listings from live API
- [ ] Search with at least 3 simultaneous filters returns correct results
- [ ] Listing detail page renders map when lat/lon is present
- [ ] Dedup indicator shows on cards and detail pages when applicable
- [ ] All pages render correctly on 375px mobile viewport
- [ ] No console errors on page load
- [ ] `VITE_API_BASE_URL` controls API target
- [ ] External source link opens in new tab with `rel="noopener noreferrer"`
- [ ] Images fail gracefully to placeholder

---

## 10. Out of Scope (MVP)

- User accounts / authentication
- Favorites / saved searches
- Chat / messaging with sellers
- Payment processing
- Admin dashboard
- PWA / offline mode
- i18n / multi-language
