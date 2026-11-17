"use client";
import { useRouter } from "next/navigation";

export default function SortSelect({ value, base }: { value: string; base: Record<string, string> }) {
  const router = useRouter();
  return (
    <select
      aria-label="Sort products"
      value={value}
      onChange={(e) => {
        const p = new URLSearchParams({ ...base, sort: e.target.value });
        if (e.target.value === "newest") p.delete("sort");
        router.push(`/products${p.size ? `?${p}` : ""}`, { scroll: false });
      }}
      className="input !w-auto cursor-pointer !py-2 font-semibold"
    >
      <option value="newest">Newest</option>
      <option value="rating">Top rated</option>
      <option value="price-asc">Price: low → high</option>
      <option value="price-desc">Price: high → low</option>
    </select>
  );
}
