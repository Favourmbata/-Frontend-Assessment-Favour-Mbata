
export const TYPE_COLORS: Record<string, string> = {
  normal:   "bg-gray-400 text-white",
  fire:     "bg-orange-500 text-white",
  water:    "bg-blue-500 text-white",
  electric: "bg-yellow-400 text-gray-900",
  grass:    "bg-green-500 text-white",
  ice:      "bg-cyan-300 text-gray-900",
  fighting: "bg-red-700 text-white",
  poison:   "bg-purple-500 text-white",
  ground:   "bg-yellow-600 text-white",
  flying:   "bg-indigo-400 text-white",
  psychic:  "bg-pink-500 text-white",
  bug:      "bg-lime-500 text-white",
  rock:     "bg-yellow-800 text-white",
  ghost:    "bg-purple-800 text-white",
  dragon:   "bg-indigo-700 text-white",
  dark:     "bg-gray-800 text-white",
  steel:    "bg-gray-500 text-white",
  fairy:    "bg-pink-300 text-gray-900",
};

export const TYPE_BG_GRADIENT: Record<string, string> = {
  normal:   "from-gray-100 to-gray-200",
  fire:     "from-orange-50 to-red-100",
  water:    "from-blue-50 to-blue-100",
  electric: "from-yellow-50 to-yellow-100",
  grass:    "from-green-50 to-green-100",
  ice:      "from-cyan-50 to-cyan-100",
  fighting: "from-red-50 to-red-100",
  poison:   "from-purple-50 to-purple-100",
  ground:   "from-yellow-50 to-amber-100",
  flying:   "from-indigo-50 to-blue-100",
  psychic:  "from-pink-50 to-pink-100",
  bug:      "from-lime-50 to-green-100",
  rock:     "from-yellow-50 to-amber-200",
  ghost:    "from-purple-50 to-indigo-100",
  dragon:   "from-indigo-50 to-indigo-200",
  dark:     "from-gray-100 to-gray-300",
  steel:    "from-gray-50 to-slate-200",
  fairy:    "from-pink-50 to-rose-100",
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? "bg-gray-400 text-white";
}

export function getCardGradient(types: string[]): string {
  const primary = types[0] ?? "normal";
  return TYPE_BG_GRADIENT[primary] ?? "from-gray-100 to-gray-200";
}
