/** Capitalize first letter of each word, replace hyphens with spaces */
export function formatName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Pad Pokémon ID to 3 digits: 1 → #001 */
export function formatId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

/** Convert decimetres to metres */
export function formatHeight(height: number): string {
  return `${(height / 10).toFixed(1)} m`;
}

/** Convert hectograms to kg */
export function formatWeight(weight: number): string {
  return `${(weight / 10).toFixed(1)} kg`;
}

/** Format stat name for display */
export function formatStatName(stat: string): string {
  const map: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "Sp.ATK",
    "special-defense": "Sp.DEF",
    speed: "SPD",
  };
  return map[stat] ?? formatName(stat);
}
