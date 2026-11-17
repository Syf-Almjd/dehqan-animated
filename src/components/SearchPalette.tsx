"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ProductVisual from "./ProductVisual";
import { ArrowIcon, SearchIcon } from "./Icons";
import { useUI } from "@/store/ui";
import { lockScroll } from "@/lib/lenis";
import { money } from "@/lib/format";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import type { CardProduct } from "@/lib/types";

export default function SearchPalette() {
  const open = useUI((s) => s.searchOpen);
  const set = useUI((s) => s.set);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); set({ searchOpen: !useUI.getState().searchOpen }); }
      else if (e.key === "/" && !typing) { e.preventDefault(); set({ searchOpen: true }); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [set]);

  return open ? <Palette onClose={() => set({ searchOpen: false })} /> : null;
}

function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<CardProduct[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useIsoLayoutEffect(() => {
    lockScroll(true);
    const ctx = gsap.context(() => {
      gsap.from("[data-backdrop]", { opacity: 0, duration: 0.3 });
      gsap.from("[data-box]", { y: -30, scale: 0.94, rotationX: 18, transformPerspective: 900, opacity: 0, duration: 0.55, ease: "expo.out" });
    }, root);
    input.current?.focus();
    return () => { ctx.revert(); lockScroll(false); };
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d: CardProduct[]) => { setResults(d); setActive(0); setLoading(false); })
        .catch(() => {});
    }, 140);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  useEffect(() => {
    if (!root.current) return;
    gsap.fromTo(root.current.querySelectorAll("[data-result]"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.035, duration: 0.4, ease: "power3.out" });
  }, [results]);

  const go = (href: string) => { onClose(); router.push(href); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(`/products/${results[active].slug}`);
      else if (q) go(`/products?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label="Search products" className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={onKey}>
      <div data-backdrop className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div data-box className="card relative w-full max-w-xl overflow-hidden shadow-[10px_12px_0_var(--ink)]">
        <div className="flex items-center gap-3 border-b-2 border-ink px-5 py-4">
          <SearchIcon className="h-5 w-5 shrink-0" />
          <input
            ref={input} value={q} onChange={(e) => { setQ(e.target.value); setLoading(true); }}
            placeholder="Search drinks, bottles, gifts…" aria-label="Search"
            role="combobox" aria-expanded="true" aria-controls="search-results" aria-activedescendant={results[active] ? `res-${active}` : undefined}
            className="flex-1 bg-transparent text-lg font-semibold outline-none placeholder:text-ink/35"
          />
          <kbd className="rounded-md border border-ink/20 px-1.5 py-0.5 text-[11px] font-bold opacity-60">ESC</kbd>
        </div>
        <p className="px-5 pt-3 text-xs font-bold uppercase tracking-wider opacity-45">{q ? (loading ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"}`) : "Popular right now"}</p>
        <ul id="search-results" role="listbox" data-lenis-prevent className="max-h-[50vh] overflow-y-auto p-2">
          {results.map((p, i) => (
            <li key={p.id} id={`res-${i}`} role="option" aria-selected={i === active} data-result>
              <Link
                href={`/products/${p.slug}`} onClick={onClose} onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-4 rounded-2xl p-2 transition-colors ${i === active ? "bg-lemon" : ""}`}
              >
                <ProductVisual p={p} className="h-14 w-14 shrink-0 rounded-xl border-2 border-ink" />
                <div className="flex-1">
                  <p className="font-bold leading-tight">{p.name}</p>
                  <p className="text-sm opacity-60">{p.category?.name}</p>
                </div>
                <span className="font-extrabold">{money(p.price_cents)}</span>
                <ArrowIcon className={`h-4 w-4 transition-transform ${i === active ? "translate-x-0" : "-translate-x-2 opacity-0"}`} />
              </Link>
            </li>
          ))}
          {q && !loading && results.length === 0 && <li className="p-6 text-center font-semibold opacity-60">No matches for “{q}”. Try “cherry” or “bottle”.</li>}
        </ul>
        {q && (
          <button onClick={() => go(`/products?q=${encodeURIComponent(q)}`)} className="w-full border-t-2 border-ink px-5 py-3 text-left text-sm font-bold hover:bg-lemon">
            See all results for “{q}” →
          </button>
        )}
      </div>
    </div>
  );
}
