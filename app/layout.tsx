import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

// next/font: font files are self-hosted, no layout shift, no external request at runtime
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Pokémon Explorer",
    template: "%s | Pokémon Explorer",
  },
  description:
    "Browse, search, and filter all Pokémon. Built with Next.js 16 and PokéAPI.",
  openGraph: {
    title: "Pokémon Explorer",
    description: "Browse, search, and filter all Pokémon.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <QueryProvider>
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
              <a
                href="/"
                className="flex items-center gap-2 font-bold text-gray-900 text-lg hover:text-indigo-600 transition-colors"
              >
                {/* Inline Pokéball icon */}
                <span className="w-7 h-7 relative inline-block" aria-hidden="true">
                  <span className="block w-full h-full rounded-full border-2 border-gray-800 overflow-hidden">
                    <span className="block w-full h-1/2 bg-red-500" />
                    <span className="block w-full h-1/2 bg-white" />
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="block w-2.5 h-2.5 rounded-full bg-white border-2 border-gray-800" />
                  </span>
                </span>
                Pokémon Explorer
              </a>
            </div>
          </header>
          <main id="main-content">{children}</main>
          <footer className="mt-16 border-t border-gray-100 py-8 text-center text-sm text-gray-400">
            Data from{" "}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              PokéAPI
            </a>
            . Not affiliated with Nintendo or The Pokémon Company.
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
