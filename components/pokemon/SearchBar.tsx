"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { POKEMON_TYPES } from "@/lib/api/pokemon";
import { formatName } from "@/lib/utils/format";
import { useEffect } from "react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");

  
  const debouncedSearch = useDebounce(search, 300);

  const buildUrl = useCallback(
    (q: string, t: string) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (t) params.set("type", t);
      params.set("page", "1");
      const qs = params.toString();
      return `${pathname}${qs ? `?${qs}` : ""}`;
    },
    [pathname]
  );

  useEffect(() => {
    startTransition(() => {
      router.push(buildUrl(debouncedSearch, type), { scroll: false });
    });
  }, [debouncedSearch, type, buildUrl, router]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
     
      <div className="relative flex-1">
        <label htmlFor="pokemon-search" className="sr-only">
          Search Pokémon by name
        </label>
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id="pokemon-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search all Pokémon..."
          aria-label="Search Pokémon by name"
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white
                     text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-indigo-400 focus:border-transparent transition
                     ${isPending ? "opacity-70" : ""}`}
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        )}
      </div>

     
      <div className="relative">
        <label htmlFor="type-filter" className="sr-only">
          Filter by type
        </label>
        <select
          id="type-filter"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white
                     text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400
                     focus:border-transparent transition cursor-pointer min-w-[160px]"
        >
          <option value="">All Types</option>
          {POKEMON_TYPES.map((t) => (
            <option key={t} value={t}>
              {formatName(t)}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
