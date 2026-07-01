import { getCartCount } from "@/server/cart";

// Header rozeti için hafif sepet adedi. Cookie okuduğundan dinamiktir.
export async function GET() {
  const count = await getCartCount();
  return Response.json(
    { count },
    { headers: { "Cache-Control": "no-store" } },
  );
}
