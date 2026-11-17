import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import CartDrawer from "@/components/CartDrawer";
import SearchPalette from "@/components/SearchPalette";
import Toaster from "@/components/Toaster";
import { SITE_URL } from "@/lib/format";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Fizzo — Real magic in every bottle", template: "%s · Fizzo" },
  description: "Sparkling drinks, bottles and gifts made for sharing. Fast shipping, big refreshment.",
  openGraph: { siteName: "Fizzo", type: "website" },
};
export const viewport: Viewport = { themeColor: "#fbf3e4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} antialiased`} suppressHydrationWarning>
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
