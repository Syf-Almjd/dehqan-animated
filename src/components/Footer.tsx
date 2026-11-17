import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="!text-cream" />
          <p className="font-display mt-4 max-w-sm text-3xl font-bold leading-tight">Real magic is better when it&apos;s shared.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="mb-3 font-bold uppercase tracking-wider opacity-50">Shop</p>
          <Link className="block hover:text-lemon" href="/products">All products</Link>
          <Link className="block hover:text-lemon" href="/products?category=sparkling">Sparkling drinks</Link>
          <Link className="block hover:text-lemon" href="/products?category=gifts">Gift sets</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="mb-3 font-bold uppercase tracking-wider opacity-50">Account</p>
          <Link className="block hover:text-lemon" href="/account">My orders</Link>
          <Link className="block hover:text-lemon" href="/cart">Cart</Link>
          <Link className="block hover:text-lemon" href="/login">Sign in</Link>
        </div>
      </div>
      <p className="border-t border-cream/15 py-5 text-center text-xs opacity-50">© {new Date().getFullYear()} Fizzo. Free shipping on orders over $50.</p>
    </footer>
  );
}
