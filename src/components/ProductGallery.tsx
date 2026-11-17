"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

/** Main photo with 3D tilt + hover magnifier, thumbnails cross-fade between shots. */
export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const zoomLayer = useRef<HTMLDivElement>(null);
  const prev = useRef(0);

  // Entrance + cross-fade when switching photos.
  useIsoLayoutEffect(() => {
    const slides = frame.current!.querySelectorAll<HTMLElement>("[data-slide]");
    if (prev.current === active) {
      gsap.fromTo(frame.current, { clipPath: "inset(12% 12% 12% 12% round 28px)", scale: 0.96 }, { clipPath: "inset(0% 0% 0% 0% round 22px)", scale: 1, duration: 1.3, ease: "expo.out" });
      gsap.set(slides, { autoAlpha: (i: number) => (i === active ? 1 : 0) });
    } else {
      gsap.to(slides[prev.current], { autoAlpha: 0, scale: 1.04, duration: 0.6, ease: "power2.out" });
      gsap.fromTo(slides[active], { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "expo.out" });
    }
    prev.current = active;
  }, [active]);

  // 3D tilt + magnifier (fine pointers only).
  useIsoLayoutEffect(() => {
    const el = frame.current!;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * 8); ry((px - 0.5) * 10);
      gsap.to(zoomLayer.current, { "--zx": `${px * 100}%`, "--zy": `${py * 100}%`, duration: 0.25, overwrite: true });
    };
    const enter = () => gsap.to(zoomLayer.current, { "--zs": 1.9, duration: 0.6, ease: "power3.out" });
    const leave = () => { rx(0); ry(0); gsap.to(zoomLayer.current, { "--zs": 1, duration: 0.6, ease: "power3.out" }); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <div>
      <div style={{ perspective: 1200 }}>
        <div ref={frame} className="relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-[22px] bg-parchment shadow-[0_40px_80px_-40px_rgba(18,51,33,.6)]">
          <div ref={zoomLayer} data-fly className="absolute inset-0" style={{ transform: "scale(var(--zs, 1))", transformOrigin: "var(--zx, 50%) var(--zy, 50%)" } as React.CSSProperties}>
            {images.map((src, i) => (
              <div key={src} data-slide className="absolute inset-0" style={{ visibility: i === 0 ? "visible" : "hidden" }}>
                <Image src={src} alt={`${name} – photo ${i + 1}`} fill priority={i === 0} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
          <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-bold text-forest backdrop-blur">⌕ Hover to zoom</span>
          {images.length > 1 && (
            <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-forest/80 px-3 py-1 text-xs font-bold text-cream">{active + 1} / {images.length}</span>
          )}
        </div>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={i === active}
              className={`relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all ${i === active ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
