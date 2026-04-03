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

## API Choice —
## Architecture Decisions

### Folder structure
```
app/              Next.js App Router pages, layouts, loading/error
components/
  ui/             Atoms: TypeBadge, StatBar, Skeleton, Breadcrumb, EmptyState
  pokemon/        Feature components: PokemonCard, SearchBar, Pagination, grids
  providers/      QueryProvider (TanStack Query client)
lib/
  api/            All fetch calls — components never call fetch() directly
  hooks/          Custom React hooks (usePokemonByType, useDebounce)
  utils/          Pure utility functions (format, typeColors)
types/            Shared TypeScript interfaces — no inline reused shapes
```

### Pagination vs Infinite Scroll
Chose **pagination** because:
- URL-driven pagination makes results shareable and bookmarkable (requirement F-3)
- Easier to implement correct SSR with `page` as a search param
- Better for accessibility — screen readers handle paginated navigation more predictably than infinite scroll

### SSR vs Client-side for type filtering
- Default listing: **ISR** (revalidate 24h) — data is stable, benefits from CDN caching
- Type-filtered listing: **TanStack Query** client-side — type filter changes frequently per user interaction; avoids full page reload and leverages client cache

### Search
URL-driven with 300ms debounce. The `q` param is reflected in the URL so results are shareable. Client-side name filtering is applied on top of the server-fetched page for instant feedback.

---

## Performance Optimizations

1. **`next/image`** — all Pokémon images use `<Image>` with explicit dimensions. Above-the-fold cards (first 8) use `priority` to trigger early LCP fetch.

2. **`next/font` (Inter)** — font is self-hosted via `next/font/google`, eliminating render-blocking external font requests and preventing layout shift (`display: swap`).

3. **ISR fetch cache** — listing and detail pages use `revalidate: 86400`. Individual Pokémon data is stable; 24h revalidation balances freshness with CDN hit rate. `no-store` is intentionally avoided here since data doesn't change per-user.

4. **Suspense streaming (Bonus B-2)** — the species data fetch on the detail page is wrapped in a `<Suspense>` boundary. The hero section (name, types, image) streams immediately; the flavor text and genus stream in separately without blocking the rest of the page.

5. **`overflow-y: scroll`** on `html` — prevents CLS from scrollbar appearing/disappearing between pages.

6. **Dynamic import** — `TypeFilteredGrid` is a client component loaded only when a type filter is active, keeping the default SSR path lean.

---

## Bonus Tasks

### B-2: React 18 Streaming with Suspense ✅
`SpeciesInfo` on the detail page (`app/pokemon/[id]/page.tsx`) is an async Server Component wrapped in `<Suspense>`. The species API call is intentionally separate from the main Pokémon fetch — the page shell streams first, species data streams in after. Verify by throttling the network in DevTools and observing the "Loading species info…" fallback.

### B-3: Accessibility
- All interactive elements have visible focus rings (`focus-visible:outline`)
- Images have descriptive `alt` text; decorative elements use `aria-hidden="true"`
- `StatBar` uses `role="progressbar"` with `aria-valuenow/min/max`
- `EmptyState` uses `role="status"` and `aria-live="polite"`
- `Breadcrumb` uses `<nav aria-label="Breadcrumb">` with `aria-current="page"`
- Color is never the sole means of conveying information (type names are always shown as text alongside color)
- `sr-only` labels on search input and type select

---

## Trade-offs & Known Limitations

- **Search scope**: The search input filters the current page only (not all 1,302 Pokémon). With more time I'd add a global name-search endpoint or pre-fetch all names for client-side fuzzy search.
- **No `generateStaticParams`**: Detail pages are server-rendered on demand rather than statically generated at build time. With more time I'd generate the first ~151 (Gen 1) statically and use `dynamicParams: true` for the rest.
- **Type filter + search**: When a type filter is active, search filters the current page of that type. Cross-page search within a type would require a different API strategy.
- **Cloudflare deployment**: Configured for Cloudflare Workers via OpenNext. If deploying to Vercel instead, remove the `@opennextjs/cloudflare` adapter from `open-next.config.ts`.

---

## What I'd tackle next (2 hours)

1. Add `generateStaticParams` for Gen 1 Pokémon to get full static generation + instant navigation
2. Implement global fuzzy search across all Pokémon names using a pre-fetched name index
3. Add evolution chain display on the detail page using the species evolution chain endpoint
