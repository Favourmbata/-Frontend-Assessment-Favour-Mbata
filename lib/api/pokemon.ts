import type {
  Pokemon,
  PokemonCard,
  PokemonListResponse,
  PokemonSpecies,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";
const PAGE_SIZE = 24;


export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export async function fetchPokemonList(
  page: number = 1
): Promise<{ cards: PokemonCard[]; total: number; totalPages: number }> {
  const offset = (page - 1) * PAGE_SIZE;

  const res = await fetch(
    `${BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) throw new Error(`Failed to fetch Pokémon list: ${res.status}`);

  const list: PokemonListResponse = await res.json();

 
  const cards = await Promise.all(
    list.results.map(async (item) => {
      const id = extractIdFromUrl(item.url);
      return fetchPokemonCard(id);
    })
  );

  return {
    cards,
    total: list.count,
    totalPages: Math.ceil(list.count / PAGE_SIZE),
  };
}


export async function fetchPokemonCard(id: number): Promise<PokemonCard> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Pokémon not found: ${id}`);
  const p: Pokemon = await res.json();
  return toPokemonCard(p);
}


export async function fetchPokemonById(id: number | string): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Pokémon not found: ${id}`);
  return res.json();
}


export async function fetchPokemonSpecies(
  id: number | string
): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Species not found: ${id}`);
  return res.json();
}


export async function fetchAllPokemonNames(): Promise<
  Array<{ name: string; id: number }>
> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=1302&offset=0`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch all Pokémon names");
  const data: PokemonListResponse = await res.json();
  return data.results.map((p) => ({
    name: p.name,
    id: extractIdFromUrl(p.url),
  }));
}


export async function fetchPokemonByType(
  type: string,
  page: number = 1
): Promise<{ cards: PokemonCard[]; total: number; totalPages: number }> {
  const res = await fetch(`${BASE_URL}/type/${type}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Type not found: ${type}`);

  const data = await res.json();
 
  const allPokemon: Array<{ pokemon: { name: string; url: string } }> =
    data.pokemon;

  const total = allPokemon.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const offset = (page - 1) * PAGE_SIZE;
  const slice = allPokemon.slice(offset, offset + PAGE_SIZE);

  const cards = await Promise.all(
    slice.map(async ({ pokemon }) => {
      const id = extractIdFromUrl(pokemon.url);
      return fetchPokemonCard(id);
    })
  );

  return { cards, total, totalPages };
}



export function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}

export function toPokemonCard(p: Pokemon): PokemonCard {
  return {
    id: p.id,
    name: p.name,
    imageUrl:
      p.sprites.other["official-artwork"].front_default ??
      p.sprites.front_default ??
      getSpriteUrl(p.id),
    types: p.types.map((t) => t.type.name),
    height: p.height,
    weight: p.weight,
  };
}

export function getEnglishFlavorText(species: PokemonSpecies): string {
  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === "en"
  );
  return entry
    ? entry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
    : "No description available.";
}

export function getEnglishGenus(species: PokemonSpecies): string {
  return (
    species.genera.find((g) => g.language.name === "en")?.genus ?? "Unknown"
  );
}

export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;
