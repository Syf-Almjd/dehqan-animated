"use client";
import { useEffect } from "react";
import ProductCard from "./ProductCard";
import { useRecent } from "@/store/wishlist";
import { useMounted } from "@/lib/useMounted";
import type { CardProduct } from "@/lib/types";

export default function RecentlyViewed({ current }: { current: CardProduct }) {
  const mounted = useMounted();
  const items = useRecent((s) => s.items);
  const push = useRecent((s) => s.push);
  useEffect(() => { push(current); }, [current, push]);
  const others = items.filter((i) => i.id !== current.id).slice(0, 4);
  if (!mounted || others.length === 0) return null;
  return (
    <section className="mt-24">
      <h2 className="font-display text-4xl font-bold">Recently viewed</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{others.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </section>
  );
}
