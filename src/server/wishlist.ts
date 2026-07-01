import "server-only";
import { cookies } from "next/headers";
import { getProductsByIds } from "@/server/products";
import { WISHLIST_COOKIE, parseFavIds } from "@/lib/wishlist-cookie";
import type { Product } from "@/lib/types";

/** Cookie'deki favori ürün ID'leri. */
export async function getFavIds(): Promise<string[]> {
  const store = await cookies();
  return parseFavIds(store.get(WISHLIST_COOKIE)?.value);
}

/** Favori ürünler (DB'den, favori sırasında). */
export async function getWishlist(): Promise<Product[]> {
  return getProductsByIds(await getFavIds());
}

/** Header rozeti için favori adedi. */
export async function getWishlistCount(): Promise<number> {
  return (await getFavIds()).length;
}
