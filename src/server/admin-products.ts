import "server-only";
import { getPrisma } from "@/lib/prisma";

/** Admin ürün listesi (pasifler dahil, kapak görseliyle). */
export async function getAdminProducts() {
  const prisma = getPrisma();
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { where: { isCover: true }, take: 1 } },
  });
}

/** Tek ürün (düzenleme formu). */
export async function getAdminProduct(id: string) {
  const prisma = getPrisma();
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

/** Dashboard sayıları. */
export async function getAdminStats() {
  const prisma = getPrisma();
  const [total, active, used, lowStock, orders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { condition: "USED" } }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 2 } } }),
    prisma.order.count(),
  ]);
  return { total, active, used, lowStock, orders };
}
