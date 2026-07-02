"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { WISHLIST_COOKIE, parseFavIds } from "@/lib/wishlist-cookie";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 gün
const MAX_FAVS = 100;

async function writeFavs(ids: string[]): Promise<void> {
  const store = await cookies();
  if (ids.length === 0) {
    store.delete(WISHLIST_COOKIE);
    return;
  }
  store.set(WISHLIST_COOKIE, JSON.stringify(ids.slice(0, MAX_FAVS)), {
    httpOnly: false, // client ilk durumu okuyabilsin
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

async function readFavs(): Promise<string[]> {
  const store = await cookies();
  return parseFavIds(store.get(WISHLIST_COOKIE)?.value);
}

/** Favoriyi aç/kapat. Dönen değer: işlem sonrası favoride mi? */
export async function toggleFavorite(productId: string): Promise<boolean> {
  const favs = await readFavs();
  if (favs.includes(productId)) {
    await writeFavs(favs.filter((id) => id !== productId));
    revalidatePath("/favorilerim");
    return false;
  }
  // Eklemeden önce ürünün gerçekten var/aktif olduğunu doğrula.
  const prisma = getPrisma();
  const exists = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { id: true },
  });
  if (!exists) return false;
  await writeFavs([...favs, productId]);
  revalidatePath("/favorilerim");
  return true;
}

/** Favoriden çıkar. */
export async function removeFavorite(productId: string): Promise<void> {
  const favs = await readFavs();
  await writeFavs(favs.filter((id) => id !== productId));
  revalidatePath("/favorilerim");
}

/** Tüm favorileri temizle. */
export async function clearWishlist(): Promise<void> {
  await writeFavs([]);
  revalidatePath("/favorilerim");
}
