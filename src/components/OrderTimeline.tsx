"use client";
import { useRef } from "react";
import gsap from "gsap";
import { CheckIcon } from "./Icons";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import type { OrderStatus } from "@/lib/types";

const STEPS: { id: OrderStatus; label: string; icon: string }[] = [
  { id: "pending", label: "Order placed", icon: "🧾" },
  { id: "paid", label: "Confirmed", icon: "✅" },
  { id: "shipped", label: "On its way", icon: "🚚" },
  { id: "delivered", label: "Delivered", icon: "🎉" },
];

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  const root = useRef<HTMLDivElement>(null);
  const idx = STEPS.findIndex((s) => s.id === status);
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-fill]", { scaleX: 0 }, { scaleX: Math.max(0, idx) / (STEPS.length - 1), duration: 1.4, ease: "expo.out", delay: 0.2 });
      gsap.from("[data-step]", { scale: 0, duration: 0.6, stagger: 0.12, ease: "back.out(2.5)" });
    }, root);
    return () => ctx.revert();
  }, [idx]);

  if (status === "cancelled") return <p className="card bg-fizz/10 p-5 font-bold text-fizz">This order was cancelled.</p>;
  return (
    <div ref={root} className="card p-6">
      <div className="relative mx-6">
        <div className="absolute inset-x-0 top-5 h-1.5 rounded-full bg-ink/10" />
        <div data-fill className="absolute inset-x-0 top-5 h-1.5 origin-left rounded-full bg-mint" />
        <ol className="relative flex justify-between">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex w-0 flex-col items-center">
              <span data-step className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-ink text-lg ${i <= idx ? "bg-mint text-white" : "bg-white"}`}>
                {i < idx ? <CheckIcon className="h-5 w-5" /> : s.icon}
              </span>
              <span className={`mt-2 whitespace-nowrap text-center text-xs font-bold ${i <= idx ? "" : "opacity-40"}`}>{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
