// src/types.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  costPrice: number; // internal field — not exposed in PublicProduct
  image: string;
  inStock: boolean;
  onSale: boolean;
}

/** Subset of Product safe to pass to UI components (hides costPrice). */
export type PublicProduct = Omit<Product, "costPrice">;

export type FilterMode = "all" | "inStock" | "soldOut";

/** Shape of a completed form. */
export interface ProductFormData {
  name: string;
  price: string; // inputs always give strings; converted with parseFloat on submit
  inStock: boolean;
  onSale: boolean;
}

/** A form that is still being filled in: every field is optional. */
export type ProductDraft = Partial<ProductFormData>;

/** Inline validation messages, keyed by the fields that get validated. */
export type FormErrors = Partial<Record<"name" | "price", string>>;