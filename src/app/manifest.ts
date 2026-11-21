import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} · ${BRAND.name_ar}`,
    short_name: BRAND.name,
    description: BRAND.intro,
    start_url: "/",
    display: "standalone",
    background_color: "#123321",
    theme_color: "#123321",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

