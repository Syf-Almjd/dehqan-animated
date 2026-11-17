import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import { getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Checkout" };

export default async function Checkout() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");
  return <CheckoutForm email={user.email} name={user.name ?? ""} />;
}
