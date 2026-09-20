// src/components/ProductCard.tsx
import type { PublicProduct } from "../types";

interface ProductCardProps {
  product: PublicProduct;
  onAddToCart: (product: PublicProduct) => void;
  onToggleStock: (id: number) => void;
}

export function ProductCard({ product, onAddToCart, onToggleStock }: ProductCardProps) {
  return (
    <article
      className={`group bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col ${
        product.inStock
          ? "border-slate-200 dark:border-slate-800"
          : "border-slate-200 dark:border-slate-800/60 opacity-90"
      }`}
    >
      {/* Product Media */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image ?? ""}
          alt={product.name ?? ""}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !product.inStock ? "grayscale-50 opacity-80" : ""
          }`}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
          {/* Green "In stock" / Gray "Sold out" — pure ternary */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs ${
              product.inStock
                ? "bg-emerald-50/95 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                : "bg-slate-100/95 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.inStock
                  ? "bg-emerald-500 shadow-xs shadow-emerald-500"
                  : "bg-slate-400"
              }`}
            />
            {product.inStock ? "In stock" : "Sold out"}
          </span>

          {product.onSale && (
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md ml-auto">
              SALE
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">
          {product.name ?? "Unnamed Product"}
        </h2>

        <div className="flex items-baseline gap-2.5 mb-5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            ${product.price?.toFixed(2) ?? "0.00"}
          </span>
          {product.onSale && (
            <span className="text-sm text-slate-400 line-through">
              ${((product.price ?? 0) * 1.25).toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center cursor-pointer ${
              product.inStock
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-70"
            }`}
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            aria-label={`Add ${product.name ?? "this product"} to cart`}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          <button
            type="button"
            className="px-3 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800/80 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer whitespace-nowrap"
            onClick={() => onToggleStock(product.id)}
            title={product.inStock ? "Click to mark as sold out" : "Click to restock"}
            aria-label={`Toggle stock status for ${product.name ?? "this product"}`}
          >
            {product.inStock ? "Mark Sold Out" : "Restock"}
          </button>
        </div>
      </div>
    </article>
  );
}