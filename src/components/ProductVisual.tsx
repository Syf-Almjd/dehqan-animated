import Image from "next/image";
import ProductArt from "./ProductArt";
import type { CardProduct } from "@/lib/types";

type Props = {
  p: Pick<CardProduct, "art_kind" | "color" | "image_url" | "name">;
  className?: string;
  sizes?: string;
  priority?: boolean;
  zoom?: boolean;
};

/** Product photo (optimised by next/image), falling back to an illustration when there's no image. */
export default function ProductVisual({ p, className = "", sizes = "(min-width: 1024px) 25vw, 50vw", priority, zoom = true }: Props) {
  return (
    <div data-art className={`relative overflow-hidden bg-parchment ${className}`}>
      {p.image_url ? (
        <Image
          src={p.image_url}
          alt={p.name}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={!p.image_url.startsWith("/")}
          className={`object-cover ${zoom ? "transition-transform duration-[900ms] ease-out group-hover:scale-110" : ""}`}
        />
      ) : (
        <div className="grid h-full place-items-center"><ProductArt kind={p.art_kind} color={p.color} className="h-[78%]" /></div>
      )}
    </div>
  );
}
