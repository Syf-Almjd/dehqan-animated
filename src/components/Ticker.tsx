"use client";
import { useRef, type ReactNode } from "react";
import Image from "next/image";
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
  wheat: <Svg w={0.7} vb="0 0 70 100" className="text-gold"><P d="M35 96V20" /><P d="M35 30c-10-3-15-11-15-20 10 2 15 9 15 20Zm0 0c10-3 15-11 15-20-10 2-15 9-15 20Z" /><P d="M35 52c-10-3-15-11-15-20 10 2 15 9 15 20Zm0 0c10-3 15-11 15-20-10 2-15 9-15 20Z" /><P d="M35 74c-10-3-15-11-15-20 10 2 15 9 15 20Zm0 0c10-3 15-11 15-20-10 2-15 9-15 20Z" /></Svg>,
  hand: <Svg w={2.4} vb="0 0 240 100" className="text-leaf"><P d="M4 60c40 0 60-30 100-30s50 20 80 20 40-12 52-24" /><P d="M200 18l28 8-10 26" /></Svg>,
  sun: <Svg w={0.95} vb="0 0 100 100" className="text-gold"><P d="M50 30a20 20 0 1 0 .01 0Z" /><P d="M50 4v12M50 84v12M4 50h12M84 50h12M17 17l9 9M74 74l9 9M83 17l-9 9M26 74l-9 9" /></Svg>,
  mountain: <Svg w={1.8} vb="0 0 180 100" className="text-leaf"><P d="M4 92 62 20l28 34 22-26 64 64Z" /><P d="M48 38l14 10 12-8" /></Svg>,
  crocus: <Svg w={0.85} vb="0 0 90 100" className="text-saffron"><P d="M45 96V52" /><P d="M45 52C30 46 22 30 28 10c10 8 16 22 17 42Zm0 0c15-6 23-22 17-42-10 8-16 22-17 42Z" /><P d="M45 52c-6-14-2-30 0-44 2 14 6 30 0 44Z" /></Svg>,
  drop: <Svg w={0.65} vb="0 0 65 100" className="text-gold"><P d="M32 6C20 30 8 46 8 64a24 24 0 0 0 48 0C56 46 44 30 32 6Z" /><P d="M22 66c0 8 5 13 12 14" /></Svg>,
  diamond: <Svg w={0.5} vb="0 0 50 100" className="text-gold"><P d="M25 30l18 20-18 20L7 50Z" /></Svg>,
  long: <Svg w={3.2} vb="0 0 320 40" className="text-gold"><P d="M4 20h312" /></Svg>,
  arrow: <Svg w={2.4} vb="0 0 240 100" className="text-forest"><P d="M4 70C60 10 130 10 170 50c14 14 30 18 62 8" /><P d="M206 30l28 28-34 14" /></Svg>,
  heart: <Svg w={0.8} vb="0 0 100 90" className="text-saffron"><P d="M50 84C14 56 4 38 4 24 4 10 15 4 26 4c10 0 19 6 24 16C55 10 64 4 74 4c11 0 22 6 22 20 0 14-10 32-46 60Z" /></Svg>,
} as const;

type Item =
  | { w: string; gap?: number; hl?: string }
  | { g: keyof typeof glyphs; gap?: number }
  | { img: string; alt: string; gap?: number };

// Concise ticker — a few signature products, clean and punchy.
const SENTENCE: Item[] = [
  { w: "Raisins" }, { g: "diamond", gap: 0.45 },
  { img: "/products/green-raisins.jpg", alt: "Green raisins", gap: 0.45 },
  { w: "Saffron", hl: "#b3261e", gap: 0.5 }, { g: "crocus", gap: 0.35 },
  { img: "/products/saffron-front.jpg", alt: "Herati saffron", gap: 0.35 },
  { w: "Honey", gap: 0.5 }, { g: "drop", gap: 0.35 },
  { img: "/products/honey-amber.jpg", alt: "Mountain honey", gap: 0.35 },
  { w: "Nuts", hl: "#c99a2e", gap: 0.5 }, { g: "sun", gap: 0.4 },
  { w: "Dried Fruits", gap: 0.5 }, { g: "wheat", gap: 0.4 },
  { w: "— straight", gap: 0.5 }, { g: "arrow", gap: 0.4 },
  { w: "to your table", gap: 0.35 }, { g: "heart", gap: 0.4 },
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

      // 4b. Inline photos roll in like coins.
      el.querySelectorAll<HTMLElement>("[data-photo] > span").forEach((ph) => {
        gsap.fromTo(ph, { scale: 0.2, rotation: -180 }, { scale: 1, rotation: 0, ease: "back.out(1.8)",
          scrollTrigger: { trigger: ph, containerAnimation: move, start: "left 100%", end: "left 60%", scrub: true } });
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
    <section ref={section} aria-label="From the farmer’s hand" className="relative h-screen overflow-hidden bg-parchment text-forest" style={{ perspective: PERSPECTIVE }}>
      {/* far layer */}
      <div ref={back} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[260vw]">
        {BACK.map((b, i) => (
          <span key={i} className="absolute rounded-full border border-gold/40" style={{ left: `${b.left}%`, top: `${b.top}%`, width: b.size, height: b.size }} />
        ))}
      </div>

      <p className="absolute left-5 top-24 z-30 text-xs font-bold uppercase tracking-[.2em] md:left-10">The harvest · keep scrolling ↓ · <span className="font-ar tracking-normal" lang="ar">من يد المزارع</span></p>

      <div
        ref={track}
        className="font-display relative z-10 flex h-full w-max items-center whitespace-nowrap pl-[12vw] pr-[30vw] font-bold leading-none will-change-transform"
        style={{ fontSize: "clamp(3.2rem, 15vw, 15rem)", transformStyle: "preserve-3d" }}
      >
        {SENTENCE.map((it, i) => {
          const style = { marginLeft: `${it.gap ?? 0}em` };
          if ("g" in it)
            return <span key={i} data-item data-glyph className="inline-flex items-center" style={style}><span className="inline-flex">{glyphs[it.g]}</span></span>;
          if ("img" in it)
            return (
              <span key={i} data-item data-photo className="relative inline-block shrink-0" style={{ ...style, width: "0.95em", height: "0.95em" }}>
                <span className="absolute inset-0 overflow-hidden rounded-full border-[0.035em] border-gold shadow-[0_.1em_.25em_-.08em_rgba(18,51,33,.6)]">
                  <Image src={it.img} alt={it.alt} fill sizes="240px" className="object-cover" />
                </span>
              </span>
            );
          return it.hl ? (
            <span key={i} data-item data-hl={it.hl} className="inline-block" style={{ ...style, WebkitTextStroke: "0.025em #123321", paintOrder: "stroke fill", color: "transparent" }}>{it.w}</span>
          ) : (
            <span key={i} data-item className="inline-block" style={style}>{it.w}</span>
          );
        })}
      </div>

      {/* near layer – big soft bubbles that rush past the camera */}
      <div ref={front} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[420vw]">
        {FRONT.map((b, i) => (
          <span key={i} className="absolute rounded-full border-2 border-gold/30 bg-gold/10 blur-[3px]" style={{ left: `${b.left}%`, top: `${b.top * 0.9}%`, width: b.size, height: b.size }} />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 h-1.5 bg-forest/10"><div ref={bar} className="h-full origin-left scale-x-0 bg-gold" /></div>
    </section>
    </div>
  );
}
