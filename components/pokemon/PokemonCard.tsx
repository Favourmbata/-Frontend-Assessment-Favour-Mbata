import Image from "next/image";
import Link from "next/link";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { getCardGradient } from "@/lib/utils/typeColors";
import { formatId, formatName, formatHeight, formatWeight } from "@/lib/utils/format";
import type { PokemonCard as PokemonCardType } from "@/types/pokemon";

interface PokemonCardProps {
  pokemon: PokemonCardType;
  priority?: boolean;
}

export function PokemonCard({ pokemon, priority = false }: PokemonCardProps) {
  const gradient = getCardGradient(pokemon.types);

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100
                 hover:shadow-md hover:-translate-y-1 transition-all duration-200 focus-visible:outline-2
                 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
      aria-label={`View details for ${formatName(pokemon.name)}`}
    >
      {/* Image area */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="absolute top-3 left-3 text-xs font-bold text-gray-400">
          {formatId(pokemon.id)}
        </span>
        {pokemon.imageUrl ? (
          <Image
            src={pokemon.imageUrl}
            alt={formatName(pokemon.name)}
            width={160}
            height={160}
            className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
            priority={priority}
          />
        ) : (
          // Graceful fallback — Pokéball SVG
          <div className="w-24 h-24 opacity-20" aria-hidden="true">
            <div className="w-full h-full rounded-full border-8 border-gray-400 overflow-hidden relative">
              <div className="w-full h-1/2 bg-red-400" />
              <div className="w-full h-1/2 bg-white" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white border-4 border-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2 capitalize">
          {formatName(pokemon.name)}
        </h2>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Height: {formatHeight(pokemon.height)}</span>
          <span>Weight: {formatWeight(pokemon.weight)}</span>
        </div>
      </div>
    </Link>
  );
}
