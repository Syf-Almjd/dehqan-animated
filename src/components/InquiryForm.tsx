"use client";
import { useActionState } from "react";
import { sendInquiry } from "@/app/actions/site";
import { BRAND } from "@/lib/data";

const F = ({ n, label, type = "text", req = false, auto, def }: { n: string; label: string; type?: string; req?: boolean; auto?: string; def?: string }) => (
  <div>
    <label className="label" htmlFor={n}>{label}{!req && <span className="normal-case tracking-normal text-ink/40"> (optional)</span>}</label>
    <input id={n} name={n} type={type} required={req} autoComplete={auto} defaultValue={def} className="input" />
  </div>
);

export default function InquiryForm({ products, initialProduct }: { products: { slug: string; name: string }[]; initialProduct?: string }) {
  const [state, action, pending] = useActionState(sendInquiry, undefined);
  const pre = products.find((p) => p.slug === initialProduct)?.name;
  if (state?.ok)
    return (
      <div className="card p-10 text-center">
        <p className="text-5xl">🌾</p>
        <p className="font-display mt-3 text-3xl font-bold text-forest">{state.message}</p>
        <p className="font-ar mt-2 text-xl text-gold" lang="ar">شكراً لكم، سنتواصل معكم قريباً</p>
      </div>
    );
  return (
    <form action={action} className="card grid gap-4 p-6 sm:grid-cols-2 md:p-8">
      <F n="name" label="Your name" req auto="name" /><F n="company" label="Company" auto="organization" />
      <F n="email" label="Email" type="email" req auto="email" /><F n="phone" label="Phone / WhatsApp" type="tel" auto="tel" />
      <F n="country" label="Destination country" auto="country-name" />
      <F n="quantity" label="Quantity (e.g. 1 tonne, 20ft container)" />
      <div className="sm:col-span-2">
        <label className="label" htmlFor="products">Products of interest</label>
        <input id="products" name="products" list="product-list" defaultValue={pre} placeholder="e.g. Green raisins, Herati saffron" className="input" />
        <datalist id="product-list">{products.map((p) => <option key={p.slug} value={p.name} />)}</datalist>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="message">Grades, packaging & anything else</label>
        <textarea id="message" name="message" rows={4} className="input" placeholder="Preferred grades, packaging (cartons / bags), private labelling, delivery terms…" />
      </div>
      {state?.error && (
        <p role="alert" className="rounded-xl bg-saffron/10 p-3 text-sm font-bold text-saffron sm:col-span-2">
          {state.error} <a className="underline" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button disabled={pending} className="btn btn-primary">{pending ? "Sending…" : "Send enquiry"}</button>
        <span className="text-sm text-ink/50">or</span>
        <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp us</a>
      </div>
    </form>
  );
}
