"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Stars from "./Stars";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import type { Review } from "@/lib/types";

/** Two rows of reviews drifting in opposite directions. Scrolling speeds them up and makes them lean. */
export default function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  const root = useRef<HTMLDivElement>(null);
  const half = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, half), reviews.slice(half)];

  useIsoLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tracks = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);
    const pos = tracks.map(() => 0);
    let boost = 0;
    const st = ScrollTrigger.create({
      trigger: root.current, start: "top bottom", end: "bottom top",
      onUpdate: (self) => { boost = gsap.utils.clamp(-30, 30, self.getVelocity() / 120); },
    });
    const skews = tracks.map((t) => gsap.quickTo(t, "skewX", { duration: 0.5, ease: "power3" }));
    const tick = (_: number, dt: number) => {
      boost *= 0.92;
      tracks.forEach((t, i) => {
        const dir = i % 2 ? 1 : -1;
        const w = t.scrollWidth / 2;
        pos[i] = (pos[i] + dir * (0.05 * dt + Math.abs(boost) * 2)) % w;
        gsap.set(t, { x: dir < 0 ? pos[i] : pos[i] - w });
        skews[i](-dir * boost * 0.4);
      });
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); };
  }, []);

  return (
    <div ref={root} className="space-y-4 overflow-hidden py-4">
      {rows.map((row, r) => (
        <div key={r} data-row className="flex w-max gap-4 will-change-transform">
          {[...row, ...row].map((rv, i) => (
            <figure key={i} className={`card w-[340px] shrink-0 p-5 ${(i + r) % 3 === 0 ? "bg-gold" : (i + r) % 3 === 1 ? "bg-white" : "bg-[#ffe1d6]"}`}>
              <Stars value={rv.rating} size={15} />
              {rv.title && <p className="font-display mt-2 text-xl font-bold leading-tight">“{rv.title}”</p>}
              <blockquote className="mt-1 line-clamp-3 text-sm opacity-75">{rv.body}</blockquote>
              <figcaption className="mt-3 flex items-center justify-between text-xs font-bold">
                <span>{rv.author_name}</span>
                {rv.product && <Link href={`/products/${rv.product.slug}`} className="underline opacity-60 hover:opacity-100">{rv.product.name}</Link>}
              </figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}
