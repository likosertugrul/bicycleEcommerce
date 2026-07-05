"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { OrderStatus, Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { getAuthUser } from "@/server/auth";
import { requireAdmin } from "@/server/admin";
import { getCart, CART_COOKIE } from "@/server/cart";
import { computeShipping } from "@/server/orders";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function genOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BD-${ymd}-${rnd}`;
}

export interface OrderFormState {
  error?: string;
}

// Sipariş oluştur. Fiyat/toplam SUNUCUDA sepetten yeniden hesaplanır.
export async function createOrder(
  _prev: OrderFormState,
  fd: FormData,
): Promise<OrderFormState> {
  const prisma = getPrisma();
  const cart = await getCart();
  if (cart.items.length === 0) return { error: "Your cart is empty." };

  const fulfillment = s(fd, "fulfillment") === "PICKUP" ? "PICKUP" : "DELIVERY";
  const user = await getAuthUser();

  let shippingAddress: Prisma.InputJsonValue | undefined;
  let email = s(fd, "email");
  let phone = s(fd, "phone");

  if (fulfillment === "DELIVERY") {
    if (user) {
      const addr = await prisma.address.findFirst({
        where: { id: s(fd, "addressId"), userId: user.id },
      });
      if (!addr) return { error: "Please select a shipping address." };
      shippingAddress = {
        recipient: addr.recipient, phone: addr.phone, city: addr.city,
        district: addr.district, fullAddress: addr.fullAddress, zipCode: addr.zipCode,
      };
      phone = addr.phone;
    } else {
      const recipient = s(fd, "recipient");
      const city = s(fd, "city");
      const district = s(fd, "district");
      const fullAddress = s(fd, "fullAddress");
      if (!recipient || !phone || !city || !district || !fullAddress)
        return { error: "Please fill in all shipping details." };
      shippingAddress = {
        recipient, phone, city, district, fullAddress,
        zipCode: s(fd, "zipCode") || null,
      };
    }
  }

  if (user?.email) email = user.email;
  if (!email || !email.includes("@"))
    return { error: "Please enter a valid email address." };
  if (!user && fulfillment === "PICKUP" && !phone)
    return { error: "Please enter a phone number for contact." };

  const subtotal = cart.subtotalCents;
  const shipping = computeShipping(subtotal, fulfillment);
  const total = subtotal + shipping;

  let orderId = "";
  try {
    const order = await prisma.$transaction(async (tx) => {
      // Stok kontrolü (sipariş anında)
      for (const it of cart.items) {
        const p = await tx.product.findUnique({
          where: { id: it.productId },
          select: { stock: true },
        });
        if (!p || p.stock < it.quantity)
          throw new Error(`Out of stock: ${it.title}`);
      }
      const created = await tx.order.create({
        data: {
          userId: user?.id ?? null,
          orderNumber: genOrderNumber(),
          status: "PENDING",
          guestEmail: user ? null : email,
          guestPhone: user ? null : phone || null,
          fulfillment,
          subtotalCents: subtotal,
          shippingCents: shipping,
          totalCents: total,
          shippingAddress: shippingAddress ?? undefined,
          items: {
            create: cart.items.map((it) => ({
              productId: it.productId,
              productTitle: it.title,
              unitCents: it.unitCents,
              quantity: it.quantity,
              lineCents: it.lineCents,
            })),
          },
          payment: {
            create: { amountCents: total, status: "PENDING", provider: "manual" },
          },
        },
      });
      for (const it of cart.items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.quantity } },
        });
      }
      return created;
    });
    orderId = order.id;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create order." };
  }

  // Sepeti boşalt
  (await cookies()).set(CART_COOKIE, "", { maxAge: 0, path: "/" });
  redirect(`/order/${orderId}`);
}

// --- Admin ---

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await requireAdmin();
  if (!(status in OrderStatus)) return;
  const prisma = getPrisma();
  await prisma.order.update({
    where: { id },
    data: { status: status as OrderStatus },
  });
  if (status === "PAID") {
    await prisma.payment.updateMany({
      where: { orderId: id },
      data: { status: "PAID" },
    });
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function setTrackingCode(id: string, fd: FormData): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  const code = String(fd.get("trackingCode") ?? "").trim();
  await prisma.order.update({
    where: { id },
    data: { trackingCode: code || null },
  });
  revalidatePath(`/admin/orders/${id}`);
}
