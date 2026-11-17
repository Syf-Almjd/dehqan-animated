import HeaderClient from "./HeaderClient";
import { getCurrentUser } from "@/lib/queries";

export default async function Header() {
  const user = await getCurrentUser();
  return <HeaderClient user={user ? { name: user.name, email: user.email, isAdmin: user.isAdmin } : null} />;
}
