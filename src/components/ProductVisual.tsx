import ProductArt from "./ProductArt";
import type { CardProduct } from "@/lib/types";

export default function ProductVisual({ p, className = "" }: { p: Pick<CardProduct, "art_kind" | "color" | "image_url" | "name">; className?: string }) {
  return (
    <div data-art className={`relative grid place-items-center overflow-hidden ${className}`} style={{ background: `${p.color}22` }}>
      {p.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
      ) : (
        <ProductArt kind={p.art_kind} color={p.color} className="h-[78%] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />
      )}
    </div>
  );
}
