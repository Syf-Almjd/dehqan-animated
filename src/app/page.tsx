import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Tilt from "@/components/Tilt";
import ProductCard from "@/components/ProductCard";
import ReviewMarquee from "@/components/ReviewMarquee";
import Newsletter from "@/components/Newsletter";
import Magnetic from "@/components/Magnetic";
import SectionHeading from "@/components/SectionHeading";
import SpecCards from "@/components/SpecCards";
import StepsAndPackaging from "@/components/StepsAndPackaging";
import { Reveal, RevealGroup, ScrubZoom } from "@/components/Reveal";
import { getCategories, getProducts, getRatings, getReviews } from "@/lib/queries";
import { ABOUT, PILLARS, REGIONS, SAFFRON_SPECS } from "@/lib/content";
import { BRAND } from "@/lib/data";

export default async function Home() {
  const [featured, categories, reviews, ratings] = await Promise.all([
    getProducts({ featured: true, limit: 8 }), getCategories(), getReviews(undefined, 16), getRatings(),
  ]);
  const all = Object.values(ratings);
  const count = all.reduce((n, r) => n + r.count, 0);
  const avg = count ? all.reduce((n, r) => n + r.avg * r.count, 0) / count : 0;

  return (
    <>
      <Hero rating={count ? { avg, count } : undefined} />

      {/* Horizontal ticker-tape sentence */}
      <Ticker />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 pt-24">
        <SectionHeading kicker="The harvest" kicker_ar="الحصاد" title="Explore our produce" title_ar="تسوّق منتجاتنا"
          sub="Six families of Afghan produce, sourced farm by farm." sub_ar="ست عائلات من المنتجات الأفغانية، نوردها مزرعةً بعد مزرعة." />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Tilt key={c.id} max={8} className="h-full">
              <Link href={`/products?category=${c.slug}`} className="group relative block aspect-[4/3.3] overflow-hidden rounded-[24px] bg-forest">
                {c.image_url && <Image src={c.image_url} alt={c.name} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110" />}
                <span className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
                <span className="font-display absolute right-5 top-3 text-6xl font-bold text-cream/25">0{i + 1}</span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="eyebrow !text-[.62rem]">{c.kicker}</p>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-3xl font-bold">{c.name}</h3>
                    <span className="font-ar text-2xl text-gold" lang="ar">{c.name_ar}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-cream/75">{c.description}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-gold transition-transform duration-300 group-hover:translate-x-1">Shop {c.name} →</span>
                </div>
              </Link>
            </Tilt>
          ))}
        </RevealGroup>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 pt-28">
        <SectionHeading kicker="Hand-selected" kicker_ar="منتقاة بعناية" title="Harvest favourites" title_ar="المفضّلة من الحصاد" />
        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </RevealGroup>
        <Reveal className="mt-10 text-center"><Link href="/products" className="btn btn-ghost">View all products →</Link></Reveal>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-5 pt-28">
        <SectionHeading kicker={ABOUT.kicker} kicker_ar={ABOUT.kicker_ar} title={ABOUT.title} title_ar={ABOUT.title_ar} sub={ABOUT.sub} sub_ar={ABOUT.sub_ar} />
        <ScrubZoom className="relative mt-10 aspect-[21/8] overflow-hidden rounded-[28px]">
          <Image src="/products/about-raisins.jpg" alt="Kandahar raisins in a farmer’s hand" fill sizes="100vw" className="object-cover" />
        </ScrubZoom>
        <Reveal className="mt-10 grid gap-8 md:grid-cols-2 md:divide-x md:divide-ink/10">
          <p className="text-lg leading-relaxed text-ink/80">{ABOUT.body}</p>
          <p className="font-ar text-right text-lg leading-loose text-ink/75 md:pl-8" lang="ar" dir="rtl">{ABOUT.body_ar}</p>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 md:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.n} className="card card-lift flex gap-5 p-6">
              <span className="font-display text-5xl font-bold text-gold">{p.n}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-forest">{p.title}</h3>
                  <span className="font-ar text-xl text-leaf" lang="ar">{p.title_ar}</span>
                </div>
                <p className="mt-2 text-sm text-ink/70">{p.body}</p>
                <p className="font-ar mt-1 text-right text-sm leading-loose text-ink/60" lang="ar" dir="rtl">{p.body_ar}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
        <Reveal className="grain mt-4 grid gap-6 rounded-[24px] bg-forest p-8 text-cream md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-bold text-gold">{ABOUT.network.title}</h3>
            <p className="mt-2 text-cream/75">{ABOUT.network.body}</p>
          </div>
          <div className="text-right" lang="ar" dir="rtl">
            <h3 className="font-ar text-2xl text-gold">{ABOUT.network.title_ar}</h3>
            <p className="font-ar mt-2 leading-loose text-cream/70">{ABOUT.network.body_ar}</p>
          </div>
        </Reveal>
      </section>

      {/* Saffron spotlight */}
      <section className="grain mt-28 overflow-hidden bg-[#3b0d0a] py-24 text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Herat · Red gold <span className="font-ar tracking-normal" lang="ar">· هرات · الذهب الأحمر</span></p>
            <h2 className="font-display mt-3 text-5xl font-bold md:text-7xl">Saffron <span className="font-ar text-gold" lang="ar">الزعفران</span></h2>
            <span className="gold-rule mt-4" />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/80">Grade A+, 100% handpicked saffron threads from Herat, known worldwide as red gold. Picked by hand, flower by flower, on family farms – ideal for rice dishes, desserts, tea and drinks.</p>
            <p className="font-ar mt-3 max-w-lg text-lg leading-loose text-cream/60" lang="ar" dir="rtl">زعفران من الدرجة +A مقطوف يدوياً بنسبة 100% من هرات، يُعرف عالمياً بالذهب الأحمر.</p>
            <div className="mt-8"><SpecCards specs={SAFFRON_SPECS} light /></div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic><Link href="/products/herati-saffron" className="btn btn-gold">Shop Herati saffron →</Link></Magnetic>
              <p className="self-center text-xs text-cream/50">Retail packs (1 g). Bulk and custom packing on request.</p>
            </div>
          </Reveal>
          <div className="relative grid grid-cols-2 gap-5" style={{ perspective: 1200 }}>
            {["/products/saffron-front.jpg", "/products/saffron-back.jpg"].map((src, i) => (
              <Tilt key={src} max={14}>
                <Reveal delay={i * 0.15} className={`relative aspect-[3/4.4] overflow-hidden rounded-[18px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] ${i ? "mt-14" : ""}`}>
                  <Image src={src} alt={i ? "Herati saffron pack – back" : "Herati saffron pack – front"} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                </Reveal>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* Mountain honey + Shilajit */}
      <section className="mx-auto max-w-7xl px-5 pt-28">
        <SectionHeading kicker="Badakhshan & Takhar" kicker_ar="بدخشان وتخار" title="From the high mountains" title_ar="من الجبال العالية"
          sub="Pure honey from remote alpine meadows, and Shilajit collected from rocky Hindu Kush slopes." sub_ar="عسل صافٍ من المروج الجبلية النائية، وشيلاجيت يُجمع من سفوح الهندوكوش الصخرية." />
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="card overflow-hidden">
            <div className="grid grid-cols-3 gap-1.5 p-1.5">
              {["honey-amber", "honey-golden", "honey-dark"].map((h) => (
                <div key={h} className="group relative aspect-[3/4.3] overflow-hidden rounded-[16px]">
                  <Image src={`/products/${h}.jpg`} alt="Mountain honey jar" fill sizes="(min-width:1024px) 18vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-3xl font-bold text-forest">Mountain Honey</h3>
                <span className="font-ar text-2xl text-gold" lang="ar">العسل الجبلي</span>
              </div>
              <p className="mt-2 text-ink/70">Thick, aromatic and naturally harvested, with the character of the wild alpine flowers on which the bees feed. Colour, aroma and texture vary naturally with each harvest.</p>
              <Link href="/products/badakhshan-mountain-honey" className="btn btn-primary mt-5">Shop mountain honey →</Link>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="grain relative overflow-hidden rounded-[22px] bg-[#1b1714] text-cream">
            <div className="relative aspect-[4/3.2]">
              <Image src="/products/shilajit.jpg" alt="Badakhshan Shilajit" fill sizes="(min-width:1024px) 35vw, 100vw" className="object-cover opacity-90" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#1b1714] to-transparent" />
            </div>
            <div className="relative -mt-10 p-6">
              <p className="eyebrow">Mountain resin · <span className="font-ar tracking-normal" lang="ar">راتنج الجبال</span></p>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-3xl font-bold">Shilajit</h3>
                <span className="font-ar text-2xl text-gold" lang="ar">الشيلاجيت</span>
              </div>
              <p className="mt-2 text-cream/70">Pure Shilajit of Badakhshan, known locally as Mumiyai – valued for its deep black colour and dense, firm consistency.</p>
              <Link href="/products/badakhshan-shilajit" className="btn btn-gold mt-5">Discover Shilajit →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Regions */}
      <section className="mx-auto max-w-7xl px-5 pt-28">
        <SectionHeading kicker="Where it grows" kicker_ar="مناطق الزراعة" title="Afghanistan’s key growing zones" title_ar="أهم مناطق الزراعة" />
        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <Link key={r.name} href={r.href} className="group relative block aspect-[3/4] overflow-hidden rounded-[22px]">
              <Image src={r.img} alt={r.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-[1100ms] group-hover:scale-110" />
              <span className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
                <p className="font-ar text-xl text-gold" lang="ar">{r.name_ar}</p>
                <h3 className="font-display text-3xl font-bold">{r.name}</h3>
                <p className="mt-1 text-sm text-cream/75">{r.what}</p>
              </div>
            </Link>
          ))}
        </RevealGroup>
      </section>

      {reviews.length > 0 && (
        <section className="pt-28">
          <div className="mx-auto max-w-7xl px-5"><SectionHeading title="What buyers say" title_ar="آراء عملائنا" /></div>
          <div className="mt-8"><ReviewMarquee reviews={reviews} /></div>
        </section>
      )}

      {/* Wholesale */}
      <section className="grain mt-28 bg-forest py-24 text-cream">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading light kicker="Order & contact" kicker_ar="الطلب والتواصل" title="Buying wholesale?" title_ar="الطلب والتواصل"
            sub="Simple ordering and flexible packaging, tailored to your needs." sub_ar="طلب بسيط وخيارات تعبئة مرنة تناسب احتياجاتكم." />
          <div className="mt-12"><StepsAndPackaging light /></div>
          <Reveal className="mt-10 flex flex-wrap gap-3">
            <Magnetic><Link href="/wholesale" className="btn btn-gold">Request a quote →</Link></Magnetic>
            <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="btn border-cream/30 text-cream hover:border-gold">WhatsApp {BRAND.phone}</a>
            <a href={BRAND.catalogue} download className="btn border-cream/30 text-cream hover:border-gold">↓ Export catalogue (PDF)</a>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-24"><Reveal><Newsletter /></Reveal></section>
    </>
  );
}
