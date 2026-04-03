import { Suspense } from "react";
import { fetchPokemonList, fetchAllPokemonNames, fetchPokemonByType } from "@/lib/api/pokemon";
import { PokemonGrid } from "@/components/pokemon/PokemonGrid";
import { SearchBar } from "@/components/pokemon/SearchBar";
import { PokemonGridSkeleton } from "@/components/ui/Skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Pokémon",
  description: "Browse and search all Pokémon from the PokéAPI.",
};

// ISR: revalidate every 24h — Pokémon data is stable
export const revalidate = 86400;

interface HomeProps {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = (params.q ?? "").toLowerCase().trim();
  const type = params.type ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Pokémon Explorer
        </h1>
        <p className="text-gray-500">
          {type
            ? `Showing ${type}-type Pokémon`
            : query
            ? `Search results for "${query}"`
            : "Browse all 1,302 Pokémon from every generation"}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8">
        <Suspense fallback={<div className="h-11 bg-gray-100 rounded-xl animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Grid */}
      <Suspense fallback={<PokemonGridSkeleton />}>
        <PokemonListSection query={query} type={type} page={page} />
      </Suspense>
    </div>
  );
}

async function PokemonListSection({
  query,
  type,
  page,
}: {
  query: string;
  type: string;
  page: number;
}) {
  // Search across all Pokémon names (single cached request)
  if (query && !type) {
    const allNames = await fetchAllPokemonNames();
    const matched = allNames.filter((p) => p.name.includes(query));
    const PAGE_SIZE = 24;
    const totalPages = Math.ceil(matched.length / PAGE_SIZE);
    const slice = matched.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Fetch only the matched slice
    const { fetchPokemonCard } = await import("@/lib/api/pokemon");
    const cards = await Promise.all(slice.map((p) => fetchPokemonCard(p.id)));

    return (
      <PokemonGrid
        pokemon={cards}
        currentPage={page}
        totalPages={totalPages}
        totalCount={matched.length}
        searchQuery={query}
      />
    );
  }

  // Type filter
  if (type) {
    const { cards, total, totalPages } = await fetchPokemonByType(type, page);
    // Apply name search on top of type filter if both set
    const filtered = query ? cards.filter((c) => c.name.includes(query)) : cards;
    return (
      <PokemonGrid
        pokemon={filtered}
        currentPage={page}
        totalPages={totalPages}
        totalCount={total}
        searchQuery={query}
      />
    );
  }

  // Default: paginated listing
  const { cards, total, totalPages } = await fetchPokemonList(page);
  return (
    <PokemonGrid
      pokemon={cards}
      currentPage={page}
      totalPages={totalPages}
      totalCount={total}
      searchQuery=""
    />
  );
}
