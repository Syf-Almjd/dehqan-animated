import Image from "next/image";
import InquiryForm from "@/components/InquiryForm";
import SectionHeading from "@/components/SectionHeading";
import StepsAndPackaging from "@/components/StepsAndPackaging";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { getProducts } from "@/lib/queries";
import { BRAND } from "@/lib/data";

export const metadata = { title: "Wholesale & export", description: "Request samples and a quote for Afghan raisins, dried fruits, nuts, saffron, honey and Shilajit. Cartons or bags, private labelling available." };

export default async function Wholesale({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const [{ product }, products] = await Promise.all([searchParams, getProducts()]);
  return (
    <>
      <section className="grain relative overflow-hidden bg-forest text-cream">
        <Image src="/products/string-figs-pile.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="relative mx-auto max-w-7xl px-5 py-24">
          <SectionHeading light kicker="Order & contact" kicker_ar="الطلب والتواصل" title="Wholesale & export" title_ar="الطلب والتواصل"
            sub="Simple ordering and flexible packaging, tailored to your needs." sub_ar="طلب بسيط وخيارات تعبئة مرنة تناسب احتياجاتكم." />
          <Reveal className="mt-8 flex flex-wrap gap-3">
            <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-gold">WhatsApp / Call {BRAND.phone}</a>
            <a href={`mailto:${BRAND.email}`} className="btn border-cream/30 text-cream hover:border-gold">{BRAND.email}</a>
            <a href={BRAND.catalogue} download className="btn border-cream/30 text-cream hover:border-gold">↓ Catalogue PDF</a>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <StepsAndPackaging />
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pt-20 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="eyebrow">Step 1 · <span className="font-ar tracking-normal" lang="ar">أرسلوا استفساركم</span></p>
          <h2 className="font-display mt-2 text-4xl font-bold text-forest md:text-5xl">Send your inquiry</h2>
          <span className="gold-rule mt-4" />
          <p className="mt-5 text-lg text-ink/70">Tell us the products, grades and quantities you need. We’ll send samples and a competitive offer, then agree specifications, grades and packaging to suit you.</p>
          <ul className="mt-6 space-y-2 text-sm font-bold text-forest">
            <li>✓ Direct from farmers – no middlemen</li>
            <li>✓ Sorted & graded by size, colour and quality</li>
            <li>✓ Cartons or bags, any size, private labelling</li>
            <li>✓ Samples and specifications on request</li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}><InquiryForm products={products.map((p) => ({ slug: p.slug, name: p.name }))} initialProduct={product} /></Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <SectionHeading title="What we export" title_ar="منتجاتنا للتصدير" />
        <RevealGroup className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((p) => (
            <a key={p.id} href={`/wholesale?product=${p.slug}#name`} className="group card overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-110" />}
              </div>
              <div className="p-3">
                <p className="text-sm font-bold leading-tight text-forest">{p.name}</p>
                <p className="font-ar text-right text-sm text-gold" lang="ar">{p.name_ar}</p>
              </div>
            </a>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
