import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import RecentlyViewed from "@/components/RecentlyViewed";
import ReviewForm from "@/components/ReviewForm";
import Stars from "@/components/Stars";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { getCategory, getCurrentUser, getProduct, getProducts, getReviews } from "@/lib/queries";
import { dateFmt, money, SITE_URL } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { toCard } from "@/lib/types";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.description, openGraph: { title: p.name, description: p.description } } : { title: "Not found" };
}

export default async function ProductPage({ params }: Params) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const [related, reviews, user, category] = await Promise.all([
    getProducts({ category: p.category?.slug, limit: 5 }).then((r) => r.filter((x) => x.id !== p.id).slice(0, 4)),
    getReviews(p.id),
    getCurrentUser(),
    getCategory(p.category?.slug),
  ]);
  const images = p.gallery?.length ? p.gallery : p.image_url ? [p.image_url] : [];
  const sale = p.compare_at_cents && p.compare_at_cents > p.price_cents;
  const hist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));
  const card = toCard(p);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    url: `${SITE_URL}/products/${p.slug}`, category: p.category?.name,
    offers: { "@type": "Offer", priceCurrency: "MYR", price: (p.price_cents / 100).toFixed(2), availability: `https://schema.org/${p.stock > 0 ? "InStock" : "OutOfStock"}` },
    ...(p.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.avg.toFixed(1), reviewCount: p.rating.count } } : {}),
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="text-sm font-semibold opacity-60" aria-label="Breadcrumb">
        <Link href="/products" className="hover:underline">Shop</Link>
        {p.category && <> / <Link href={`/products?category=${p.category.slug}`} className="hover:underline">{p.category.name}</Link></>}
        {" / "}<span>{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="md:sticky md:top-24 md:self-start"><ProductGallery images={images} name={p.name} /></div>
        <Reveal className="md:pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {p.category && <Link href={`/products?category=${p.category.slug}`} className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">{p.category.name}</Link>}
            {p.origin && <span className="rounded-full border border-leaf/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-leaf">Origin: {p.origin}</span>}
          </div>
          <h1 className="font-display mt-4 text-5xl font-bold leading-[1] text-forest md:text-6xl">{p.name}</h1>
          {p.name_ar && <p className="font-ar mt-2 text-3xl text-gold" lang="ar" dir="rtl">{p.name_ar}</p>}
          {p.rating && (
            <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-sm font-bold hover:underline">
              <Stars value={p.rating.avg} /> {p.rating.avg.toFixed(1)} <span className="opacity-60">· {p.rating.count} reviews</span>
            </a>
          )}
          <p className="mt-5 flex flex-wrap items-baseline gap-3 text-4xl font-bold text-forest">
            {money(p.price_cents)}
            {p.unit && <span className="text-base font-bold text-ink/50">/ {p.unit}</span>}
            {sale && <><s className="text-xl font-medium opacity-45">{money(p.compare_at_cents!)}</s><span className="rounded-full bg-leaf px-3 py-1 text-sm text-white">Save {money(p.compare_at_cents! - p.price_cents)}</span></>}
          </p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">{p.description}</p>
          {p.description_ar && <p className="font-ar mt-3 max-w-lg text-right text-lg leading-loose text-ink/65" lang="ar" dir="rtl">{p.description_ar}</p>}
          <div className="mt-8 max-w-lg"><AddToCart product={card} /></div>
          <Link href={`/wholesale?product=${p.slug}`} className="mt-4 flex max-w-lg items-center justify-between rounded-2xl border border-gold/40 bg-[#fbf6ea] p-4 text-sm transition-colors hover:border-gold">
            <span><b className="text-forest">Buying in bulk?</b> <span className="text-ink/60">Cartons, bags & private label – request samples and a quote.</span></span>
            <span className="font-bold text-gold">→</span>
          </Link>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-2 text-center text-xs font-bold">
            {[["🌾", "Direct from farmers"], ["⚖️", "Sorted & graded"], ["📦", "Bulk packing available"]].map(([e, t]) => (
              <div key={t} className="rounded-2xl border border-ink/10 bg-white/60 p-3"><div className="text-xl">{e}</div>{t}</div>
            ))}
          </div>

          <div className="mt-8 max-w-lg divide-y-2 divide-ink/10 border-y-2 border-ink/10">
            {[
              ["Origin", `${p.origin ?? "Afghanistan"}. Sourced directly from growers in Afghanistan’s key growing zones – no middlemen, full traceability.`],
              ["Grades & packaging", `Retail pack shown${p.unit ? ` (${p.unit})` : ""}. Different grades, qualities and packaging options are available – cartons or bags in the sizes you need, with private labelling. Specifications and minimum order quantities on request.`],
              ...(category?.notes ?? []).map((n) => [n.title, n.body]),
            ].map(([t, body], i) => (
              <details key={t} open={i === 0} className="group py-4">
                <summary className="flex items-center justify-between font-display text-xl font-bold">{t}<span className="chev inline-block text-2xl transition-transform">+</span></summary>
                <p className="mt-2 text-sm leading-relaxed opacity-75">{body}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>

      <section id="reviews" className="mt-24 scroll-mt-24">
        <Reveal><h2 className="font-display text-4xl font-bold md:text-5xl">Reviews</h2></Reveal>
        <div className="mt-8 grid gap-10 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <div className="card p-6">
              <p className="font-display text-6xl font-bold">{p.rating ? p.rating.avg.toFixed(1) : "–"}</p>
              {p.rating && <Stars value={p.rating.avg} size={20} />}
              <p className="mt-1 text-sm opacity-60">{reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
              <div className="mt-4 space-y-1.5">
                {hist.map(({ n, c }) => (
                  <div key={n} className="flex items-center gap-2 text-xs font-bold">
                    <span className="w-3">{n}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-[#ffb800]" style={{ width: `${reviews.length ? (c / reviews.length) * 100 : 0}%` }} /></div>
                    <span className="w-4 text-right opacity-60">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <p className="font-display text-xl font-bold">Write a review</p>
              <div className="mt-3">
                {user ? <ReviewForm productId={p.id} slug={p.slug} />
                  : isSupabaseConfigured ? <Link href={`/login?next=/products/${p.slug}`} className="btn btn-dark">Sign in to review</Link>
                  : <p className="text-sm opacity-60">Connect Supabase to collect reviews.</p>}
              </div>
            </div>
          </div>
          <RevealGroup className="space-y-4">
            {reviews.length === 0 && <p className="card p-8 text-center font-semibold opacity-70">No reviews yet – be the first!</p>}
            {reviews.map((r) => (
              <article key={r.id} className="card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Stars value={r.rating} />
                  <span className="text-xs font-semibold opacity-50">{dateFmt(r.created_at)}</span>
                </div>
                {r.title && <h3 className="font-display mt-2 text-xl font-bold">{r.title}</h3>}
                <p className="mt-1 opacity-80">{r.body}</p>
                <p className="mt-3 flex items-center gap-2 text-sm font-bold">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs text-cream">{r.author_name[0]}</span>
                  {r.author_name}
                </p>
              </article>
            ))}
          </RevealGroup>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-24">
          <Reveal><h2 className="font-display text-4xl font-bold">You might also like</h2></Reveal>
          <RevealGroup className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</RevealGroup>
        </section>
      )}

      <RecentlyViewed current={card} />
    </div>
  );
}
