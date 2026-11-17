import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/queries";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (!user.isAdmin)
    return <div className="mx-auto max-w-lg px-5 py-24 text-center"><h1 className="font-display text-5xl font-extrabold">Admins only</h1><p className="mt-3 opacity-70">Your account doesn&apos;t have admin access. See the README to grant it.</p></div>;
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <nav className="mb-8 flex gap-2 text-sm font-bold">
        {[["/admin", "Overview"], ["/admin/products", "Products"], ["/admin/orders", "Orders"], ["/admin/coupons", "Coupons"]].map(([h, l]) => <Link key={h} href={h} className="rounded-full border-2 border-ink bg-white px-4 py-1.5 hover:bg-lemon">{l}</Link>)}
      </nav>
      {children}
    </div>
  );
}
