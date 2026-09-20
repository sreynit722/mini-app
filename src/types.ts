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

// 2. Derive instead of repeat: strip the internal field via Omit.
/** Subset of Product safe to pass to UI components (hides costPrice). */
export type PublicProduct = Omit<Product, "costPrice">;

export type FilterMode = "all" | "inStock" | "soldOut";

// 3. Derive instead of repeat: form draft = all Product fields the form
//    touches, made optional via Partial, with price kept as a string
//    (raw text-field value) via an override intersection.
export type ProductFormData = Partial<Pick<Product, "name" | "inStock" | "onSale">> & {
  /** Raw string from the price <input> — converted to number on submit. */
  price: string;
};

/** Alias that signals intent: a saved-but-not-yet-submitted draft. */
export type FormDraft = ProductFormData;

// 4. Derive error keys from the form type so they never drift.
export type FormErrors = Partial<Record<keyof ProductFormData, string>>;