import React, { useState } from 'react'
import ProductImg from './assets/product.jpg'
import LaptopImg from './assets/laptop.jpg'

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  onSale: boolean;
}

interface ProductFormData {
  name: string;
  price: string;
  inStock: boolean;
  onSale: boolean;
}

interface FormErrors {
  name?: string;
  price?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ultra-Thin Laptop Pro",
    price: 700,
    image: LaptopImg,
    inStock: true,
    onSale: false,
  },
  {
    id: 2,
    name: "Ergonomic Wireless Mouse",
    price: 25,
    image: ProductImg,
    inStock: false,
    onSale: true,
  },
  {
    id: 3,
    name: "RGB Mechanical Keyboard",
    price: 85,
    image: ProductImg,
    inStock: true,
    onSale: true,
  },
  {
    id: 4,
    name: "4K Ultra-HD Monitor",
    price: 299,
    image: LaptopImg,
    inStock: true,
    onSale: false,
  },
  {
    id: 5,
    name: "Active Noise-Cancelling Headphones",
    price: 160,
    image: ProductImg,
    inStock: false,
    onSale: false,
  },
  {
    id: 6,
    name: "High-Fidelity Desk Speakers",
    price: 110,
    image: ProductImg,
    inStock: true,
    onSale: false,
  }
];

function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"all" | "inStock" | "soldOut">("all");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    inStock: true,
    onSale: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [cartCount, setCartCount] = useState<number>(0);

  // Filter products reacting to keystroke search and filter buttons
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterMode === "inStock") return product.inStock;
    if (filterMode === "soldOut") return !product.inStock;
    return true;
  });

  // Toggle in-stock status directly with a click
  const handleToggleStock = (id: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  // Add to cart click handler
  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return;
    setCartCount((prev) => prev + 1);
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    const parsedPrice = parseFloat(formData.price);
    if (!formData.price.trim()) {
      errors.price = "Price is required.";
    } else if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = "Price must be a number greater than 0.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form input change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error on change
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Submit new product
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newProduct: Product = {
      id: Date.now(),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      image: ProductImg,
      inStock: formData.inStock,
      onSale: formData.onSale,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setFormData({
      name: "",
      price: "",
      inStock: true,
      onSale: false,
    });
    setFormErrors({});
    setShowAddForm(false);
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 text-left">
      {/* Header section */}
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
            onClick={() => setShowAddForm((prev) => !prev)}
            aria-expanded={showAddForm}
          >
            {showAddForm ? "✕ Close Form" : "+ Add Product"}
          </button>
        </div>
      </header>

      {/* Validated Add Product Form */}
      {showAddForm && (
        <section
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm transition-all"
          aria-label="Add New Product Form"
        >
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Add New Product
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Enter product details with TypeScript-backed validation
            </p>
          </div>
          <form onSubmit={handleAddProduct} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label
                  htmlFor="product-name"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="product-name"
                  type="text"
                  name="name"
                  placeholder="e.g. Mechanical Numpad"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    formErrors.name
                      ? "border-red-400 bg-red-50/40 dark:bg-red-950/20 dark:border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
                />
                {formErrors.name && (
                  <span className="text-xs font-medium text-red-500">
                    {formErrors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="product-price"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Price ($ USD) <span className="text-red-500">*</span>
                </label>
                <input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="price"
                  placeholder="e.g. 49.99"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    formErrors.price
                      ? "border-red-400 bg-red-50/40 dark:bg-red-950/20 dark:border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  }`}
                />
                {formErrors.price && (
                  <span className="text-xs font-medium text-red-500">
                    {formErrors.price}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600"
                />
                <span>In Stock</span>
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="onSale"
                  checked={formData.onSale}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600"
                />
                <span>On Sale</span>
              </label>
            </div>

            <div className="flex justify-end items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                onClick={() => {
                  setShowAddForm(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer shadow-xs"
              >
                Save Product
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Controls & Filter Toolbar */}
      <section
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8"
        aria-label="Catalog Filters"
      >
        {/* Search input - reacts to every keystroke */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1 cursor-pointer"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1 self-start sm:self-auto">
          <button
            type="button"
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              filterMode === "all"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => setFilterMode("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              filterMode === "inStock"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => setFilterMode("inStock")}
          >
            In Stock
          </button>
          <button
            type="button"
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              filterMode === "soldOut"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => setFilterMode("soldOut")}
          >
            Sold Out
          </button>
        </div>

        {/* Products Count Indicator */}
        <div
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 self-start sm:self-auto"
          id="product-count"
        >
          <span className="font-extrabold">{filteredProducts.length}</span>
          <span>
            {filteredProducts.length === 1 ? "product" : "products"}
          </span>
        </div>
      </section>

      {/* Product Grid rendered from array with .map() */}
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
            onClick={() => {
              setSearchTerm("");
              setFilterMode("all");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className={`group bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col ${
                product.inStock
                  ? "border-slate-200 dark:border-slate-800"
                  : "border-slate-200 dark:border-slate-800/60 opacity-90"
              }`}
            >
              {/* Product Media */}
              <div className="relative w-full aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    !product.inStock ? "grayscale-50 opacity-80" : ""
                  }`}
                  loading="lazy"
                />

                {/* Badges container */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                  {/* Green In stock / Gray Sold out badge via ternary */}
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
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2.5 mb-5">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.onSale && (
                    <span className="text-sm text-slate-400 line-through">
                      ${(product.price * 1.25).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Product Actions */}
                <div className="mt-auto grid grid-cols-[1fr_auto] gap-2">
                  <button
                    type="button"
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center cursor-pointer ${
                      product.inStock
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-70"
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>

                  <button
                    type="button"
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800/80 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer whitespace-nowrap"
                    onClick={() => handleToggleStock(product.id)}
                    title={
                      product.inStock
                        ? "Click to mark as sold out"
                        : "Click to restock"
                    }
                    aria-label={`Toggle stock status for ${product.name}`}
                  >
                    {product.inStock ? "Mark Sold Out" : "Restock"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
