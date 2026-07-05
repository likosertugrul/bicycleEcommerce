"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { CART_COOKIE, getCartLines, type CartLine } from "./cart";

const MAX_QTY_PER_LINE = 10;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 gün

async function writeCart(lines: CartLine[]): Promise<void> {
  const store = await cookies();
  const clean = lines.filter((l) => l.quantity > 0);
  if (clean.length === 0) {
    store.delete(CART_COOKIE);
    return;
  }
  store.set(CART_COOKIE, JSON.stringify(clean), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/** Ürünü sepete ekle (varsa miktarı artır). Stok ve varlık DB'den doğrulanır. */
export async function addToCart(productId: string, quantity = 1): Promise<void> {
  const prisma = getPrisma();
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { id: true, stock: true },
  });
  if (!product || product.stock <= 0) return;

  const lines = await getCartLines();
  const existing = lines.find((l) => l.productId === productId);
  const nextQty = Math.min(
    (existing?.quantity ?? 0) + Math.max(1, Math.floor(quantity)),
    product.stock,
    MAX_QTY_PER_LINE,
  );

  const updated = existing
    ? lines.map((l) => (l.productId === productId ? { ...l, quantity: nextQty } : l))
    : [...lines, { productId, quantity: nextQty }];

  await writeCart(updated);
  revalidatePath("/cart");
}

/** Bir satırın miktarını belirli değere ayarla (0 veya altı → kaldır). */
export async function setQuantity(
  productId: string,
  quantity: number,
): Promise<void> {
  const qty = Math.floor(quantity);
  if (qty <= 0) return removeFromCart(productId);

  const prisma = getPrisma();
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    select: { stock: true },
  });
  const cap = Math.min(product?.stock ?? 0, MAX_QTY_PER_LINE);
  const lines = await getCartLines();
  const updated = lines.map((l) =>
    l.productId === productId ? { ...l, quantity: Math.min(qty, cap) } : l,
  );
  await writeCart(updated);
  revalidatePath("/cart");
}

/** Satırı sepetten çıkar. */
export async function removeFromCart(productId: string): Promise<void> {
  const lines = await getCartLines();
  await writeCart(lines.filter((l) => l.productId !== productId));
  revalidatePath("/cart");
}

/** Sepeti tamamen boşalt. */
export async function clearCart(): Promise<void> {
  await writeCart([]);
  revalidatePath("/cart");
}
