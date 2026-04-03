# Pokémon Explorer

A production-quality Content Explorer built with Next.js 16 (App Router), TypeScript strict mode, Tailwind CSS v4, and TanStack Query v5, using [PokéAPI](https://pokeapi.co) as the data source.

## Setup

```bash
git clone <repo-url>
cd pokemon-explorer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run test   # run vitest suite (12 tests, 2 files)
npm run build  # production build
```

---

## API Choice

**PokéAPI** — https://pokeapi.co

Chosen because:
- No API key required — zero friction setup and no `.env` secrets needed for reviewers
- Stable, well-documented, and paginated — maps cleanly to all required features (listing, detail, type filtering, search)
- Rich data model: each Pokémon has images, types, stats, abilities, and a separate species endpoint — enough to build a genuinely interesting detail page
- The official artwork sprites are hosted on GitHub CDN (`raw.githubusercontent.com`), which means fast, reliable image loading with `next/image`

---

## Architecture Decisions

### Folder structure

```
app/              Next.js App Router pages, layouts, loading/error/not-found
components/
  ui/             Atoms: TypeBadge, StatBar, Skeleton, Breadcrumb, EmptyState
  pokemon/        Feature components: PokemonCard, SearchBar, Pagination, PokemonGrid
  providers/      QueryProvider (TanStack Query client)
lib/
  api/            All fetch calls — components never call fetch() directly
  hooks/          Custom React hooks (useDebounce)
  utils/          Pure utility functions (format, typeColors)
types/            Shared TypeScript interfaces — no inline reused shapes
```

### Pagination vs Infinite Scroll

Chose **pagination** because:
- URL-driven pagination makes results shareable and bookmarkable (requirement F-3)
- Easier to implement correct SSR with `page` as a search param
- Better for accessibility — screen readers handle paginated navigation more predictably than infinite scroll
- Fits the browsing pattern better: users looking for a specific Pokémon by number expect page-based navigation

### Server Components vs Client Components

- Listing and detail pages are **Server Components** — data is fetched at the server level, no client JS needed for the initial render
- `SearchBar` and `Pagination` are `"use client"` — they manage URL state via `useRouter` and `useSearchParams`
- `PokemonGrid` is a Server Component — it only renders server-fetched data and has no client-side state

### Search strategy

URL-driven with 300ms debounce. The `q` param is reflected in the URL so results are shareable. When searching without a type filter, `fetchAllPokemonNames` fetches the full name index (1,302 names, single cached request) and filters client-side — this avoids N+1 requests and the full name list is aggressively cached via ISR.

---

## Performance Optimizations

1. **`next/image` with `priority`** — all Pokémon images use `<Image>` with explicit `width` and `height`. The first 8 cards on the listing page use `priority={true}` to trigger an early LCP fetch and avoid lazy-loading above-the-fold images.

2. **`next/font` (Inter)** — font is self-hosted via `next/font/google`, eliminating render-blocking external font requests and preventing layout shift (`display: swap`).

3. **ISR fetch cache (`revalidate: 86400`)** — all PokéAPI calls use a 24-hour revalidation window. Pokémon data is effectively immutable; ISR means the first request after deploy is server-rendered and cached at the CDN edge, subsequent requests are served instantly. `no-store` is intentionally avoided since data doesn't change per-user.

4. **Suspense streaming (Bonus B-2)** — the species data fetch on the detail page is wrapped in a `<Suspense>` boundary (`SpeciesInfo` component). The hero section (name, types, image) streams to the client immediately; flavor text and genus stream in separately without blocking the rest of the page.

5. **Skeleton loaders that match card dimensions** — `PokemonCardSkeleton` mirrors the exact height and layout of `PokemonCard`, preventing CLS when real content loads in.

---

## Bonus Tasks

### B-2: React 18 Streaming with Suspense ✅

`SpeciesInfo` on the detail page (`app/pokemon/[id]/page.tsx`) is an async Server Component wrapped in `<Suspense>`. The species API call is intentionally kept separate from the main Pokémon fetch — the page shell (name, image, types, stats) streams first, and species data (genus, flavor text, legendary badge) streams in after.

To verify: open any Pokémon detail page with DevTools Network throttled to "Slow 3G" and observe the "Loading species info…" fallback rendering before the flavor text appears.

### B-3: Accessibility ✅

Accessibility was considered throughout rather than audited at the end:

- All interactive elements have visible focus rings (`focus-visible:outline-2 focus-visible:outline-indigo-500`)
- Images have descriptive `alt` text; decorative elements use `aria-hidden="true"`
- `StatBar` uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `EmptyState` uses `role="status"` and `aria-live="polite"` for dynamic content announcements
- `Breadcrumb` uses `<nav aria-label="Breadcrumb">` with `aria-current="page"` on the active crumb
- Search input and type select both have visible `<label>` elements (visually hidden via `sr-only`, present for screen readers)
- Color is never the sole means of conveying information — type names are always shown as text alongside the color badge
- Semantic HTML throughout: `<header>`, `<main id="main-content">`, `<footer>`, `<section aria-labelledby>`, `<dl>` for key-value pairs, `<nav aria-label="Pagination">`

---

## Trade-offs & Known Limitations

- **No `generateStaticParams`** — detail pages are server-rendered on demand rather than statically generated at build time. With more time I'd generate the first 151 (Gen 1) statically and use `dynamicParams: true` for the rest, which would significantly improve LCP for those pages.

- **Type filter + search** — when a type filter is active, the name search filters only the current page of that type. Cross-page search within a type would require a different API strategy (PokéAPI doesn't support combined type + name queries).

- **No optimistic updates** — search/filter navigation waits for the server round-trip. The `useTransition` pending state provides visual feedback, but with more time I'd add optimistic UI for instant perceived response.

- **Cloudflare deployment** — the project is configured for Cloudflare Workers via the OpenNext adapter. If deploying to Vercel instead, remove the `@opennextjs/cloudflare` adapter from `open-next.config.ts`. Cloudflare was targeted as it matches the preferred production hosting environment specified in the brief.

---

## What I'd tackle next (2 hours)

1. Add `generateStaticParams` for Gen 1 Pokémon (IDs 1–151) to get full static generation and instant navigation for the most-visited pages
2. Implement global fuzzy search across all Pokémon names using the pre-fetched name index already in place — add a search suggestions dropdown
3. Add evolution chain display on the detail page using the species `evolution_chain` endpoint
