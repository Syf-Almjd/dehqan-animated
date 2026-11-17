"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/store/wishlist";
import { useMounted } from "@/lib/useMounted";

export default function Wishlist() {
  const items = useWishlist((s) => s.items);
  const mounted = useMounted();
  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="font-display text-6xl font-bold md:text-7xl">Wishlist <span className="text-leaf">♥</span></h1>
      <p className="mt-2 opacity-65">Saved on this device. Tap the heart on any product to add it here.</p>
      {mounted && items.length === 0 ? (
        <div className="card mt-10 p-12 text-center">
          <p className="text-5xl">💔</p>
          <p className="font-display mt-3 text-3xl font-bold">Nothing saved yet</p>
          <Link href="/products" className="btn btn-primary mt-6">Find something you love</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{mounted && items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}
