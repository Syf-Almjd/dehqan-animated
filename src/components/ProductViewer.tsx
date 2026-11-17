"use client";
import { useRef } from "react";
import gsap from "gsap";
import ProductArt from "./ProductArt";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import type { CardProduct } from "@/lib/types";

const LAYERS = 14;   // stacked copies give the flat illustration real thickness when it spins
const DEPTH = 1.8;   // px between layers

/** Drag-to-spin 3D product stage. */
export default function ProductViewer({ p }: { p: CardProduct }) {
  const box = useRef<HTMLDivElement>(null);
  const sway = useRef<HTMLDivElement>(null);
  const spin = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);

  useIsoLayoutEffect(() => {
    if (p.image_url) return;
    const el = box.current!;
    const state = { rot: 0 };
    let snap: gsap.core.Tween | undefined, dragging = false, lastX = 0, vel = 0, moved = 0;
    const apply = () => {
      gsap.set(spin.current, { rotationY: state.rot });
      gsap.set(shadow.current, { scaleX: 0.7 + 0.3 * Math.abs(Math.cos((state.rot * Math.PI) / 180)) });
    };
    const ctx = gsap.context(() => {
      gsap.to(sway.current, { rotationX: 7, rotationY: -12, y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.fromTo(state, { rot: -340 }, { rot: 0, duration: 1.8, ease: "expo.out", onUpdate: apply });
      gsap.from(spin.current, { scale: 0.5, opacity: 0, duration: 1.2, ease: "back.out(1.6)" });
    });
    const down = (e: PointerEvent) => { dragging = true; moved = 0; lastX = e.clientX; vel = 0; snap?.kill(); el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
      vel = dx * 0.8; state.rot += vel; apply();
      if (moved > 20 && hint.current) gsap.to(hint.current, { opacity: 0, duration: 0.4 });
    };
    const up = () => {
      if (!dragging) return; dragging = false;
      snap = gsap.to(state, { rot: Math.round((state.rot + vel * 16) / 360) * 360, duration: 1.8, ease: "power3.out", onUpdate: apply });
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => { ctx.revert(); snap?.kill(); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); };
  }, [p.image_url]);

  if (p.image_url)
    return (
      <div data-fly className="card aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
      </div>
    );

  return (
    <div
      ref={box}
      className="card relative aspect-square cursor-grab select-none overflow-hidden active:cursor-grabbing"
      style={{ background: `radial-gradient(circle at 50% 40%, #fff 0%, ${p.color}33 70%)`, touchAction: "pan-y" }}
      aria-label={`${p.name} – drag to rotate`}
      role="img"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: "linear-gradient(#14110f 1px, transparent 1px), linear-gradient(90deg, #14110f 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div ref={shadow} className="absolute bottom-[11%] left-1/2 h-6 w-[38%] -translate-x-1/2 rounded-[50%] bg-ink/20 blur-md" />
      <div className="absolute inset-0" style={{ perspective: 1000 }}>
        <div ref={sway} className="h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          <div ref={spin} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
            {Array.from({ length: LAYERS }, (_, i) => {
              const edge = i !== 0 && i !== LAYERS - 1;
              return (
                <div
                  key={i}
                  {...(i === 0 ? { "data-fly": true } : {})}
                  className="absolute inset-0 grid place-items-center"
                  style={{ transform: `translateZ(${((LAYERS - 1) / 2 - i) * DEPTH}px)`, filter: edge ? "brightness(.62) saturate(1.2)" : undefined }}
                >
                  <ProductArt kind={p.art_kind} color={p.color} className="h-[72%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p ref={hint} className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold">↔ Drag to spin</p>
    </div>
  );
}
