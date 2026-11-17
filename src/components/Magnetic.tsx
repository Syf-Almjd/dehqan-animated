"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Pulls its child toward the cursor a little – makes buttons feel alive. */
export default function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.3)" }); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [strength]);
  return <span ref={ref} className="inline-block">{children}</span>;
}
