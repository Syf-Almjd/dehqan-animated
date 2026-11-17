import { RevealGroup } from "./Reveal";
import { PACKAGING, STEPS } from "@/lib/content";

export default function StepsAndPackaging({ light = false }: { light?: boolean }) {
  const muted = light ? "text-cream/70" : "text-ink/70";
  return (
    <>
      <RevealGroup className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className={`rounded-[22px] border p-6 ${light ? "border-cream/10 bg-cream/5" : "card"}`}>
            <div className="flex items-center justify-between">
              <span className="font-display grid h-12 w-12 place-items-center rounded-full bg-gold text-xl font-bold text-forest">{s.n}</span>
              <span className={`font-ar text-xl ${light ? "text-gold" : "text-leaf"}`} lang="ar">{s.title_ar}</span>
            </div>
            <h3 className={`font-display mt-4 text-2xl font-bold ${light ? "text-cream" : "text-forest"}`}>{s.title}</h3>
            <p className={`mt-1 text-sm ${muted}`}>{s.body}</p>
            <p className={`font-ar mt-2 text-right text-sm leading-loose ${muted}`} lang="ar" dir="rtl">{s.body_ar}</p>
          </div>
        ))}
      </RevealGroup>
      <div className={`mt-4 grid gap-6 rounded-[22px] border p-6 md:grid-cols-2 ${light ? "border-cream/10 bg-cream/5" : "border-gold/30 bg-[#fbf6ea]"}`}>
        <div>
          <h3 className={`font-display text-2xl font-bold ${light ? "text-cream" : "text-forest"}`}>📦 {PACKAGING.title}</h3>
          <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{PACKAGING.body}</p>
        </div>
        <div className="text-right" lang="ar" dir="rtl">
          <h3 className={`font-ar text-2xl ${light ? "text-gold" : "text-leaf"}`}>{PACKAGING.title_ar}</h3>
          <p className={`font-ar mt-2 text-sm leading-loose ${muted}`}>{PACKAGING.body_ar}</p>
        </div>
      </div>
    </>
  );
}
