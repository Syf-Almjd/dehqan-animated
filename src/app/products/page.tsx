import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
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
    <span className={`relative h-5 w-9 rounded-full border-2 border-current transition-colors ${active ? "bg-gold" : ""}`}>
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
            <span>{c.name}</span> <span className="font-ar text-sm opacity-70" lang="ar">{c.name_ar}</span>
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
      {current ? (
        <Reveal className="grain relative overflow-hidden rounded-[28px] bg-forest text-cream">
          {current.image_url && <Image src={current.image_url} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />}
          <div className="relative grid gap-6 p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="eyebrow">{current.kicker}</p>
              <h1 className="font-display mt-2 text-5xl font-bold md:text-7xl">{current.name}</h1>
              <span className="gold-rule mt-4" />
              <p className="font-display mt-4 max-w-md text-lg italic text-cream/80">{current.description}</p>
            </div>
            <div className="text-right" lang="ar" dir="rtl">
              <p className="font-ar text-sm text-gold">{current.kicker_ar}</p>
              <p className="font-ar mt-1 text-5xl leading-[1.3] md:text-6xl">{current.name_ar}</p>
              <span className="gold-rule mr-0 ml-auto mt-3" />
              <p className="font-ar mr-0 ml-auto mt-4 max-w-md text-lg leading-loose text-cream/70">{current.description_ar}</p>
            </div>
          </div>
        </Reveal>
      ) : (
        <SectionHeading kicker={`${products.length} products`} kicker_ar="المتجر" title={sp.sale ? "On sale" : "The full harvest"} title_ar="جميع المنتجات"
          sub="Raisins, dried fruits, nuts, saffron, mountain honey and Shilajit – direct from Afghan farmers."
          sub_ar="زبيب وفواكه مجففة ومكسرات وزعفران وعسل جبلي وشيلاجيت – مباشرةً من المزارعين الأفغان." />
      )}

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

          <details className="mt-3 rounded-2xl border border-ink/15 bg-white p-3 lg:hidden">
            <summary className="font-bold">Filters {chips.length > 0 && <span className="text-leaf">({chips.length})</span>}</summary>
            <div className="mt-3"><Filters sp={sp} categories={categories} /></div>
          </details>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <Link key={c.label} href={href(sp, c.over)} scroll={false} className="flex items-center gap-1.5 rounded-full border border-ink/15 bg-gold px-3 py-1 text-sm font-bold hover:bg-white">
                  {c.label} <CloseIcon className="h-3.5 w-3.5" />
                </Link>
              ))}
              <Link href="/products" scroll={false} className="text-sm font-bold underline">Clear all</Link>
            </div>
          )}

          {products.length === 0 ? (
            <div className="card mt-8 p-12 text-center">
              <p className="text-5xl">🌾</p>
              <p className="font-display mt-3 text-3xl font-bold">Nothing matched</p>
              <p className="mt-1 opacity-60">Try fewer filters or a different search.</p>
              <Link href="/products" className="btn btn-primary mt-6">Clear filters</Link>
            </div>
          ) : (
            <RevealGroup key={JSON.stringify(sp)} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </RevealGroup>
          )}

          {current?.notes?.map((n) => (
            <Reveal key={n.title} className="mt-10 grid gap-6 rounded-[22px] border border-gold/30 border-l-4 border-l-gold bg-[#fbf6ea] p-6 md:grid-cols-2">
              <div><h2 className="font-display text-2xl font-bold text-forest">{n.title}</h2><p className="mt-2 text-sm leading-relaxed text-ink/70">{n.body}</p></div>
              <div className="text-right" lang="ar" dir="rtl"><h2 className="font-ar text-2xl text-leaf">{n.title_ar}</h2><p className="font-ar mt-2 text-sm leading-loose text-ink/65">{n.body_ar}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
