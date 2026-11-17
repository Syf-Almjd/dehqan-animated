import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, ScrubZoom } from "@/components/Reveal";
import { ABOUT, PILLARS, REGIONS } from "@/lib/content";
import { BRAND } from "@/lib/data";

export const metadata = { title: "Our story", description: ABOUT.sub };

export default function About() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-forest text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{BRAND.company} · <span className="font-ar tracking-normal" lang="ar">{BRAND.company_ar}</span></p>
            <h1 className="font-display mt-3 text-6xl font-bold md:text-8xl">{BRAND.tagline}</h1>
            <p className="font-ar mt-2 text-4xl text-gold" lang="ar">{BRAND.tagline_ar}</p>
            <p className="mt-6 max-w-lg text-lg text-cream/80">{BRAND.intro}</p>
          </Reveal>
          <div className="grid grid-cols-3 gap-3">
            {["/products/cover-raisins.jpg", "/products/cover-string-figs.jpg", "/products/cover-mulberries.jpg"].map((src, i) => (
              <Reveal key={src} delay={i * 0.1} className={`relative aspect-[3/5] overflow-hidden rounded-t-full rounded-b-2xl border border-gold/60 ${i === 1 ? "-mt-8" : "mt-6"}`}>
                <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <SectionHeading kicker={ABOUT.kicker} kicker_ar={ABOUT.kicker_ar} title={ABOUT.title} title_ar={ABOUT.title_ar} sub={ABOUT.sub} sub_ar={ABOUT.sub_ar} />
        <ScrubZoom className="relative mt-10 aspect-[21/8] overflow-hidden rounded-[28px]">
          <Image src="/products/about-raisins.jpg" alt="Kandahar raisins" fill sizes="100vw" className="object-cover" />
        </ScrubZoom>
        <Reveal className="mt-10 grid gap-8 md:grid-cols-2 md:divide-x md:divide-ink/10">
          <p className="text-lg leading-relaxed text-ink/80">{ABOUT.body}</p>
          <p className="font-ar text-right text-lg leading-loose text-ink/75 md:pl-8" lang="ar" dir="rtl">{ABOUT.body_ar}</p>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-4 md:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.n} className="card flex gap-5 p-6">
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
          <div><h3 className="font-display text-2xl font-bold text-gold">{ABOUT.network.title}</h3><p className="mt-2 text-cream/75">{ABOUT.network.body}</p></div>
          <div className="text-right" lang="ar" dir="rtl"><h3 className="font-ar text-2xl text-gold">{ABOUT.network.title_ar}</h3><p className="font-ar mt-2 leading-loose text-cream/70">{ABOUT.network.body_ar}</p></div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <SectionHeading kicker="Where it grows" kicker_ar="مناطق الزراعة" title="Our growing regions" title_ar="مناطق الزراعة" />
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <Link key={r.name} href={r.href} className="group card overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden"><Image src={r.img} alt={r.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" /></div>
              <div className="p-5">
                <div className="flex items-baseline justify-between"><h3 className="font-display text-2xl font-bold text-forest">{r.name}</h3><span className="font-ar text-xl text-gold" lang="ar">{r.name_ar}</span></div>
                <p className="mt-1 text-sm text-ink/70">{r.what}</p>
                <p className="font-ar text-right text-sm text-ink/55" lang="ar">{r.what_ar}</p>
              </div>
            </Link>
          ))}
        </RevealGroup>
        <Reveal className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn btn-primary">Shop the harvest →</Link>
          <Link href="/wholesale" className="btn btn-ghost">Wholesale & export</Link>
        </Reveal>
      </section>
    </>
  );
}
