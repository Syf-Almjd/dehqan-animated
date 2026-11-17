"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toCard, type CardProduct } from "@/lib/types";

type WishState = { items: CardProduct[]; toggle: (p: CardProduct) => boolean; remove: (id: string) => void };

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (p) => {
        const has = get().items.some((i) => i.id === p.id);
        set({ items: has ? get().items.filter((i) => i.id !== p.id) : [toCard(p), ...get().items] });
        return !has;
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
    }),
    { name: "fizzo-wishlist" },
  ),
);

type RecentState = { items: CardProduct[]; push: (p: CardProduct) => void };
export const useRecent = create<RecentState>()(
  persist(
    (set, get) => ({
      items: [],
      push: (p) => set({ items: [toCard(p), ...get().items.filter((i) => i.id !== p.id)].slice(0, 9) }),
    }),
    { name: "fizzo-recent" },
  ),
);
