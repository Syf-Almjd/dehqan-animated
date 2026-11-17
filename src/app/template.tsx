"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import Logo from "@/components/Logo";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";

let firstLoad = true;

/** Page transition: a curved colour panel sweeps up off the new page on every client-side navigation. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [isFirst] = useState(() => firstLoad);
  const wipe = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    firstLoad = false;
    if (isFirst) return;
    const tl = gsap.timeline();
    tl.set(wipe.current, { yPercent: 0, autoAlpha: 1 })
      .from(wipe.current!.querySelector("[data-wipe-logo]"), { scale: 0.6, opacity: 0, duration: 0.25, ease: "back.out(2)" })
      .to(wipe.current, { yPercent: -120, duration: 0.75, ease: "expo.inOut" }, "+=0.05")
      .set(wipe.current, { autoAlpha: 0 });
    return () => { tl.kill(); };
  }, [isFirst]);

  return (
    <>
      <div
        ref={wipe} aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 -bottom-[15vh] top-0 z-[75] grid place-items-center bg-fizz [border-radius:0_0_50%_50%/0_0_15vh_15vh]"
        style={{ visibility: isFirst ? "hidden" : "visible" }}
      >
        <span data-wipe-logo><Logo className="!text-cream text-5xl" /></span>
      </div>
      {children}
    </>
  );
}
