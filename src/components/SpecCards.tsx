export type Spec = { label: string; label_ar: string; value: string; value_ar: string };

/** The three spec tiles used for Saffron / Shilajit in the catalogue (Origin · Grade · Harvest …). */
export default function SpecCards({ specs, light }: { specs: Spec[]; light?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {specs.map((s) => (
        <div key={s.label} className={`rounded-2xl border p-5 text-center ${light ? "border-gold/30 bg-cream/5" : "border-gold/30 bg-[#fbf6ea]"}`}>
          <p className="eyebrow !text-[.62rem]">{s.label} · <span className="font-ar tracking-normal" lang="ar">{s.label_ar}</span></p>
          <p className={`font-display mt-2 text-xl font-bold ${light ? "text-cream" : "text-forest"}`}>{s.value}</p>
          <p className="font-ar text-lg text-gold" lang="ar" dir="rtl">{s.value_ar}</p>
        </div>
      ))}
    </div>
  );
}
