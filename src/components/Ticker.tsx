"use client";
import { useRef, type ReactNode } from "react";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ── Inline glyphs: they sit in the sentence like punctuation / conjunctions ── */
const Svg = ({ w, vb, children, className = "" }: { w: number; vb: string; children: ReactNode; className?: string }) => (
  <svg viewBox={vb} aria-hidden="true" className={`shrink-0 overflow-visible ${className}`} style={{ height: "0.8em", width: `${w}em` }}
    fill="none" stroke="currentColor" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
// pathLength=1 lets ScrollTrigger "draw" every glyph with a single dash trick
const P = (p: React.SVGProps<SVGPathElement>) => <path data-draw pathLength={1} vectorEffect="non-scaling-stroke" {...p} />;

const glyphs = {
  bottle: <Svg w={0.5} vb="0 0 50 100" className="text-fizz"><P d="M19 4h12v14c0 10 14 14 14 28v42a8 8 0 0 1-8 8H13a8 8 0 0 1-8-8V46c0-14 14-18 14-28Z" /><P d="M12 56h26M12 70h26" /></Svg>,
  sparkle: <Svg w={0.75} vb="0 0 100 100" className="text-grape"><P d="M50 4c4 28 18 42 46 46-28 4-42 18-46 46-4-28-18-42-46-46C32 46 46 32 50 4Z" /></Svg>,
  wave: <Svg w={2.6} vb="0 0 260 100" className="text-sky"><P d="M4 52c20-48 40-48 62 0s42 48 62 0 42-48 62 0 40 48 66 0" /></Svg>,
  loop: <Svg w={2.2} vb="0 0 220 100" className="text-fizz"><P d="M4 80C50 80 70 20 100 30s-10 60-34 40S100 6 150 36s40 40 66 10" /></Svg>,
  star: <Svg w={0.75} vb="0 0 100 100" className="text-ink"><P d="M50 6l13 28 31 4-23 21 6 31-27-15-27 15 6-31L6 38l31-4Z" /></Svg>,
  bubbles: <Svg w={1.1} vb="0 0 110 100" className="text-mint"><P d="M30 62a22 22 0 1 0 .01 0Z" /><P d="M78 34a14 14 0 1 0 .01 0Z" /><P d="M84 82a9 9 0 1 0 .01 0Z" /></Svg>,
  arrow: <Svg w={2.4} vb="0 0 240 100" className="text-ink"><P d="M4 70C60 10 130 10 170 50c14 14 30 18 62 8" /><P d="M206 30l28 28-34 14" /></Svg>,
  long: <Svg w={3.6} vb="0 0 360 40" className="text-fizz"><P d="M4 20h352" /></Svg>,
  heart: <Svg w={0.8} vb="0 0 100 90" className="text-fizz"><P d="M50 84C14 56 4 38 4 24 4 10 15 4 26 4c10 0 19 6 24 16C55 10 64 4 74 4c11 0 22 6 22 20 0 14-10 32-46 60Z" /></Svg>,
  smile: <Svg w={0.9} vb="0 0 100 100" className="text-ink"><P d="M50 6a44 44 0 1 0 .01 0Z" /><P d="M30 60c10 16 30 16 40 0" /><P d="M35 36v4M65 36v4" /></Svg>,
} as const;

type Item = { w: string; gap?: number; hl?: string } | { g: keyof typeof glyphs; gap?: number };

// "In every bottle, discover the undeniable Real Magic of sharing pure Refreshment that brings us Together"
const SENTENCE: Item[] = [
  { w: "In" }, { w: "every", gap: 0.28 }, { w: "bottle,", gap: 0.3 }, { g: "bottle", gap: 0.35 },
  { w: "discover", gap: 0.9 }, { g: "sparkle", gap: 0.3 }, { w: "the", gap: 0.35 },
  { g: "long", gap: 0.4 }, { w: "undeniable", gap: 0.4 }, { g: "wave", gap: 0.35 },
  { w: "Real Magic", hl: "#ff4a1c", gap: 0.5 }, { g: "star", gap: 0.45 },
  { w: "of", gap: 0.5 }, { w: "sharing", gap: 0.28 }, { g: "bubbles", gap: 0.4 },
  { w: "pure", gap: 0.7 }, { g: "loop", gap: 0.3 },
  { w: "Refreshment", hl: "#2d7dff", gap: 0.3 }, { g: "arrow", gap: 0.7 },
  { w: "that", gap: 0.3 }, { w: "brings", gap: 0.28 }, { w: "us", gap: 0.28 }, { g: "heart", gap: 0.45 },
  { w: "Together", hl: "#6c5ce7", gap: 0.5 }, { g: "smile", gap: 0.3 },
];

// Deterministic "random" bubbles for the parallax depth layers
function bubbles(n: number, seed: number, min: number, max: number) {
  let x = seed;
  const r = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, () => ({ left: r() * 100, top: r() * 100, size: min + r() * (max - min) }));
}
const PERSPECTIVE = 1200;
const BACK = bubbles(46, 7, 14, 70);
const FRONT = bubbles(18, 42, 90, 260);

export default function Ticker() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = track.current!;
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, el.scrollWidth - window.innerWidth);
      const span = () => `+=${dist()}`;

      // 1. Vertical scroll → one long horizontal glide. The section pins while the sentence passes by.
      const move = gsap.to(el, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current, start: "top top", end: span, pin: true, scrub: 1,
          invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => { if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`; },
        },
      });

      // 2. Parallax depth layers: far bubbles drift slowly, near bubbles rush past.
      const layer = (target: HTMLElement | null, factor: number) =>
        gsap.to(target, { x: () => -dist() * factor, ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: span, scrub: 1, invalidateOnRefresh: true } });
      layer(back.current, 0.3);
      layer(front.current, 1.9);

      // 3. Highlighted words fill with colour as they reach the reading line.
      el.querySelectorAll<HTMLElement>("[data-hl]").forEach((word) => {
        gsap.fromTo(word, { color: "rgba(20,17,15,0)", scale: 0.9 }, {
          color: word.dataset.hl!, scale: 1.06, ease: "none",
          scrollTrigger: { trigger: word, containerAnimation: move, start: "left 80%", end: "left 35%", scrub: true },
        });
      });

      // 4. Glyphs draw themselves like pen strokes and spin into place.
      el.querySelectorAll<HTMLElement>("[data-glyph]").forEach((g) => {
        const paths = g.querySelectorAll("[data-draw]");
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
        const st = { trigger: g, containerAnimation: move, start: "left 100%", end: "left 72%", scrub: true };
        gsap.to(paths, { strokeDashoffset: 0, ease: "none", stagger: 0.15, scrollTrigger: st });
        gsap.fromTo(g.firstElementChild, { y: 60, rotation: -40, scale: 0.4 }, { y: 0, rotation: 0, scale: 1, ease: "back.out(2)", scrollTrigger: { ...st } });
      });

      // 5. 3D "drum": every word is curved around a cylinder based on its distance from screen centre,
      //    and the whole line leans with scroll speed.
      const sec = section.current!;
      const items = gsap.utils.toArray<HTMLElement>("[data-item]", el);
      const set = items.map((it) => ({
        ry: gsap.quickSetter(it, "rotationY", "deg"),
        x: gsap.quickSetter(it, "x", "px"),
        z: gsap.quickSetter(it, "z", "px"),
        o: gsap.quickSetter(it, "opacity"),
      }));
      let centers: number[] = [];
      const measure = () => { centers = items.map((it) => it.offsetLeft + it.offsetWidth / 2); };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);
      const skew = gsap.quickTo(el, "skewX", { duration: 0.4, ease: "power3" });
      let lastX = 0;
      const tick = () => {
        if (!sec.isConnected) return;
        const r = sec.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const x = gsap.getProperty(el, "x") as number;
        const half = window.innerWidth / 2;
        for (let i = 0; i < items.length; i++) {
          const d = gsap.utils.clamp(-1.7, 1.7, (centers[i] + x - half) / half);
          const z = -d * d * 320;
          set[i].ry(d * 34);
          set[i].z(z);
          // perspective pulls receding items toward the centre – push them back out so spacing stays even
          set[i].x((d * half * -z) / PERSPECTIVE);
          set[i].o(1 - Math.min(0.75, Math.abs(d) * 0.42));
        }
        skew(gsap.utils.clamp(-14, 14, (x - lastX) * 0.18));
        lastX = x;
      };
      gsap.ticker.add(tick);
      return () => { gsap.ticker.remove(tick); ScrollTrigger.removeEventListener("refresh", measure); };
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    // The wrapper matters: GSAP's pin inserts a "pin-spacer" around <section>. React owns this outer div,
    // so on route change it removes the wrapper cleanly instead of crashing on the moved node.
    <div>
    <section ref={section} aria-label="Our promise" className="relative h-screen overflow-hidden bg-lemon text-ink" style={{ perspective: PERSPECTIVE }}>
      {/* far layer */}
      <div ref={back} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[260vw]">
        {BACK.map((b, i) => (
          <span key={i} className="absolute rounded-full border-2 border-ink/15" style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size }} />
        ))}
      </div>

      <p className="absolute left-5 top-24 z-30 text-xs font-bold uppercase tracking-[.2em] md:left-10">Our promise — keep scrolling ↓</p>

      <div
        ref={track}
        className="font-display relative z-10 flex h-full w-max items-center whitespace-nowrap pl-[12vw] pr-[30vw] font-extrabold leading-none will-change-transform"
        style={{ fontSize: "clamp(4.5rem, 21vh, 15rem)", transformStyle: "preserve-3d" }}
      >
        {SENTENCE.map((it, i) => {
          const style = { marginLeft: `${it.gap ?? 0}em` };
          if ("g" in it)
            return <span key={i} data-item data-glyph className="inline-flex items-center" style={style}><span className="inline-flex">{glyphs[it.g]}</span></span>;
          return it.hl ? (
            <span key={i} data-item data-hl={it.hl} className="inline-block" style={{ ...style, WebkitTextStroke: "0.05em #14110f", paintOrder: "stroke fill", color: "transparent" }}>{it.w}</span>
          ) : (
            <span key={i} data-item className="inline-block" style={style}>{it.w}</span>
          );
        })}
      </div>

      {/* near layer – big soft bubbles that rush past the camera */}
      <div ref={front} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[420vw]">
        {FRONT.map((b, i) => (
          <span key={i} className="absolute rounded-full border-[3px] border-white/70 bg-white/20 blur-[2px]" style={{ left: `${b.left}%`, top: `${b.top * 0.9}%`, width: b.size, height: b.size }} />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 h-2 bg-ink/15"><div ref={bar} className="h-full origin-left scale-x-0 bg-ink" /></div>
    </section>
    </div>
  );
}
