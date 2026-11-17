"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Logo from "./Logo";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { cartCount, useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { useMounted } from "@/lib/useMounted";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { lockScroll } from "@/lib/lenis";
import { logout } from "@/app/actions/auth";

type User = { name: string | null; email: string; isAdmin: boolean } | null;
const NAV = [
  { href: "/products", label: "Shop all" },
  { href: "/products?category=sparkling", label: "Drinks" },
  { href: "/products?category=bottles", label: "Gear" },
  { href: "/products?category=gifts", label: "Gifts" },
  { href: "/products?sale=1", label: "Sale" },
];

export const showHeader = () => window.dispatchEvent(new Event("fizzo:show-header"));

export default function HeaderClient({ user }: { user: User }) {
  const pathname = usePathname();
  const mounted = useMounted();
  const set = useUI((s) => s.set);
  const menuOpen = useUI((s) => s.menuOpen);
  const count = useCart((s) => cartCount(s.items));
  const wish = useWishlist((s) => s.items.length);
  const header = useRef<HTMLElement>(null);
  const badge = useRef<HTMLSpanElement>(null);
  const prevCount = useRef<number | null>(null);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY, hidden = false;
    const to = (h: boolean) => { if (h === hidden) return; hidden = h; gsap.to(header.current, { yPercent: h ? -110 : 0, duration: 0.5, ease: "power3.out" }); };
    const onScroll = () => { const y = window.scrollY; if (Math.abs(y - last) > 6) { to(y > last && y > 240); last = y; } };
    const show = () => to(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("fizzo:show-header", show);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("fizzo:show-header", show); };
  }, []);

  // Bounce the badge whenever the cart grows.
  useEffect(() => {
    if (!mounted) return;
    if (prevCount.current !== null && count > prevCount.current)
      gsap.fromTo(badge.current, { scale: 1.9, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.35)" });
    prevCount.current = count;
  }, [count, mounted]);

  useEffect(() => { set({ menuOpen: false, cartOpen: false, searchOpen: false }); }, [pathname, set]);

  const iconBtn = "relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-ink/10";

  return (
    <>
      <header ref={header} className="sticky top-0 z-50 border-b-2 border-ink bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" aria-label="Fizzo home"><Logo /></Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`nav-link ${n.label === "Sale" ? "text-fizz" : ""}`}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <button onClick={() => set({ searchOpen: true })} className="hidden items-center gap-2 rounded-full border-2 border-ink/15 bg-white/60 py-1.5 pl-3 pr-1.5 text-ink/60 transition-colors hover:border-ink md:flex" aria-label="Search products">
              <SearchIcon className="h-4 w-4" /> <span className="pr-6">Search</span>
              <kbd className="rounded-md border border-ink/20 bg-cream px-1.5 py-0.5 text-[11px] font-bold">⌘K</kbd>
            </button>
            <button onClick={() => set({ searchOpen: true })} className={`${iconBtn} md:hidden`} aria-label="Search"><SearchIcon /></button>
            <Link href="/wishlist" className={`${iconBtn} hidden sm:grid`} aria-label="Wishlist">
              <HeartIcon />
              {mounted && wish > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-fizz px-1 text-[10px] font-extrabold text-white">{wish}</span>}
            </Link>
            {user?.isAdmin && <Link href="/admin" className="hidden rounded-full border-2 border-ink px-3 py-1.5 hover:bg-lemon xl:block">Admin</Link>}
            <Link href={user ? "/account" : "/login"} className={`${iconBtn} hidden sm:grid`} aria-label={user ? "Account" : "Sign in"}><UserIcon /></Link>
            <button id="cart-button" onClick={() => set({ cartOpen: true })} className="btn btn-dark ml-1 !px-4 !py-2 !text-sm" aria-label={`Open cart, ${mounted ? count : 0} items`}>
              <BagIcon className="h-4 w-4" />
              <span ref={badge} className="grid h-6 min-w-6 place-items-center rounded-full bg-lemon px-1 text-xs font-extrabold text-ink">{mounted ? count : 0}</span>
            </button>
            <button onClick={() => set({ menuOpen: true })} className={`${iconBtn} lg:hidden`} aria-label="Open menu"><MenuIcon /></button>
          </div>
        </div>
      </header>
      {menuOpen && <MobileMenu user={user} onClose={() => set({ menuOpen: false })} />}
    </>
  );
}

function MobileMenu({ user, onClose }: { user: User; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    lockScroll(true);
    const ctx = gsap.context(() => {
      gsap.fromTo(root.current, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.8, ease: "expo.out" });
      gsap.from("[data-menu-item]", { yPercent: 120, rotation: 4, opacity: 0, stagger: 0.05, duration: 0.8, ease: "expo.out", delay: 0.12 });
    }, root);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => { ctx.revert(); lockScroll(false); window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[65] flex flex-col bg-fizz p-6 text-cream">
      <div className="flex items-center justify-between">
        <Logo className="!text-cream" />
        <button onClick={onClose} className="grid h-12 w-12 place-items-center rounded-full border-2 border-cream" aria-label="Close menu"><CloseIcon /></button>
      </div>
      <nav className="mt-10 flex flex-col gap-1">
        {[...NAV, { href: "/wishlist", label: "Wishlist" }].map((n) => (
          <div key={n.href} className="overflow-hidden">
            <Link data-menu-item href={n.href} onClick={onClose} className="font-display block text-6xl font-extrabold leading-[1.05] active:text-lemon">{n.label}</Link>
          </div>
        ))}
      </nav>
      <div className="mt-auto flex flex-wrap gap-3 text-sm font-bold" data-menu-item>
        {user ? (
          <>
            <Link href="/account" onClick={onClose} className="btn bg-cream text-ink">My account</Link>
            {user.isAdmin && <Link href="/admin" onClick={onClose} className="btn bg-lemon text-ink">Admin</Link>}
            <form action={logout}><button className="btn btn-ghost !border-cream">Sign out</button></form>
          </>
        ) : (
          <Link href="/login" onClick={onClose} className="btn bg-cream text-ink">Sign in</Link>
        )}
      </div>
    </div>
  );
}
