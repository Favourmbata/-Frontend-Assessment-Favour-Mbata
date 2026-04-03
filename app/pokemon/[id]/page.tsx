import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPokemonById, fetchPokemonSpecies, getEnglishFlavorText, getEnglishGenus } from "@/lib/api/pokemon";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { StatBar } from "@/components/ui/StatBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCardGradient } from "@/lib/utils/typeColors";
import { formatName, formatId, formatHeight, formatWeight } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO + OG
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const pokemon = await fetchPokemonById(id);
    const name = formatName(pokemon.name);
    const imageUrl =
      pokemon.sprites.other["official-artwork"].front_default ??
      pokemon.sprites.front_default;

    return {
      title: `${name} ${formatId(pokemon.id)}`,
      description: `View stats, types, abilities and more for ${name}.`,
      openGraph: {
        title: `${name} | Pokémon Explorer`,
        description: `View stats, types, abilities and more for ${name}.`,
        images: imageUrl ? [{ url: imageUrl, width: 475, height: 475 }] : [],
      },
    };
  } catch {
    return { title: "Pokémon Not Found" };
  }
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;

  let pokemon;
  try {
    pokemon = await fetchPokemonById(id);
  } catch {
    notFound();
  }

  const types = pokemon.types.map((t) => t.type.name);
  const gradient = getCardGradient(types);
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ??
    pokemon.sprites.front_default;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          crumbs={[
            { label: "Pokémon", href: "/" },
            { label: formatName(pokemon.name) },
          ]}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Hero section */}
        <div className={`bg-gradient-to-br ${gradient} px-8 py-10 flex flex-col sm:flex-row items-center gap-8`}>
          <div className="relative w-48 h-48 shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={formatName(pokemon.name)}
                fill
                className="object-contain drop-shadow-xl"
                priority
                sizes="192px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <div className="w-32 h-32 rounded-full border-8 border-gray-400 overflow-hidden relative">
                  <div className="w-full h-1/2 bg-red-400" />
                  <div className="w-full h-1/2 bg-white" />
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">{formatId(pokemon.id)}</p>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              {formatName(pokemon.name)}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
            {/* Species info via Suspense — bonus B-2 streaming */}
            <Suspense fallback={<p className="text-sm text-gray-400 italic">Loading species info…</p>}>
              <SpeciesInfo id={pokemon.id} />
            </Suspense>
          </div>
        </div>

        {/* Details grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Physical */}
          <section aria-labelledby="physical-heading">
            <h2 id="physical-heading" className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Physical
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              {[
                { label: "Height", value: formatHeight(pokemon.height) },
                { label: "Weight", value: formatWeight(pokemon.weight) },
                { label: "Base XP", value: pokemon.base_experience ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <dt className="text-xs text-gray-400 mb-1">{label}</dt>
                  <dd className="text-lg font-bold text-gray-800">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Abilities */}
          <section aria-labelledby="abilities-heading">
            <h2 id="abilities-heading" className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Abilities
            </h2>
            <ul className="space-y-2">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <li
                  key={ability.name}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                >
                  <span className="font-medium text-gray-800 capitalize">
                    {formatName(ability.name)}
                  </span>
                  {is_hidden && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      Hidden
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Base Stats — full width */}
          <section aria-labelledby="stats-heading" className="md:col-span-2">
            <h2 id="stats-heading" className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Base Stats
            </h2>
            <div className="space-y-3">
              {pokemon.stats.map(({ stat, base_stat }) => (
                <StatBar key={stat.name} name={stat.name} value={base_stat} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Streamed via Suspense — slow species fetch doesn't block the rest of the page
async function SpeciesInfo({ id }: { id: number }) {
  try {
    const species = await fetchPokemonSpecies(id);
    const genus = getEnglishGenus(species);
    const flavor = getEnglishFlavorText(species);

    return (
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-600 italic">{genus}</p>
        <p className="text-sm text-gray-600 max-w-sm">{flavor}</p>
        {(species.is_legendary || species.is_mythical) && (
          <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
            {species.is_mythical ? "✨ Mythical" : "⭐ Legendary"}
          </span>
        )}
      </div>
    );
  } catch {
    return null;
  }
}
