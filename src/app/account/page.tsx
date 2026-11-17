import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { getCurrentUser, getMyOrders } from "@/lib/queries";
import { logout } from "@/app/actions/auth";
import { dateFmt, money } from "@/lib/format";

export const metadata = { title: "Account" };
const STATUS_COLOR: Record<string, string> = { pending: "bg-gold", paid: "bg-sky text-white", shipped: "bg-grape text-white", delivered: "bg-mint text-white", cancelled: "bg-ink/10" };

export default async function Account() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  const orders = await getMyOrders();
  const spent = orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total_cents, 0);
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Reveal>
        <h1 className="font-display text-6xl font-bold md:text-7xl">Hey{user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋</h1>
        <p className="mt-1 opacity-65">{user.email}</p>
      </Reveal>
      <RevealGroup className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Orders", String(orders.length)], ["Total spent", money(spent)]].map(([l, v]) => (
          <div key={l} className="card p-5"><p className="label">{l}</p><p className="font-display text-3xl font-bold">{v}</p></div>
        ))}
        <Link href="/wishlist" className="card p-5 transition-colors hover:bg-gold"><p className="label">Wishlist</p><p className="font-display text-3xl font-bold">♥ →</p></Link>
        <form action={logout} className="card grid p-5 transition-colors hover:bg-leaf hover:text-white"><button className="text-left"><p className="label">Done?</p><p className="font-display text-3xl font-bold">Sign out</p></button></form>
      </RevealGroup>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="font-display text-3xl font-bold">Your orders</h2>
          {orders.length === 0 ? (
            <div className="card mt-4 p-8 text-center"><p className="font-semibold">No orders yet.</p><Link href="/products" className="btn btn-primary mt-4">Shop now</Link></div>
          ) : (
            <RevealGroup className="mt-4 space-y-3">
              {orders.map((o) => (
                <Link key={o.id} href={`/orders/${o.id}`} className="card flex items-center justify-between gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_28px_50px_-28px_rgba(18,51,33,.55)]">
                  <div><p className="font-bold">#{o.id.slice(0, 8).toUpperCase()}</p><p className="text-sm opacity-60">{dateFmt(o.created_at)} · {o.order_items?.reduce((n, i) => n + i.qty, 0)} items</p></div>
                  <div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${STATUS_COLOR[o.status]}`}>{o.status}</span><p className="font-bold">{money(o.total_cents)}</p></div>
                </Link>
              ))}
            </RevealGroup>
          )}
        </div>
        <div className="space-y-4">
          <ProfileForm name={user.name ?? ""} email={user.email} />
          {user.isAdmin && <Link href="/admin" className="btn btn-dark w-full">Open admin dashboard</Link>}
        </div>
      </div>
    </div>
  );
}
