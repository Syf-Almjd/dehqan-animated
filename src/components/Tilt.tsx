"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/** 3D hover tilt with a moving light glare. The outer div is free for reveal animations. */
export default function Tilt({ children, className = "", max = 10 }: { children: React.ReactNode; className?: string; max?: number }) {
  const inner = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inner.current!;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    const lift = gsap.quickTo(el, "z", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * max * 2); ry((px - 0.5) * max * 2); lift(30);
      if (glare.current) {
        glare.current.style.opacity = "1";
        glare.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.45), transparent 55%)`;
      }
    };
    const leave = () => { rx(0); ry(0); lift(0); if (glare.current) glare.current.style.opacity = "0"; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [max]);

  return (
    <div className={className} style={{ perspective: 900 }}>
      <div ref={inner} className="relative h-full">
        {children}
        <div ref={glare} className="pointer-events-none absolute inset-0 z-10 rounded-[24px] opacity-0 mix-blend-soft-light transition-opacity duration-300" />
      </div>
    </div>
  );
}
