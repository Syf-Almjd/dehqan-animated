import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { CloseIcon, SearchIcon } from "@/components/Icons";
import { getCategories, getProducts, PRICE_BANDS, type PriceBand, type Sort } from "@/lib/queries";
import type { Category } from "@/lib/types";

export const metadata = { title: "Shop" };

type SP = { category?: string; q?: string; sort?: Sort; price?: PriceBand; stock?: string; sale?: string };

const clean = (sp: SP) => Object.fromEntries(Object.entries(sp).filter(([, v]) => v)) as Record<string, string>;
const href = (sp: SP, over: Partial<SP>) => {
  const p = new URLSearchParams(clean({ ...sp, ...over }));
  return `/products${p.size ? `?${p}` : ""}`;
};

function Filters({ sp, categories }: { sp: SP; categories: Category[] }) {
  const item = (active: boolean) =>
    `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${active ? "bg-ink text-cream" : "hover:bg-ink/5"}`;
  const toggle = (active: boolean) => (
    <span className={`relative h-5 w-9 rounded-full border-2 border-current transition-colors ${active ? "bg-lemon" : ""}`}>
      <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-current transition-all ${active ? "left-[18px]" : "left-0.5"}`} />
    </span>
  );
  return (
    <div className="space-y-6">
      <div>
        <p className="label px-3">Category</p>
        <Link href={href(sp, { category: undefined })} scroll={false} className={item(!sp.category)}>All products</Link>
        {categories.map((c) => (
          <Link key={c.id} href={href(sp, { category: sp.category === c.slug ? undefined : c.slug })} scroll={false} className={item(sp.category === c.slug)}>
            {c.name} <span className="h-3 w-3 rounded-full border-2 border-ink" style={{ background: c.color }} />
          </Link>
        ))}
      </div>
      <div>
        <p className="label px-3">Price</p>
        {PRICE_BANDS.map((b) => (
          <Link key={b.id} href={href(sp, { price: sp.price === b.id ? undefined : b.id })} scroll={false} className={item(sp.price === b.id)}>{b.label}</Link>
        ))}
      </div>
      <div>
        <p className="label px-3">Availability</p>
        <Link href={href(sp, { stock: sp.stock ? undefined : "1" })} scroll={false} className={item(false)}>In stock only {toggle(!!sp.stock)}</Link>
        <Link href={href(sp, { sale: sp.sale ? undefined : "1" })} scroll={false} className={item(false)}>On sale {toggle(!!sp.sale)}</Link>
      </div>
    </div>
  );
}

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({ category: sp.category, q: sp.q, sort: sp.sort, price: sp.price, inStock: !!sp.stock, sale: !!sp.sale }),
    getCategories(),
  ]);
  const current = categories.find((c) => c.slug === sp.category);
  const chips = [
    current && { label: current.name, over: { category: undefined } },
    sp.price && { label: PRICE_BANDS.find((b) => b.id === sp.price)?.label, over: { price: undefined } },
    sp.stock && { label: "In stock", over: { stock: undefined } },
    sp.sale && { label: "On sale", over: { sale: undefined } },
    sp.q && { label: `“${sp.q}”`, over: { q: undefined } },
  ].filter(Boolean) as { label: string; over: Partial<SP> }[];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <Reveal>
        <p className="label">{products.length} product{products.length === 1 ? "" : "s"}</p>
        <h1 className="font-display text-6xl font-extrabold md:text-8xl">{sp.sale ? "On sale" : current?.name ?? "Everything"}</h1>
        <p className="mt-2 max-w-md opacity-65">{current?.description ?? "The full Fizzo lineup – cold, bubbly and made for sharing."}</p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24"><Filters sp={sp} categories={categories} /></div></aside>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <form action="/products" className="relative flex-1 min-w-48">
              {Object.entries(clean({ ...sp, q: undefined })).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <input name="q" defaultValue={sp.q} placeholder="Search the shop…" className="input !py-2 !pl-10" aria-label="Search products" />
            </form>
            <SortSelect value={sp.sort ?? "newest"} base={clean({ ...sp, sort: undefined })} />
          </div>

          <details className="mt-3 rounded-2xl border-2 border-ink bg-white p-3 lg:hidden">
            <summary className="font-bold">Filters {chips.length > 0 && <span className="text-fizz">({chips.length})</span>}</summary>
            <div className="mt-3"><Filters sp={sp} categories={categories} /></div>
          </details>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <Link key={c.label} href={href(sp, c.over)} scroll={false} className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-lemon px-3 py-1 text-sm font-bold hover:bg-white">
                  {c.label} <CloseIcon className="h-3.5 w-3.5" />
                </Link>
              ))}
              <Link href="/products" scroll={false} className="text-sm font-bold underline">Clear all</Link>
            </div>
          )}

          {products.length === 0 ? (
            <div className="card mt-8 p-12 text-center">
              <p className="text-5xl">🫧</p>
              <p className="font-display mt-3 text-3xl font-extrabold">Nothing matched</p>
              <p className="mt-1 opacity-60">Try fewer filters or a different search.</p>
              <Link href="/products" className="btn btn-primary mt-6">Clear filters</Link>
            </div>
          ) : (
            <RevealGroup key={JSON.stringify(sp)} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </RevealGroup>
          )}
        </div>
      </div>
    </div>
  );
}
