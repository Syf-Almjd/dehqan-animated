import type { ArtKind } from "@/lib/types";

/** Illustrated product visuals (no external images needed). */
export default function ProductArt({ kind, color, className = "" }: { kind: ArtKind; color: string; className?: string }) {
  const ink = "#14110f";
  const common = { stroke: ink, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-hidden="true">
      {kind === "can" && (
        <g {...common}>
          <rect x="52" y="30" width="96" height="205" rx="22" fill={color} />
          <rect x="60" y="18" width="80" height="22" rx="8" fill="#e9e4da" />
          <rect x="60" y="226" width="80" height="16" rx="8" fill="#e9e4da" />
          <path d="M52 110 C85 85 115 135 148 110 L148 160 C115 185 85 135 52 160 Z" fill="#fff" stroke="none" opacity=".92" />
          <circle cx="100" cy="135" r="14" fill={ink} stroke="none" />
          <path d="M72 60v10M128 60v10" opacity=".35" />
        </g>
      )}
      {kind === "bottle" && (
        <g {...common}>
          <rect x="88" y="14" width="24" height="22" rx="5" fill={ink} />
          <path d="M90 36h20v38c0 18 34 30 34 62v88a22 22 0 0 1-22 22H78a22 22 0 0 1-22-22v-88c0-32 34-44 34-62Z" fill={color} />
          <rect x="62" y="130" width="76" height="62" rx="10" fill="#fff" />
          <path d="M76 152h48M76 170h30" />
          <path d="M72 104c-6 14-6 30-6 40" stroke="#fff" opacity=".55" />
        </g>
      )}
      {kind === "tumbler" && (
        <g {...common}>
          <rect x="62" y="6" width="10" height="46" rx="5" fill={ink} transform="rotate(8 67 30)" />
          <rect x="44" y="40" width="112" height="22" rx="10" fill="#e9e4da" />
          <path d="M50 62h100l-14 168a14 14 0 0 1-14 12H78a14 14 0 0 1-14-12Z" fill={color} />
          <path d="M72 90l8 120" stroke="#fff" opacity=".5" />
          <circle cx="112" cy="150" r="20" fill="#fff" />
          <path d="M104 150l6 6 10-12" />
        </g>
      )}
      {kind === "bag" && (
        <g {...common}>
          <path d="M44 36c10 8 20-8 28 0s18-8 28 0 18-8 28 0 18-8 28 0v196H44Z" fill={color} />
          <path d="M44 232c10 8 20-8 28 0s18-8 28 0 18-8 28 0 18-8 28 0" fill={color} />
          <circle cx="100" cy="125" r="42" fill="#fff" />
          <path d="M80 128c8-18 32-18 40 0M86 140c8 10 20 10 28 0" />
        </g>
      )}
      {kind === "box" && (
        <g {...common}>
          <path d="M36 80h128v150H36Z" fill={color} />
          <path d="M28 52h144v36H28Z" fill="#fff" />
          <path d="M100 52v178" />
          <path d="M100 52c-30-34-60-8-40 0M100 52c30-34 60-8 40 0" fill="none" />
          <path d="M60 140h28M112 140h28M60 168h28M112 168h28" opacity=".5" />
        </g>
      )}
      {kind === "jar" && (
        <g {...common}>
          <rect x="54" y="26" width="92" height="34" rx="10" fill={ink} />
          <path d="M60 60h80c14 14 20 30 20 50v100a24 24 0 0 1-24 24H64a24 24 0 0 1-24-24V110c0-20 6-36 20-50Z" fill={color} />
          <rect x="62" y="108" width="76" height="68" rx="12" fill="#fff" />
          <path d="M100 124c10 10 10 22 0 32-10-10-10-22 0-32Z" fill={color} />
        </g>
      )}
    </svg>
  );
}
