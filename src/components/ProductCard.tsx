import Link from "next/link";
import ProductVisual from "./ProductVisual";
import Tilt from "./Tilt";
import Stars from "./Stars";
import HeartButton from "./HeartButton";
import QuickAdd from "./QuickAdd";
import { money } from "@/lib/format";
import { toCard, type CardProduct } from "@/lib/types";

export default function ProductCard({ p: full }: { p: CardProduct }) {
  const p = toCard(full);
  const sale = p.compare_at_cents && p.compare_at_cents > p.price_cents;
  const pct = sale ? Math.round((1 - p.price_cents / p.compare_at_cents!) * 100) : 0;
  const href = `/products/${p.slug}`;
  return (
    <Tilt className="h-full">
      <div data-card className="group card relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[8px_10px_0_var(--ink)]">
        <div className="relative">
          <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
            <ProductVisual p={p} className="aspect-[4/5] border-b-2 border-ink" />
          </Link>
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {p.stock === 0 ? <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">SOLD OUT</span>
              : sale ? <span className="rounded-full bg-fizz px-3 py-1 text-xs font-bold text-white">−{pct}%</span> : null}
            {p.stock > 0 && p.stock <= 30 && <span className="rounded-full bg-lemon px-3 py-1 text-xs font-bold">Only {p.stock} left</span>}
          </div>
          <HeartButton p={p} className="absolute right-3 top-3 z-20" />
          <QuickAdd p={p} className="absolute inset-x-3 bottom-3 z-20" />
        </div>
        <Link href={href} className="flex flex-1 flex-col p-4">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-55">{p.category?.name ?? "Fizzo"}</p>
          <h3 className="font-display mt-1 text-lg font-bold leading-tight">{p.name}</h3>
          {p.rating && <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold"><Stars value={p.rating.avg} size={13} /> <span className="opacity-60">({p.rating.count})</span></p>}
          <p className="mt-auto flex items-baseline gap-2 pt-2 font-bold">
            {money(p.price_cents)}
            {sale && <s className="text-sm font-medium opacity-45">{money(p.compare_at_cents!)}</s>}
          </p>
        </Link>
      </div>
    </Tilt>
  );
}
