import { Reveal } from "./Reveal";

type Props = {
  kicker?: string; kicker_ar?: string;
  title: string; title_ar?: string;
  sub?: string; sub_ar?: string;
  light?: boolean; className?: string;
};

/** The catalogue's bilingual heading: English left, Arabic right, gold rule underneath. */
export default function SectionHeading({ kicker, kicker_ar, title, title_ar, sub, sub_ar, light, className = "" }: Props) {
  const tone = light ? "text-cream" : "text-forest";
  return (
    <Reveal className={className}>
      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-4">
        <div className="min-w-0 flex-1">
          {kicker && <p className="eyebrow">{kicker}</p>}
          <h2 className={`font-display mt-2 text-4xl font-bold leading-[1.05] md:text-6xl ${tone}`}>{title}</h2>
          <span className="gold-rule mt-4" />
          {sub && <p className={`font-display mt-4 max-w-lg text-lg italic ${light ? "text-cream/70" : "text-ink/65"}`}>{sub}</p>}
        </div>
        {title_ar && (
          <div className="min-w-0 flex-1 text-right" lang="ar" dir="rtl">
            {kicker_ar && <p className="font-ar text-sm font-semibold text-gold">{kicker_ar}</p>}
            <p className={`font-ar mt-1 text-4xl leading-[1.3] md:text-6xl ${tone}`}>{title_ar}</p>
            <span className="gold-rule mt-3 mr-0 ml-auto" />
            {sub_ar && <p className={`font-ar mt-4 mr-0 ml-auto max-w-lg text-lg leading-loose ${light ? "text-cream/60" : "text-ink/60"}`}>{sub_ar}</p>}
          </div>
        )}
      </div>
    </Reveal>
  );
}
