import type { Metadata, Viewport } from "next";
import { Lora, Lato, El_Messiri } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import CartDrawer from "@/components/CartDrawer";
import SearchPalette from "@/components/SearchPalette";
import Toaster from "@/components/Toaster";
import { SITE_URL } from "@/lib/format";
import { BRAND } from "@/lib/data";

const lora = Lora({ variable: "--font-lora", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["400", "700", "900"] });
const arabic = El_Messiri({ variable: "--font-ar", subsets: ["arabic"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND.name} — Afghan raisins, dried fruits, nuts, saffron & honey`, template: `%s · ${BRAND.name}` },
  description: "Kandahar raisins, sun-dried fruits, nuts, Herati saffron, Badakhshan mountain honey and Shilajit – sourced directly from Afghan farmers. " + BRAND.intro,
  openGraph: { siteName: BRAND.name, type: "website", images: ["/products/cover-raisins.jpg"] },
};
export const viewport: Viewport = { themeColor: "#123321", width: "device-width", initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${lato.variable} ${arabic.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Lets CSS pre-hide animated elements only when JS will animate them in (no flicker, no-JS safe). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <MotionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchPalette />
          <Toaster />
        </MotionProvider>
      </body>
    </html>
  );
}
