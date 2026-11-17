export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-5 py-10" aria-busy="true" aria-label="Loading product">
      <div className="h-4 w-40 rounded bg-ink/10" />
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="aspect-square rounded-[24px] bg-ink/10" />
        <div className="space-y-4 pt-4"><div className="h-6 w-28 rounded-full bg-ink/10" /><div className="h-20 w-4/5 rounded-2xl bg-ink/10" /><div className="h-10 w-32 rounded-xl bg-ink/10" /><div className="h-24 rounded-2xl bg-ink/10" /><div className="h-12 rounded-full bg-ink/10" /></div>
      </div>
    </div>
  );
}
