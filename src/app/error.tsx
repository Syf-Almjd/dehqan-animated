"use client";
import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="text-7xl">🌾</p>
      <h1 className="font-display mt-4 text-5xl font-bold">Something went wrong.</h1>
      <p className="mt-2 opacity-70">An unexpected error happened. Give it another go.</p>
      <div className="mt-8 flex justify-center gap-3">
        <button onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/" className="btn btn-ghost">Home</Link>
      </div>
    </div>
  );
}
