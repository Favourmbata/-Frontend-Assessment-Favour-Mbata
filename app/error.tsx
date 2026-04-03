"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
      <div className="w-20 h-20 mb-6 relative" aria-hidden="true">
        <div className="w-full h-full rounded-full border-4 border-red-300 overflow-hidden">
          <div className="w-full h-1/2 bg-red-400" />
          <div className="w-full h-1/2 bg-white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white border-4 border-red-300" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        We couldn&apos;t load the Pokémon data. This might be a temporary issue with the PokéAPI.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
