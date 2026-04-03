
export function formatName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}


export function formatId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}


export function formatHeight(height: number): string {
  return `${(height / 10).toFixed(1)} m`;
}


export function formatWeight(weight: number): string {
  return `${(weight / 10).toFixed(1)} kg`;
}


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
