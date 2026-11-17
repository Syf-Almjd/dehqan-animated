import { getProducts } from "@/lib/queries";
import { toCard } from "@/lib/types";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim().slice(0, 60) ?? "";
  const products = await getProducts(q ? { q, limit: 6 } : { featured: true, limit: 4 });
  return Response.json(products.map(toCard));
}
