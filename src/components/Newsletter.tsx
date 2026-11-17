"use client";
import { useActionState, useEffect, useRef } from "react";
import gsap from "gsap";
import { subscribe } from "@/app/actions/site";

export default function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, undefined);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state?.ok) gsap.fromTo(box.current, { scale: 0.96 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    if (state?.error) gsap.fromTo(box.current, { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  }, [state]);
  return (
    <div ref={box} className="relative overflow-hidden rounded-[28px] border border-gold/30 bg-[#fbf6ea] p-8 md:p-14">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-gold/30" />
      <div className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 rounded-full border border-dashed border-gold/40" />
      <div className="relative grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="eyebrow">Harvest updates · <span className="font-ar tracking-normal" lang="ar">أخبار الحصاد</span></p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-forest md:text-5xl">Be first to hear about each new harvest.</h2>
          <p className="mt-3 max-w-sm text-ink/65">New-season raisins, fresh saffron and honey arrivals. No spam, ever.</p>
        </div>
        {state?.ok ? (
          <p className="font-display text-3xl font-bold text-leaf">Thank you – you’re on the list. 🌾</p>
        ) : (
          <form action={action} className="relative flex flex-col gap-3 sm:flex-row">
            <input name="email" type="email" required placeholder="you@email.com" aria-label="Email address" className="input flex-1" />
            <button disabled={pending} className="btn btn-primary">{pending ? "Joining…" : "Subscribe"}</button>
            {state?.error && <p role="alert" className="text-sm font-bold text-saffron sm:absolute sm:-bottom-7">{state.error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
