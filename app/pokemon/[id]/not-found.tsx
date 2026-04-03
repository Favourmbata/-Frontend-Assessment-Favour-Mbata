import Link from "next/link";

export default function PokemonNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
      <div className="w-20 h-20 mb-6 relative" aria-hidden="true">
        <div className="w-full h-full rounded-full border-4 border-gray-300 overflow-hidden">
          <div className="w-full h-1/2 bg-red-400" />
          <div className="w-full h-1/2 bg-white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white border-4 border-gray-300" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Pokémon Not Found</h1>
      <p className="text-gray-500 mb-6">
        That Pokémon doesn&apos;t exist in our Pokédex.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        Back to Pokédex
      </Link>
    </div>
  );
}
