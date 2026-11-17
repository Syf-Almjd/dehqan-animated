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
    <Tilt className="h-full" max={7}>
      <div data-card className="group card card-lift relative flex h-full flex-col overflow-hidden">
        <div className="relative">
          <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
            <ProductVisual p={p} className="aspect-[4/3.6]" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {p.stock === 0 ? <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">Sold out</span>
              : sale ? <span className="rounded-full bg-saffron px-3 py-1 text-xs font-bold text-white">−{pct}%</span> : null}
            {p.origin && <span className="rounded-full bg-cream/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-leaf backdrop-blur">{p.origin}</span>}
          </div>
          <HeartButton p={p} className="absolute right-3 top-3 z-20" />
          <QuickAdd p={p} className="absolute inset-x-3 bottom-3 z-20" />
        </div>
        <Link href={href} className="flex flex-1 flex-col p-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="eyebrow !text-[.62rem]">{p.category?.name ?? "Dehqan Farms"}</p>
            {p.unit && <p className="text-[11px] font-bold text-ink/50">{p.unit}</p>}
          </div>
          <h3 className="font-display mt-1.5 text-lg font-bold leading-tight text-forest">{p.name}</h3>
          {p.name_ar && <p className="font-ar mt-0.5 text-right text-base text-gold" lang="ar" dir="rtl">{p.name_ar}</p>}
          {p.rating && <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold"><Stars value={p.rating.avg} size={13} /> <span className="opacity-60">({p.rating.count})</span></p>}
          <p className="mt-auto flex items-baseline gap-2 pt-3 text-lg font-bold text-forest">
            {money(p.price_cents)}
            {sale && <s className="text-sm font-medium opacity-45">{money(p.compare_at_cents!)}</s>}
          </p>
        </Link>
      </div>
    </Tilt>
  );
}
