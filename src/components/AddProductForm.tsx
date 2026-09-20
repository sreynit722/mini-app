// src/components/AddProductForm.tsx
import React, { useState } from "react";
import type { Product, ProductFormData, FormDraft, FormErrors } from "../types";

interface AddProductFormProps {
  /** Called with the fully-typed new Product when the form submits cleanly */
  onAdd: (product: Product) => void;
  /** Called when the user cancels or the form closes */
  onClose: () => void;
  /** Image to assign to newly created products */
  defaultImage: string;
}

// FormDraft signals this is a work-in-progress — not yet a full Product.
const EMPTY_FORM: FormDraft = {
  name: "",
  price: "",
  inStock: true,
  onSale: false,
};

export function AddProductForm({ onAdd, onClose, defaultImage }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errors: FormErrors = {};

    // ?. guards the optional Partial field; ?? '' ensures trim() never throws.
    const trimmedName = formData.name?.trim() ?? "";
    if (!trimmedName) {
      errors.name = "Product name is required.";
    } else if (trimmedName.length < 2) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validate()) return;

    const newProduct: Product = {
      id: Date.now(),
      // ?. + ??: Partial fields may be undefined — fall back to safe defaults.
      name: formData.name?.trim() ?? "",
      price: parseFloat(formData.price),
      costPrice: 0, // placeholder — operator sets actual cost price separately
      image: defaultImage,
      inStock: formData.inStock ?? true,
      onSale: formData.onSale ?? false,
    };

    onAdd(newProduct);
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const handleCancel = (): void => {
    setFormErrors({});
    onClose();
  };

  return (
    <section
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm"
      aria-label="Add New Product Form"
    >
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Add New Product
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Enter product details — TypeScript validates every field.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          {/* Name */}
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
              value={formData.name ?? ""}
              onChange={handleChange}
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

          {/* Price */}
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
              onChange={handleChange}
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

        {/* Checkboxes */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock ?? true}
              onChange={handleChange}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600"
            />
            <span>In Stock</span>
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              name="onSale"
              checked={formData.onSale ?? false}
              onChange={handleChange}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600"
            />
            <span>On Sale</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            onClick={handleCancel}
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
  );
}