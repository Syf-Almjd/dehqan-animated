import Link from "next/link";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Tilt from "@/components/Tilt";
import ProductCard from "@/components/ProductCard";
import ReviewMarquee from "@/components/ReviewMarquee";
import Newsletter from "@/components/Newsletter";
import Magnetic from "@/components/Magnetic";
import { Reveal, RevealGroup, ScrubZoom } from "@/components/Reveal";
import { getCategories, getProducts, getRatings, getReviews } from "@/lib/queries";

export default async function Home() {
  const [featured, categories, reviews, ratings, sale] = await Promise.all([
    getProducts({ featured: true, limit: 8 }), getCategories(), getReviews(undefined, 16), getRatings(), getProducts({ sale: true, limit: 4 }),
  ]);
  const all = Object.values(ratings);
  const count = all.reduce((n, r) => n + r.count, 0);
  const avg = count ? all.reduce((n, r) => n + r.avg * r.count, 0) / count : 0;

  return (
    <>
      <Hero rating={count ? { avg, count } : undefined} />

      {/* Horizontal ticker-tape sentence */}
      <Ticker />

      <section className="mx-auto max-w-7xl px-5 pt-24">
        <Reveal><h2 className="font-display text-5xl font-extrabold md:text-6xl">Pick your poison.</h2></Reveal>
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Tilt key={c.id} max={12} className="h-full">
              <Link href={`/products?category=${c.slug}`} className="group card relative flex h-full min-h-56 flex-col justify-end overflow-hidden p-6 transition-shadow hover:shadow-[6px_6px_0_var(--ink)]" style={{ background: c.color }}>
                <span className="font-display absolute right-4 top-2 text-8xl font-extrabold text-white/30 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110">0{i + 1}</span>
                <h3 className="font-display text-3xl font-extrabold leading-none text-white">{c.name}</h3>
                <p className="mt-2 text-sm font-medium text-white/85">{c.description}</p>
                <span className="mt-4 text-sm font-bold text-white transition-transform group-hover:translate-x-1">Shop now →</span>
              </Link>
            </Tilt>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-24">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="font-display text-5xl font-extrabold md:text-6xl">Crowd favourites</h2>
          <Link href="/products?sort=rating" className="nav-link hidden font-bold sm:block">View all →</Link>
        </Reveal>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </RevealGroup>
      </section>

      {reviews.length > 0 && (
        <section className="pt-24">
          <Reveal className="mx-auto max-w-7xl px-5">
            <h2 className="font-display text-5xl font-extrabold md:text-6xl">People can&apos;t stop sipping.</h2>
          </Reveal>
          <div className="mt-8"><ReviewMarquee reviews={reviews} /></div>
        </section>
      )}

      {sale.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-24">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-5xl font-extrabold md:text-6xl"><span className="text-fizz">On sale</span> right now</h2>
            <Link href="/products?sale=1" className="nav-link hidden font-bold sm:block">All deals →</Link>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {sale.map((p) => <ProductCard key={p.id} p={p} />)}
          </RevealGroup>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pt-24">
        <RevealGroup className="grid gap-4 md:grid-cols-3">
          {[
            ["🚚", "Free shipping", "On every order over $50. Flat $5 below that."],
            ["🧊", "Always fresh", "Packed cold and shipped fast, so it arrives fizzing."],
            ["💛", "Love it or swap it", "30-day happiness guarantee on everything."],
          ].map(([e, t, d]) => (
            <div key={t} className="card p-7">
              <div className="text-4xl">{e}</div>
              <h3 className="font-display mt-4 text-2xl font-extrabold">{t}</h3>
              <p className="mt-1 opacity-70">{d}</p>
            </div>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-24"><Reveal><Newsletter /></Reveal></section>

      <section className="mx-auto max-w-7xl px-5 pt-16">
        <ScrubZoom className="card relative overflow-hidden bg-fizz p-10 text-center text-white md:p-20">
          <h2 className="font-display text-5xl font-extrabold leading-[.95] md:text-7xl">Bring everyone<br />Together.</h2>
          <Magnetic><Link href="/products?category=gifts" className="btn mt-8 bg-cream text-ink">Build a gift box →</Link></Magnetic>
        </ScrubZoom>
      </section>
    </>
  );
}
