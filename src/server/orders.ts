import "server-only";
import { getPrisma } from "@/lib/prisma";
import { getAuthUser } from "@/server/auth";

// Kargo: $15 sabit, $500 üzeri ücretsiz; mağazadan teslim ücretsiz.
export const SHIPPING_FLAT_CENTS = 1500;
export const FREE_SHIPPING_OVER_CENTS = 50000;

export function computeShipping(
  subtotalCents: number,
  fulfillment: "DELIVERY" | "PICKUP",
): number {
  if (fulfillment === "PICKUP") return 0;
  if (subtotalCents >= FREE_SHIPPING_OVER_CENTS) return 0;
  return SHIPPING_FLAT_CENTS;
}

export interface ShippingAddress {
  recipient: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  zipCode?: string | null;
}

export interface OrderItemView {
  productTitle: string;
  unitCents: number;
  quantity: number;
  lineCents: number;
  slug: string | null;
  image: string | null;
}

export interface OrderView {
  id: string;
  orderNumber: string;
  status: string;
  fulfillment: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  guestEmail: string | null;
  guestPhone: string | null;
  shippingAddress: ShippingAddress | null;
  trackingCode: string | null;
  userId: string | null;
  createdAt: Date;
  items: OrderItemView[];
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: string;
  fulfillment: string;
  totalCents: number;
  itemCount: number;
  createdAt: Date;
  customer?: string; // admin listesi için
}

function toView(o: {
  id: string; orderNumber: string; status: string; fulfillment: string;
  subtotalCents: number; shippingCents: number; totalCents: number;
  guestEmail: string | null; guestPhone: string | null;
  shippingAddress: unknown; trackingCode: string | null;
  userId: string | null; createdAt: Date;
  items: { productTitle: string; unitCents: number; quantity: number; lineCents: number;
    product: { slug: string; images: { url: string }[] } | null }[];
}): OrderView {
  return {
    id: o.id, orderNumber: o.orderNumber, status: o.status, fulfillment: o.fulfillment,
    subtotalCents: o.subtotalCents, shippingCents: o.shippingCents, totalCents: o.totalCents,
    guestEmail: o.guestEmail, guestPhone: o.guestPhone,
    shippingAddress: (o.shippingAddress as ShippingAddress | null) ?? null,
    trackingCode: o.trackingCode, userId: o.userId, createdAt: o.createdAt,
    items: o.items.map((it) => ({
      productTitle: it.productTitle, unitCents: it.unitCents,
      quantity: it.quantity, lineCents: it.lineCents,
      slug: it.product?.slug ?? null, image: it.product?.images[0]?.url ?? null,
    })),
  };
}

const ITEM_INCLUDE = {
  items: {
    include: {
      product: { select: { slug: true, images: { where: { isCover: true }, take: 1, select: { url: true } } } },
    },
  },
} as const;

/** Tek sipariş (onay/detay). UUID ile — bağlantıyı bilen görebilir. */
export async function getOrderById(id: string): Promise<OrderView | null> {
  const prisma = getPrisma();
  const o = await prisma.order.findUnique({ where: { id }, include: ITEM_INCLUDE });
  return o ? toView(o) : null;
}

/** Giriş yapmış kullanıcının siparişleri (özet). */
export async function getMyOrders(): Promise<OrderListItem[]> {
  const user = await getAuthUser();
  if (!user) return [];
  const prisma = getPrisma();
  const rows = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });
  return rows.map((o) => ({
    id: o.id, orderNumber: o.orderNumber, status: o.status, fulfillment: o.fulfillment,
    totalCents: o.totalCents, itemCount: o._count.items, createdAt: o.createdAt,
  }));
}

/** Admin: tüm siparişler. */
export async function getAdminOrders(): Promise<OrderListItem[]> {
  const prisma = getPrisma();
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { _count: { select: { items: true } }, user: { select: { fullName: true, email: true } } },
  });
  return rows.map((o) => ({
    id: o.id, orderNumber: o.orderNumber, status: o.status, fulfillment: o.fulfillment,
    totalCents: o.totalCents, itemCount: o._count.items, createdAt: o.createdAt,
    customer: o.user?.fullName || o.user?.email || o.guestEmail || "Misafir",
  }));
}

export async function getAdminOrder(id: string): Promise<OrderView | null> {
  return getOrderById(id);
}
