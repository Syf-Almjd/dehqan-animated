"use client";
import { create } from "zustand";

export type Toast = { id: number; text: string; tone: "ok" | "err" | "info"; href?: string; cta?: string };
type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toasts: Toast[];
  set: (p: Partial<Pick<UIState, "cartOpen" | "searchOpen" | "menuOpen">>) => void;
  toast: (text: string, opts?: Partial<Omit<Toast, "id" | "text">>) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;
export const useUI = create<UIState>()((set, get) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  toasts: [],
  set: (p) => set(p),
  toast: (text, opts) => {
    const id = nextId++;
    set({ toasts: [...get().toasts.slice(-2), { id, text, tone: "ok", ...opts }] });
    setTimeout(() => get().dismiss(id), 3200);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
