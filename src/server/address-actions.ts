"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { getAuthUser, ensureUserRow } from "@/server/auth";

export interface AddressInput {
  title?: string;
  recipient: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  zipCode?: string;
}

export type AddressResult = { ok: true } | { ok: false; error: string };

function clean(i: AddressInput) {
  return {
    title: i.title?.trim() || null,
    recipient: i.recipient.trim(),
    phone: i.phone.trim(),
    city: i.city.trim(),
    district: i.district.trim(),
    fullAddress: i.fullAddress.trim(),
    zipCode: i.zipCode?.trim() || null,
  };
}

function invalid(i: AddressInput): boolean {
  return (
    !i.recipient?.trim() ||
    !i.phone?.trim() ||
    !i.city?.trim() ||
    !i.district?.trim() ||
    !i.fullAddress?.trim()
  );
}

/** Yeni adres ekle (ilk adres otomatik varsayılan). */
export async function addAddress(input: AddressInput): Promise<AddressResult> {
  const user = await getAuthUser();
  if (!user) return { ok: false, error: "auth" };
  if (invalid(input)) return { ok: false, error: "required" };

  await ensureUserRow(user);
  const prisma = getPrisma();
  const count = await prisma.address.count({ where: { userId: user.id } });
  await prisma.address.create({
    data: { userId: user.id, ...clean(input), isDefault: count === 0 },
  });
  revalidatePath("/adreslerim");
  return { ok: true };
}

/** Adresi güncelle (yalnızca sahibi). */
export async function updateAddress(
  id: string,
  input: AddressInput,
): Promise<AddressResult> {
  const user = await getAuthUser();
  if (!user) return { ok: false, error: "auth" };
  if (invalid(input)) return { ok: false, error: "required" };

  const prisma = getPrisma();
  await prisma.address.updateMany({
    where: { id, userId: user.id },
    data: clean(input),
  });
  revalidatePath("/adreslerim");
  return { ok: true };
}

/** Adresi sil; varsayılansa kalan ilk adresi varsayılan yap. */
export async function deleteAddress(id: string): Promise<AddressResult> {
  const user = await getAuthUser();
  if (!user) return { ok: false, error: "auth" };

  const prisma = getPrisma();
  await prisma.address.deleteMany({ where: { id, userId: user.id } });

  const remaining = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
    await prisma.address.update({
      where: { id: remaining[0].id },
      data: { isDefault: true },
    });
  }
  revalidatePath("/adreslerim");
  return { ok: true };
}

/** Adresi varsayılan yap (diğerlerini kaldır). */
export async function setDefaultAddress(id: string): Promise<AddressResult> {
  const user = await getAuthUser();
  if (!user) return { ok: false, error: "auth" };

  const prisma = getPrisma();
  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    }),
    prisma.address.updateMany({
      where: { id, userId: user.id },
      data: { isDefault: true },
    }),
  ]);
  revalidatePath("/adreslerim");
  return { ok: true };
}
