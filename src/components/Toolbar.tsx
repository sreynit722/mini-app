// src/components/Toolbar.tsx
import type { ChangeEvent } from "react";
import type { FilterMode } from "../types";

interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  count: number;
}

export function Toolbar({
  searchTerm,
  onSearchChange,
  filterMode,
  onFilterChange,
  count,
}: ToolbarProps) {
  return (
    <section
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8"
      aria-label="Catalog Filters"
    >
      {/* Search input — fires on every keystroke via React.ChangeEvent */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          aria-label="Search products"
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1 cursor-pointer"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter pills — each pill click passes a typed FilterMode value */}
      <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1 self-start sm:self-auto">
        {(["all", "inStock", "soldOut"] as FilterMode[]).map((mode) => {
          const labels: Record<FilterMode, string> = {
            all: "All",
            inStock: "In Stock",
            soldOut: "Sold Out",
          };
          return (
            <button
              key={mode}
              type="button"
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                filterMode === mode
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              onClick={() => onFilterChange(mode)}
            >
              {labels[mode]}
            </button>
          );
        })}
      </div>

      {/* Products count badge */}
      <div
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 self-start sm:self-auto"
        id="product-count"
      >
        <span className="font-extrabold">{count}</span>
        <span>{count === 1 ? "product" : "products"}</span>
      </div>
    </section>
  );
}