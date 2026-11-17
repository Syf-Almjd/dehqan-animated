import type Lenis from "lenis";
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;
/** Freeze page scrolling while an overlay (drawer, search, menu) is open. */
export const lockScroll = (locked: boolean) => {
  if (locked) instance?.stop(); else instance?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
};
