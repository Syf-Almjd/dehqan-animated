export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-center gap-1.5 text-2xl font-extrabold ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="12" fill="#ff4a1c" stroke="#14110f" strokeWidth="2.5" /><circle cx="9" cy="9" r="2.4" fill="#fff" /><circle cx="16" cy="15" r="1.6" fill="#fff" /><circle cx="10" cy="17" r="1.1" fill="#fff" /></svg>
      fizzo
    </span>
  );
}
