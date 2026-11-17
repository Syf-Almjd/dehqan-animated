"use client";
import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/app/actions/auth";

export default function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? login : signup, undefined);
  const isLogin = mode === "login";
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-6xl font-extrabold">{isLogin ? "Welcome back" : "Join Fizzo"}</h1>
      <form action={action} className="card mt-8 space-y-4 p-6">
        <input type="hidden" name="next" value={next ?? ""} />
        {!isLogin && <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" className="input" required /></div>}
        <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" required autoComplete="email" /></div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" minLength={isLogin ? undefined : 8} className="input" required autoComplete={isLogin ? "current-password" : "new-password"} /></div>
        {state?.error && <p role="alert" className="rounded-xl bg-fizz/10 p-3 text-sm font-bold text-fizz">{state.error}</p>}
        {state?.message && <p role="status" className="rounded-xl bg-mint/15 p-3 text-sm font-bold text-mint">{state.message}</p>}
        <button disabled={pending} className="btn btn-primary w-full">{pending ? "One sec…" : isLogin ? "Sign in" : "Create account"}</button>
      </form>
      <p className="mt-5 text-center text-sm font-semibold">
        {isLogin ? <>New here? <Link className="underline" href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Create an account</Link></> : <>Have an account? <Link className="underline" href="/login">Sign in</Link></>}
      </p>
    </div>
  );
}
