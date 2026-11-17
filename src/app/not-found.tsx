import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="font-display text-9xl font-bold text-gold">404</p>
      <p className="mt-2 text-xl font-semibold">This page isn’t part of the harvest.</p>
      <Link href="/products" className="btn btn-primary mt-8">Back to the shop</Link>
    </div>
  );
}
