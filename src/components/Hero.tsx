"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "./Magnetic";
import Stars from "./Stars";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { BRAND } from "@/lib/data";

const MARQUEE: [string, string][] = [
  ["Kandahar Raisins", "زبيب قندهار"], ["Dried Fruits", "الفواكه المجففة"], ["Nuts", "المكسرات"],
  ["Saffron", "الزعفران"], ["Mountain Honey", "عسل الجبال"], ["Shilajit", "الشيلاجيت"],
];

// The three arched photos from the catalogue cover. depth = how far forward in 3D space it sits.
const ARCHES = [
  { src: "/products/cover-raisins.jpg", alt: "Kandahar green raisins", depth: 0.5, cls: "left-0 top-[14%] w-[30%] h-[72%]", spin: -14 },
  { src: "/products/cover-string-figs.jpg", alt: "Traditional string figs", depth: 1, cls: "left-[33%] top-0 w-[34%] h-[88%]", spin: 0 },
  { src: "/products/cover-mulberries.jpg", alt: "Dried mulberries", depth: 0.5, cls: "right-0 top-[14%] w-[30%] h-[72%]", spin: 14 },
];

export default function Hero({ rating }: { rating?: { avg: number; count: number } }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(root.current, { visibility: "visible" });
      gsap.utils.toArray<HTMLElement>("[data-arch-inner]").forEach((el, i) => gsap.set(el, { z: ARCHES[i].depth * 90 }));

      // 1. Entrance — arches rise from below with a clip reveal, title lines flip up.
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .from("[data-arch-intro]", { yPercent: 40, rotationX: -35, rotationZ: (i) => ARCHES[i].spin, opacity: 0, duration: 1.7, stagger: 0.12 }, 0)
        .from("[data-arch-img]", { scale: 1.5, duration: 2.2, stagger: 0.12 }, 0)
        .from("[data-line]", { yPercent: 115, rotationX: -70, transformOrigin: "50% 100% -40px", duration: 1.3, stagger: 0.1 }, 0.25)
        .from("[data-hero-fade]", { y: 26, opacity: 0, duration: 1, stagger: 0.07 }, 0.6)
        .from("[data-rule]", { scaleX: 0, duration: 1.2 }, 0.7);

      // 2. Mouse parallax — the arch stage tilts in 3D, each arch shifts by its depth.
      let onMove: ((e: PointerEvent) => void) | undefined;
      if (window.matchMedia("(pointer: fine)").matches) {
        const rx = gsap.quickTo(stage.current, "rotationX", { duration: 1, ease: "power3" });
        const ry = gsap.quickTo(stage.current, "rotationY", { duration: 1, ease: "power3" });
        const items = gsap.utils.toArray<HTMLElement>("[data-arch-inner]").map((el, i) => ({
          x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" }),
          d: ARCHES[i].depth,
        }));
        onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
          rx(-ny * 12); ry(nx * 16);
          items.forEach((it) => { it.x(nx * 40 * it.d); it.y(ny * 30 * it.d); });
        };
        window.addEventListener("pointermove", onMove);
      }

      // 3. Scroll away — copy drifts up, side arches swing open like doors, centre arch pushes toward you.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } })
        .to("[data-hero-copy]", { yPercent: -30, opacity: 0.15, ease: "none" }, 0)
        .to("[data-arch]", {
          x: (i) => (i - 1) * 160, rotationY: (i) => (i - 1) * -40, z: (i) => (i === 1 ? 220 : -120), y: -60, ease: "none",
        }, 0);

      return () => onMove && window.removeEventListener("pointermove", onMove);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-hero className="grain relative overflow-hidden bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div data-hero-copy className="order-2 lg:order-1">
          <p data-hero-fade className="eyebrow">{BRAND.company} · Export catalogue 2026</p>
          <h1 className="mt-5" style={{ perspective: 800 }}>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-line className="font-display block text-[clamp(3.4rem,8.5vw,7.5rem)] font-bold leading-[.95]">
                <span className="text-gold">Dehqan</span> Farms
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-line className="font-ar block text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.35]" lang="ar" dir="rtl" style={{ textAlign: "left" }}>
                <span className="text-gold">دهقان</span> فارمز
              </span>
            </span>
          </h1>
          <div data-hero-fade className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span data-rule className="h-px w-16 origin-left bg-gold" />
            <span className="text-gold">◆</span>
            <p className="font-display text-xl italic">{BRAND.tagline}</p>
            <p className="font-ar text-xl text-gold" lang="ar">{BRAND.tagline_ar}</p>
          </div>
          <p data-hero-fade className="mt-6 max-w-lg text-lg leading-relaxed text-cream/80">{BRAND.intro}</p>
          <p data-hero-fade className="font-ar mt-3 max-w-lg text-lg leading-loose text-cream/60" lang="ar" dir="rtl">{BRAND.intro_ar}</p>
          <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
            <Magnetic><Link href="/products" className="btn btn-gold">Shop the harvest →</Link></Magnetic>
            <Magnetic><Link href="/wholesale" className="btn border-cream/30 text-cream hover:border-gold hover:bg-cream/5">Wholesale & export</Link></Magnetic>
          </div>
          {rating && (
            <p data-hero-fade className="mt-7 flex items-center gap-2 text-sm font-bold">
              <Stars value={rating.avg} /> <b>{rating.avg.toFixed(1)}</b> <span className="opacity-60">from {rating.count} reviews</span>
            </p>
          )}
        </div>

        <div className="relative order-1 mx-auto h-[380px] w-full max-w-[560px] sm:h-[480px] lg:order-2 lg:h-[600px]" style={{ perspective: 1200 }}>
          <div ref={stage} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
            {ARCHES.map((a, i) => (
              <div key={a.src} data-arch className={`absolute ${a.cls}`} style={{ transformStyle: "preserve-3d" }}>
                <div data-arch-intro className="h-full" style={{ transformStyle: "preserve-3d" }}>
                  <div data-arch-inner className="h-full rounded-t-full rounded-b-[22px] border border-gold/70 p-1.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
                    <div className="relative h-full overflow-hidden rounded-t-full rounded-b-[16px]">
                      <div data-arch-img className="absolute inset-0">
                        <Image src={a.src} alt={a.alt} fill priority={i === 1} sizes="(min-width: 1024px) 20vw, 33vw" className="object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-gold/25 bg-forest/60 py-4">
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map(([en, ar], i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="text-xs font-bold uppercase tracking-[.25em] text-cream/80">{en}</span>
              <span className="font-ar text-lg text-gold" lang="ar">{ar}</span>
              <span className="text-gold/60">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
