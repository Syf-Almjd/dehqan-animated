"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductArt from "./ProductArt";
import Magnetic from "./Magnetic";
import Stars from "./Stars";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import type { ArtKind } from "@/lib/types";

const MARQUEE = ["Free shipping over $50", "Ice-cold & bubbly", "Made for sharing", "Real magic", "Zero boring"];

// depth = how far "forward" in 3D space it sits (bigger = closer, moves more)
const ART: { kind: ArtKind; color: string; depth: number; cls: string; spin: number }[] = [
  { kind: "can", color: "#e8173b", depth: 0.6, cls: "left-[0%] top-[22%] h-[52%]", spin: -40 },
  { kind: "bottle", color: "#2d7dff", depth: 0.3, cls: "left-[30%] top-[2%] h-[68%]", spin: 25 },
  { kind: "can", color: "#2bb673", depth: 0.9, cls: "right-[0%] top-[28%] h-[52%]", spin: 50 },
  { kind: "tumbler", color: "#ff4a1c", depth: 1.2, cls: "bottom-[-4%] left-[32%] h-[42%]", spin: -30 },
];

export default function Hero({ rating }: { rating?: { avg: number; count: number } }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(root.current, { visibility: "visible" });
      // 1. Entrance — headline lines flip up out of the floor, art drops in with depth.
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .from("[data-line]", { yPercent: 115, rotationX: -80, transformOrigin: "50% 100% -60px", duration: 1.4, stagger: 0.1 })
        .from("[data-hero-fade]", { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, "-=1")
        .from("[data-art-intro]", { y: -260, z: -600, rotationZ: (i) => ART[i].spin, opacity: 0, duration: 1.6, stagger: 0.09, ease: "elastic.out(1, 0.75)" }, 0.15)
        .from("[data-disc]", { scale: 0, duration: 1.3 }, 0.1);
      gsap.set("[data-disc]", { z: -120 });
      gsap.set("[data-ring]", { z: -60 });
      gsap.utils.toArray<HTMLElement>("[data-art-inner]").forEach((el, i) => gsap.set(el, { z: ART[i].depth * 120 }));

      // 2. Mouse parallax — the whole stage tilts in 3D, each item shifts by its depth.
      const fine = window.matchMedia("(pointer: fine)").matches;
      let onMove: ((e: PointerEvent) => void) | undefined;
      if (fine) {
        const rx = gsap.quickTo(stage.current, "rotationX", { duration: 0.9, ease: "power3" });
        const ry = gsap.quickTo(stage.current, "rotationY", { duration: 0.9, ease: "power3" });
        const items = gsap.utils.toArray<HTMLElement>("[data-art-inner]").map((el, i) => ({
          x: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1, ease: "power3" }),
          d: ART[i].depth,
        }));
        onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
          rx(-ny * 18); ry(nx * 22);
          items.forEach((it) => { it.x(nx * 70 * it.d); it.y(ny * 50 * it.d); });
        };
        window.addEventListener("pointermove", onMove);
      }

      // 3. Scroll away — headline drifts up, art explodes outward through 3D space.
      const out = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } });
      out
        .to("[data-hero-copy]", { yPercent: -35, opacity: 0.2, ease: "none" }, 0)
        .to("[data-art]", {
          y: (i) => -220 * ART[i].depth - 80, x: (i) => (i % 2 ? 1 : -1) * 140 * ART[i].depth,
          z: (i) => 300 * ART[i].depth, rotationZ: (i) => ART[i].spin, rotationY: (i) => ART[i].spin * 1.5, ease: "none",
        }, 0)
        .to("[data-disc-wrap]", { scale: 1.5, opacity: 0, ease: "none" }, 0);

      return () => onMove && window.removeEventListener("pointermove", onMove);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-hero className="relative overflow-hidden border-b-2 border-ink">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-16 pt-12 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div data-hero-copy>
          <p data-hero-fade className="inline-block rotate-[-2deg] rounded-full border-2 border-ink bg-lemon px-4 py-1.5 text-sm font-bold">New summer flavours are here ☀️</p>
          <h1 className="font-display mt-6 text-[clamp(3.5rem,10vw,8.5rem)] font-extrabold leading-[.88]" style={{ perspective: 800 }}>
            <span className="block overflow-hidden pb-[0.06em]"><span data-line className="block">Fizz for</span></span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-line className="relative inline-block text-fizz">every
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 20" fill="none" aria-hidden="true"><path d="M3 14c50-14 100-14 150-4s100 4 144-6" stroke="#14110f" strokeWidth="6" strokeLinecap="round" /></svg>
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]"><span data-line className="block">moment.</span></span>
          </h1>
          <p data-hero-fade className="mt-8 max-w-md text-lg opacity-75">Sparkling drinks, bottles and gift boxes made for passing around. Cold, loud and delivered to your door.</p>
          <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
            <Magnetic><Link href="/products" className="btn btn-primary">Shop the collection →</Link></Magnetic>
            <Magnetic><Link href="/products?category=gifts" className="btn btn-ghost">Gift sets</Link></Magnetic>
          </div>
          {rating && (
            <p data-hero-fade className="mt-8 flex items-center gap-2 text-sm font-semibold">
              <Stars value={rating.avg} /> <b>{rating.avg.toFixed(1)}</b> <span className="opacity-60">from {rating.count} happy sippers</span>
            </p>
          )}
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-[520px] md:h-[560px]" style={{ perspective: 1100 }} aria-hidden="true">
          <div ref={stage} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
            <div data-disc-wrap className="absolute inset-6" style={{ transformStyle: "preserve-3d" }}><div data-disc className="h-full w-full rounded-full border-2 border-ink bg-lemon" /></div>
            <div data-ring className="absolute inset-16 rounded-full border-2 border-dashed border-ink/40" />
            {ART.map((a, i) => (
              <div key={i} data-art className={`absolute ${a.cls}`} style={{ transformStyle: "preserve-3d" }}>
                <div data-art-intro className="h-full" style={{ transformStyle: "preserve-3d" }}>
                  <div data-art-inner className="h-full">
                    <ProductArt kind={a.kind} color={a.color} className="float h-full drop-shadow-[10px_14px_0_rgba(20,17,15,.18)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden border-t-2 border-ink bg-ink py-3 text-cream">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-xl font-bold">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (<span key={i} className="flex items-center gap-10">{t}<span className="text-lemon">✦</span></span>))}
        </div>
      </div>
    </section>
  );
}
