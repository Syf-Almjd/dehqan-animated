const STAR = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z";

export default function Stars({ value, size = 16, className = "" }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs><clipPath id={`s${i}-${Math.round(fill * 100)}`}><rect width={24 * fill} height="24" /></clipPath></defs>
            <path d={STAR} fill="#14110f22" />
            <path d={STAR} fill="#ffb800" stroke="#14110f" strokeWidth="1.4" clipPath={`url(#s${i}-${Math.round(fill * 100)})`} />
            <path d={STAR} fill="none" stroke="#14110f" strokeWidth="1.4" />
          </svg>
        );
      })}
    </span>
  );
}
