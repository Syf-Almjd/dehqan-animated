import Link from "next/link";
import Logo from "./Logo";
import { BRAND, demoCategories } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="grain mt-28 bg-forest text-cream">
      <div className="mx-auto max-w-7xl px-5 pt-16">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-cream/10 pb-12 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{BRAND.company} · <span className="font-ar tracking-normal" lang="ar">{BRAND.company_ar}</span></p>
            <p className="font-display mt-3 max-w-xl text-4xl font-bold leading-tight md:text-5xl">Let&apos;s bring Afghan quality to your market</p>
            <p className="font-ar mt-2 text-2xl text-gold" lang="ar" dir="rtl">لنوصل الجودة الأفغانية إلى سوقكم</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-gold">WhatsApp {BRAND.phone}</a>
            <a href={`mailto:${BRAND.email}`} className="btn border-cream/30 text-cream hover:border-gold">Email us</a>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:py-14">
        <div className="col-span-2 md:col-span-1">
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">{BRAND.intro}</p>
          <a href={BRAND.catalogue} download className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold hover:underline">↓ Download the 2026 export catalogue (PDF)</a>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow mb-3">Shop</p>
          {demoCategories.map((c) => <Link key={c.slug} className="block text-cream/80 hover:text-gold" href={`/products?category=${c.slug}`}>{c.name}</Link>)}
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow mb-3">Company</p>
          <Link className="block text-cream/80 hover:text-gold" href="/about">Our story</Link>
          <Link className="block text-cream/80 hover:text-gold" href="/wholesale">Wholesale & export</Link>
          <Link className="block text-cream/80 hover:text-gold" href="/account">My orders</Link>
          <Link className="block text-cream/80 hover:text-gold" href="/wishlist">Wishlist</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow mb-3">Contact</p>
          <a className="block break-all text-cream/80 hover:text-gold" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          <a className="block text-cream/80 hover:text-gold" href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer">{BRAND.phone} · WhatsApp / Call</a>
          <p className="pt-2 text-cream/50">Sourced from Kandahar, Herat, Badakhshan & Takhar, Afghanistan.</p>
        </div>
      </div>
      {/* Al-Aqsa Technology credit */}
      <div className="border-t border-cream/10 px-5 py-6 text-center">
        <p className="text-xs text-cream/50">© {new Date().getFullYear()} {BRAND.company} · <span className="font-ar" lang="ar">{BRAND.company_ar}</span></p>
        <p className="mt-2 text-xs text-cream/35">
          Designed &amp; developed by{" "}
          <a
            href="https://alaqsa.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-gold/70 transition-colors hover:text-gold"
          >
            Al-Aqsa Technology
          </a>
          {" "}·{" "}
          <a
            href="https://alaqsa.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cream/60"
          >
            alaqsa.tech
          </a>
          {" "}© 2026
        </p>
      </div>
    </footer>
  );
}
