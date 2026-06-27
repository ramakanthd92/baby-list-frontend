# Pattern Analysis — Second-Hand Marketplace Frontend

## Codebase Scan Results

**Searched:** `/Users/r0p0aib/baby-items` for `*.tsx`, `*.jsx`, `*.ts`, `package.json`  
**Result:** 0 frontend files found — **no existing frontend codebase**

---

## Existing Backend Patterns (for API contract alignment)

### API Response Shapes
- `GET /listings` → `ListingsPage { items: ListingResponse[], meta: PageMeta }`
- `GET /listings/{id}` → `ListingDetailResponse` (adds seller + precise location fields)
- `GET /categories` → `{ categories: [{ slug, label, subcategories: [{slug, label}] }] }`
- `GET /sources` → `{ sources: [{ name, display_name, url, is_enabled, last_crawl_at, last_crawl_status }] }`

### Query Parameter Patterns
- Comma-separated multi-values: `condition`, `source`
- Numeric bounds: `price_min`, `price_max`, `radius_miles`
- Paginated: `page` (1-based) + `page_size` (default 20)
- ZIP-based geo: `location_zip` + `radius_miles`
- Dedup: `deduplicated=true` (default)

### Taxonomy (from `config/taxonomy.yaml`)
Current categories: `safety`, `mobility`, `feeding`, `sleeping`, `clothing`, `toys`, `bath_care`, `nursery`, `uncategorized`  
Each has subcategories with slugs and labels.

### Backend Error Handling
- 404 on missing listing: `{ detail: "Listing <id> not found" }`
- 500: opaque `{ detail: "Internal server error" }` (no stack traces)
- Validated input bounds enforced server-side

---

## Pattern Declaration Summary

| Change Type | Count | Tasks |
|-------------|-------|-------|
| NEW_PATTERN | 12    | All tasks (no existing frontend) |
| FOLLOW | 0 | — |
| MODIFY | 0 | — |
| EXTEND | 0 | — |

**Justification for NEW_PATTERN across all tasks:**  
The `baby-items` project is a Python/FastAPI backend with no frontend codebase. A React SPA is being built from scratch. There are no existing JS/TS patterns to follow or extend. The backend API provides the contract; the frontend architecture is entirely additive.

---

## Naming Conventions (established for this project)

| Concern | Convention |
|---------|------------|
| Components | PascalCase, one per file (`ListingCard.tsx`) |
| Hooks | `use` prefix, camelCase (`useListings.ts`) |
| API types | Match backend schema names (`ListingResponse`, `ListingsPage`) |
| Route slugs | kebab-case matching category slugs from API |
| CSS | Tailwind utility classes; no custom CSS files unless necessary |
| File structure | Feature-grouped: `components/`, `pages/`, `hooks/`, `lib/`, `types/` |
