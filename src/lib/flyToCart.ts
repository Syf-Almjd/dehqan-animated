import gsap from "gsap";

/** Clones `source` (usually the product's SVG), and arcs it into the header cart button. */
export function flyToCart(source: Element | null | undefined, onDone?: () => void) {
  const target = document.getElementById("cart-button");
  if (!source || !target) return onDone?.();
  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  if (!s.width) return onDone?.();
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("class");
  clone.removeAttribute("srcset");
  clone.removeAttribute("sizes");
  Object.assign(clone.style, {
    position: "fixed", inset: "auto", left: `${s.left}px`, top: `${s.top}px`, width: `${s.width}px`, height: `${s.height}px`,
    zIndex: "90", pointerEvents: "none", margin: "0", objectFit: "cover", borderRadius: "18px",
    boxShadow: "0 20px 40px -18px rgba(18,51,33,.6)",
  });
  if (clone instanceof HTMLImageElement) clone.src = (source as HTMLImageElement).currentSrc || clone.src;
  document.body.appendChild(clone);
  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);
  gsap.timeline({ onComplete: () => { clone.remove(); onDone?.(); } })
    .to(clone, { scale: 1.12, duration: 0.18, ease: "power2.out" })
    .to(clone, { x: dx, duration: 0.8, ease: "power2.inOut" }, ">")
    .to(clone, { y: dy, duration: 0.8, ease: "back.in(1.8)" }, "<")
    .to(clone, { scale: 0.08, rotation: 280, duration: 0.8, ease: "power2.in" }, "<")
    .to(clone, { opacity: 0, duration: 0.12 }, "-=0.12");
}
