export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-5 py-12" aria-busy="true" aria-label="Loading products">
      <div className="h-4 w-24 rounded bg-ink/10" />
      <div className="mt-3 h-16 w-80 rounded-2xl bg-ink/10" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[230px_1fr]">
        <div className="hidden space-y-3 lg:block">{Array.from({ length: 7 }, (_, i) => <div key={i} className="h-8 rounded-xl bg-ink/10" />)}</div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[4/6] rounded-[24px] border-2 border-ink/10 bg-ink/5" />)}
        </div>
      </div>
    </div>
  );
}
