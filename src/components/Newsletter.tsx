"use client";
import { useActionState, useEffect, useRef } from "react";
import gsap from "gsap";
import { subscribe } from "@/app/actions/site";

export default function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, undefined);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state?.ok) gsap.fromTo(box.current, { scale: 0.9, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    if (state?.error) gsap.fromTo(box.current, { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  }, [state]);
  return (
    <div ref={box} className="card relative overflow-hidden bg-grape p-8 text-white md:p-14">
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full border-[3px] border-white/25" />
      <div className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
      <div className="relative grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-[.95] md:text-6xl">Get 10% off your first order.</h2>
          <p className="mt-3 max-w-sm text-white/80">New flavours, secret drops and the occasional very good playlist. No spam, ever.</p>
        </div>
        {state?.ok ? (
          <p className="font-display text-3xl font-extrabold">{state.message}<br /><span className="mt-2 inline-block rounded-full bg-lemon px-4 py-1 text-lg text-ink">Code: WELCOME10</span></p>
        ) : (
          <form action={action} className="flex flex-col gap-3 sm:flex-row">
            <input name="email" type="email" required placeholder="you@email.com" aria-label="Email address" className="input !border-white flex-1 !text-ink" />
            <button disabled={pending} className="btn bg-lemon text-ink">{pending ? "Joining…" : "Join the club"}</button>
            {state?.error && <p role="alert" className="text-sm font-bold text-lemon sm:absolute sm:-bottom-7">{state.error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
