import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { ProductCondition } from "@/lib/types";

// Sepet cookie'de yalnızca {productId, quantity} tutar — FİYAT ASLA burada tutulmaz.
// Toplamlar her zaman DB'den (ürün ID'lerinden) sunucuda yeniden hesaplanır.

export const CART_COOKIE = "bisiklet_cart";
const MAX_QTY_PER_LINE = 10;

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CartItemView {
  productId: string;
  slug: string;
  title: string;
  image: string | null;
  imageAlt: string;
  condition: ProductCondition;
  unitCents: number;
  quantity: number;
  lineCents: number;
  stock: number;
}

export interface CartView {
  items: CartItemView[];
  count: number;
  subtotalCents: number;
}

/** Cookie'den ham sepet satırlarını oku (bozuksa boş). */
export async function getCartLines(): Promise<CartLine[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is CartLine =>
          l &&
          typeof l.productId === "string" &&
          Number.isFinite(l.quantity) &&
          l.quantity > 0,
      )
      .map((l) => ({
        productId: l.productId,
        quantity: Math.min(Math.floor(l.quantity), MAX_QTY_PER_LINE),
      }));
  } catch {
    return [];
  }
}

/**
 * Sepeti DB verisiyle zenginleştir ve toplamları SUNUCUDA hesapla.
 * Silinmiş/pasif/stoksuz ürünler düşürülür; miktar stoğa göre kırpılır.
 */
export async function getCart(): Promise<CartView> {
  const lines = await getCartLines();
  if (lines.length === 0) return { items: [], count: 0, subtotalCents: 0 };

  const products = await prisma.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) }, isActive: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const items: CartItemView[] = [];
  for (const line of lines) {
    const p = byId.get(line.productId);
    if (!p || p.stock <= 0) continue;
    const quantity = Math.min(line.quantity, p.stock);
    const cover = p.images[0];
    items.push({
      productId: p.id,
      slug: p.slug,
      title: p.title,
      image: cover?.url ?? null,
      imageAlt: cover?.alt ?? p.title,
      condition: p.condition as ProductCondition,
      unitCents: p.priceCents,
      quantity,
      lineCents: p.priceCents * quantity,
      stock: p.stock,
    });
  }

  const subtotalCents = items.reduce((sum, i) => sum + i.lineCents, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, count, subtotalCents };
}

/** Yalnızca sepetteki toplam adet (header rozeti için hafif sorgu). */
export async function getCartCount(): Promise<number> {
  const lines = await getCartLines();
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
