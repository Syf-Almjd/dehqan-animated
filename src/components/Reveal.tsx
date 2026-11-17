"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

/*
 * Elements are pre-hidden by CSS (html.js [data-reveal]…) so there's no "show → hide → animate" flicker.
 * Each component animates itself on mount, so it also works after client-side navigation and filter changes.
 */

type Props = { children: React.ReactNode; className?: string; delay?: number };

export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, delay, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
      });
    });
    return () => ctx.revert();
  }, [delay]);
  return <div ref={ref} data-reveal className={className}>{children}</div>;
}

/** Children appear row by row as each one scrolls into view. */
export function RevealGroup({ children, className }: Omit<Props, "delay">) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const kids = Array.from(ref.current!.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      gsap.set(kids, { opacity: 0, y: 36, scale: 0.97 });
      ScrollTrigger.batch(kids, {
        start: "top 94%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true, clearProps: "transform" }),
      });
    });
    return () => ctx.revert();
  }, []);
  return <div ref={ref} data-reveal-group className={className}>{children}</div>;
}

/** Un-folds from a tilted, shrunken state as you scroll toward it. */
export function ScrubZoom({ children, className }: Omit<Props, "delay">) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { scale: 0.8, rotationX: 28, y: 50, transformPerspective: 1200, transformOrigin: "50% 100%" },
        { scale: 1, rotationX: 0, y: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 30%", scrub: 1 } });
    });
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
