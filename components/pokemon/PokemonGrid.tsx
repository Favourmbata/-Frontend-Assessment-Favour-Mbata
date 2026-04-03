"use client";

import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/pokemon/Pagination";
import type { PokemonCard as PokemonCardType } from "@/types/pokemon";
import Link from "next/link";

interface PokemonGridProps {
  pokemon: PokemonCardType[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  searchQuery: string;
}

export function PokemonGrid({
  pokemon,
  currentPage,
  totalPages,
  totalCount,
  searchQuery,
}: PokemonGridProps) {
  if (pokemon.length === 0) {
    return (
      <EmptyState
        title="No Pokémon found"
        message={
          searchQuery
            ? `No results for "${searchQuery}". Try a different name or clear the filter.`
            : "No Pokémon match the current filter."
        }
        action={
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Clear search
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      
      <p className="text-sm text-gray-500">
        {totalCount.toLocaleString()} Pokémon
        {searchQuery ? ` matching "${searchQuery}"` : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pokemon.map((p, i) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            priority={i < 8}
          />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
