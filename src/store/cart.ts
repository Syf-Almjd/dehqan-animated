"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CardProduct } from "@/lib/types";

export type CartItem = Pick<CardProduct, "id" | "slug" | "name" | "price_cents" | "art_kind" | "color" | "image_url" | "stock"> & { qty: number };

type CartState = {
  items: CartItem[];
  coupon: string | null;
  add: (p: CardProduct, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      add: (p, qty = 1) =>
        set((s) => {
          const found = s.items.find((i) => i.id === p.id);
          if (found) return { items: s.items.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, p.stock, 50) } : i)) };
          const { id, slug, name, price_cents, art_kind, color, image_url, stock } = p;
          return { items: [...s.items, { id, slug, name, price_cents, art_kind, color, image_url, stock, qty: Math.min(qty, stock, 50) }] };
        }),
      setQty: (id, qty) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock, 50)) } : i)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [], coupon: null }),
      setCoupon: (coupon) => set({ coupon }),
    }),
    { name: "fizzo-cart" },
  ),
);

export const cartSubtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.price_cents * i.qty, 0);
export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
