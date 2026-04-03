"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [router, pathname, searchParams]
  );

  if (totalPages <= 1) return null;

  
  const pages = buildPageWindow(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 flex-wrap"
    >
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100
                   disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition
              ${
                p === currentPage
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100
                   disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </nav>
  );
}

function buildPageWindow(current: number, total: number): Array<number | "..."> {
  const delta = 2;
  const range: number[] = [];
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  const pages: Array<number | "..."> = [1];
  if (range[0] > 2) pages.push("...");
  pages.push(...range);
  if (range[range.length - 1] < total - 1) pages.push("...");
  if (total > 1) pages.push(total);

  return pages;
}
