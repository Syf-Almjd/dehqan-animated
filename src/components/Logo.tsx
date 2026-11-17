/** Dehqan Farms mark: a wheat sheaf in a gold seal, with the bilingual wordmark. */
export function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#123321" stroke="#c99a2e" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#c99a2e" strokeWidth=".6" strokeDasharray="1.5 2" />
      <g fill="none" stroke="#c99a2e" strokeWidth="1.6" strokeLinecap="round">
        <path d="M20 31V12" />
        <path d="M20 14c-3-1-4.5-3.5-4.5-6 3 .5 4.5 2.5 4.5 6ZM20 14c3-1 4.5-3.5 4.5-6-3 .5-4.5 2.5-4.5 6Z" fill="#c99a2e" />
        <path d="M20 19.5c-3-1-4.5-3.5-4.5-6 3 .5 4.5 2.5 4.5 6ZM20 19.5c3-1 4.5-3.5 4.5-6-3 .5-4.5 2.5-4.5 6Z" fill="#c99a2e" />
        <path d="M20 25c-3-1-4.5-3.5-4.5-6 3 .5 4.5 2.5 4.5 6ZM20 25c3-1 4.5-3.5 4.5-6-3 .5-4.5 2.5-4.5 6Z" fill="#c99a2e" />
      </g>
    </svg>
  );
}

export default function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark />
      <span className="flex flex-col leading-none">
        <span className={`font-display whitespace-nowrap text-[1.15rem] font-bold sm:text-[1.35rem] ${light ? "text-cream" : "text-forest"}`}>
          <span className="text-gold">Dehqan</span> Farms
        </span>
        <span className="font-ar mt-0.5 text-[.7rem] text-gold" lang="ar" dir="rtl">دهقان فارمز</span>
      </span>
    </span>
  );
}
