# Assumptions Checklist

## Confirmed ✅
- [x] Backend API is running at a configurable `VITE_API_BASE_URL` (FastAPI, baby-items project)
- [x] API endpoints: `/listings`, `/listings/{id}`, `/categories`, `/sources` are all available
- [x] All listing data is read-only — no auth, no user accounts in MVP
- [x] CORS is configured server-side to allow the frontend origin
- [x] The taxonomy in `config/taxonomy.yaml` defines the real category slugs (`safety`, `mobility`, `feeding`, `sleeping`, `clothing`, `toys`, `bath_care`, `nursery`)
- [x] Images field is an array of URL strings (may be empty `{}` from PostgreSQL array type)
- [x] `dedup_cluster_id` is a UUID that matches across sources for the same physical item
- [x] `posted_at` may be null (use `scraped_at` as fallback for relative time)
- [x] Frontend will live in `/Users/r0p0aib/baby-items/frontend/` as a Vite subproject

## Needs Clarification ⚠️
- [ ] **Image URLs:** Are image URLs absolute (direct CDN links) or relative paths? → Assume absolute for now
- [ ] **Dedup cluster fetch:** Is there an endpoint like `GET /listings?dedup_cluster_id=<uuid>` to fetch same-cluster listings? → Will use `GET /listings` with a filter if supported, otherwise skip dedup section
- [ ] **Categories as general marketplace:** The current taxonomy is baby-items specific. For the general marketplace the user described (cars, phones, bikes, etc.), will the taxonomy be updated? → Build frontend to be data-driven from `/categories` API — no hardcoded category slugs in the UI
- [ ] **API base URL for production:** What domain/port does the production API run on?
- [ ] **Image fallback:** Should missing images show a branded placeholder or a generic grey box?

## Out of Scope Confirmed
- No user authentication
- No seller messaging
- No favorites / saved searches
- No PWA / offline
- No SSR (client-side only SPA)
- No i18n
