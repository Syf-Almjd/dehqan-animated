"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { getLenis, setLenis } from "@/lib/lenis";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scrolling driven by GSAP's ticker (keeps ScrollTrigger in perfect sync) + a scroll-progress bar. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, touchMultiplier: 1.4 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      if (bar.current) bar.current.style.transform = `scaleX(${progress || 0})`;
    });
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => { gsap.ticker.remove(raf); lenis.destroy(); setLenis(null); };
  }, []);

  // New page: jump to top and re-measure every trigger (runs after the page's own effects).
  useIsoLayoutEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-fizz" />
      </div>
      {children}
    </>
  );
}
