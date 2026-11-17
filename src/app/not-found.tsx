import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="font-display text-9xl font-extrabold text-fizz">404</p>
      <p className="mt-2 text-xl font-semibold">That page went flat.</p>
      <Link href="/products" className="btn btn-primary mt-8">Back to the shop</Link>
    </div>
  );
}
