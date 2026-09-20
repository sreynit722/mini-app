// src/App.tsx
import { useState } from "react";
import ProductImg from "./assets/product.jpg";
import LaptopImg from "./assets/laptop.jpg";
import type { Product, PublicProduct, FilterMode } from "./types";
import { ProductCard } from "./components/product";
import { Toolbar } from "./components/Toolbar";
import { AddProductForm } from "./components/AddProductForm";

// ─── Seed data ────────────────────────────────────────────────────────────────
// 1. Type the mini-app end to end: props interfaces on every component, React.ChangeEvent on handlers, useState<Product[]> for the list—zero implicit any.
// Every entry is typed as Product (includes costPrice) — fulfils the
// "add to every product in INITIAL_PRODUCTS" requirement.
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ultra-Thin Laptop Pro",
    price: 700,
    costPrice: 420,
    image: LaptopImg,
    inStock: true,
    onSale: false,
  },
  {
    id: 2,
    name: "Ergonomic Wireless Mouse",
    price: 25,
    costPrice: 10,
    image: ProductImg,
    inStock: false,
    onSale: true,
  },
  {
    id: 3,
    name: "RGB Mechanical Keyboard",
    price: 85,
    costPrice: 40,
    image: ProductImg,
    inStock: true,
    onSale: true,
  },
  {
    id: 4,
    name: "4K Ultra-HD Monitor",
    price: 299,
    costPrice: 170,
    image: LaptopImg,
    inStock: true,
    onSale: false,
  },
  {
    id: 5,
    name: "Active Noise-Cancelling Headphones",
    price: 160,
    costPrice: 75,
    image: ProductImg,
    inStock: false,
    onSale: false,
  },
  {
    id: 6,
    name: "High-Fidelity Desk Speakers",
    price: 110,
    costPrice: 55,
    image: ProductImg,
    inStock: true,
    onSale: false,
  },
];

// ─── Root component ────────────────────────────────────────────────────────────
function App() {
  // All state is explicitly typed — zero implicit any
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);

  // ── Derived list ─────────────────────────────────────────────────────────────
  const filteredProducts: Product[] = products.filter((product: Product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === "inStock") return product.inStock;
    if (filterMode === "soldOut") return !product.inStock;
    return true;
  });

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleToggleStock = (id: number): void => {
    setProducts((prev: Product[]) =>
      prev.map((item: Product) =>
        item.id === id ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  // Accepts PublicProduct because that is the type ProductCard exposes via its onAddToCart prop.
  const handleAddToCart = (product: PublicProduct): void => {
    if (!product.inStock) return;
    setCartCount((prev: number) => prev + 1);
  };

  const handleAddProduct = (newProduct: Product): void => {
    setProducts((prev: Product[]) => [newProduct, ...prev]);
    setShowAddForm(false);
  };

  const handleResetFilters = (): void => {
    setSearchTerm("");
    setFilterMode("all");
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 text-left">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full mb-3">
            E-Commerce Studio
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Product Catalog
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1.5">
            Curated gear for developers, designers, and creators.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Cart chip */}
          <div
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
            title="Cart Items"
          >
            <span className="text-base">🛒</span>
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {cartCount}
            </span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition duration-150 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 cursor-pointer"
            onClick={() => setShowAddForm((prev: boolean) => !prev)}
            aria-expanded={showAddForm}
          >
            {showAddForm ? "✕ Close Form" : "+ Add Product"}
          </button>
        </div>
      </header>

      {/* ── Add Product Form ── */}
      {showAddForm && (
        <AddProductForm
          onAdd={handleAddProduct}
          onClose={() => setShowAddForm(false)}
          defaultImage={ProductImg}
        />
      )}

      {/* ── Search / Filter Toolbar ── */}
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterMode={filterMode}
        onFilterChange={setFilterMode}
        count={filteredProducts.length}
      />

      {/* ── Product Grid — rendered via .map() with stable id keys ── */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No products found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Try adjusting your search query or switching filters.
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleStock={handleToggleStock}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
