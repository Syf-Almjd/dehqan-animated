"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useUI, type Toast } from "@/store/ui";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

export default function Toaster() {
  const toasts = useUI((s) => s.toasts);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => <ToastItem key={t.id} t={t} />)}
    </div>
  );
}

function ToastItem({ t }: { t: Toast }) {
  const el = useRef<HTMLDivElement>(null);
  const dismiss = useUI((s) => s.dismiss);
  useIsoLayoutEffect(() => {
    gsap.from(el.current, { y: 40, scale: 0.9, opacity: 0, duration: 0.6, ease: "back.out(2)" });
  }, []);
  const tone = t.tone === "err" ? "bg-fizz text-white" : t.tone === "info" ? "bg-lemon text-ink" : "bg-ink text-cream";
  return (
    <div ref={el} role="status" className={`pointer-events-auto flex items-center gap-4 rounded-full border-2 border-ink px-5 py-3 text-sm font-bold shadow-[4px_4px_0_var(--ink)] ${tone}`}>
      <span>{t.text}</span>
      {t.href && <Link href={t.href} onClick={() => dismiss(t.id)} className="underline underline-offset-2">{t.cta ?? "View"}</Link>}
    </div>
  );
}
