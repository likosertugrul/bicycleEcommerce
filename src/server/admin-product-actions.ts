"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ProductCondition, BikeType, SellerType } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/admin";
import { slugify } from "@/lib/slug";

export type AdminFormState = { error?: string };

const CONDITIONS = ["NEW", "USED"] as const;
const BIKE_TYPES = [
  "MOUNTAIN",
  "ROAD",
  "CITY",
  "ELECTRIC",
  "KIDS",
  "GRAVEL",
] as const;

function parse(fd: FormData) {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  const numOrNull = (k: string) => {
    const v = s(k);
    return v ? Number(v) : null;
  };
  const centsOrNull = (k: string) => {
    const v = s(k);
    return v ? Math.round(Number(v) * 100) : null;
  };

  const condRaw = s("condition");
  const btRaw = s("bikeType");
  const condition = (CONDITIONS as readonly string[]).includes(condRaw)
    ? (condRaw as ProductCondition)
    : ProductCondition.NEW;
  const bikeType = (BIKE_TYPES as readonly string[]).includes(btRaw)
    ? (btRaw as BikeType)
    : null;

  return {
    title: s("title"),
    description: s("description") || null,
    brand: s("brand") || null,
    condition,
    sellerType: SellerType.SHOP,
    bikeType,
    frameSize: s("frameSize") || null,
    wheelSize: numOrNull("wheelSize"),
    gearCount: numOrNull("gearCount"),
    brakeType: s("brakeType") || null,
    color: s("color") || null,
    priceCents: centsOrNull("priceTL"),
    compareAtCents: centsOrNull("compareTL"),
    stock: numOrNull("stock") ?? 0,
    usageLevel: s("usageLevel") || null,
    manufactureYear: numOrNull("manufactureYear"),
    cosmeticNotes: s("cosmeticNotes") || null,
    mileageKm: numOrNull("mileageKm"),
    isActive: fd.get("isActive") === "on",
    coverImageUrl: s("coverImageUrl") || null,
  };
}

async function uniqueSlug(
  prisma: ReturnType<typeof getPrisma>,
  base: string,
  excludeId?: string,
): Promise<string> {
  const root = base || "urun";
  let slug = root;
  let n = 1;
  // Aynı slug başkasındaysa sonek ekle.
  while (true) {
    const hit = await prisma.product.findUnique({ where: { slug } });
    if (!hit || hit.id === excludeId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

export async function createProduct(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const d = parse(formData);
  if (!d.title) return { error: "Başlık zorunlu." };
  if (d.priceCents == null || d.priceCents < 0)
    return { error: "Geçerli bir fiyat girin." };

  const prisma = getPrisma();
  const slug = await uniqueSlug(prisma, slugify(d.title));
  const { coverImageUrl, ...fields } = d;
  await prisma.product.create({
    data: {
      ...fields,
      priceCents: d.priceCents,
      slug,
      isPlaceholder: false,
      images: coverImageUrl
        ? { create: { url: coverImageUrl, alt: d.title, isCover: true, position: 0 } }
        : undefined,
    },
  });
  revalidatePath("/admin/urunler");
  redirect("/admin/urunler");
}

export async function updateProduct(
  id: string,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();
  const d = parse(formData);
  if (!d.title) return { error: "Başlık zorunlu." };
  if (d.priceCents == null || d.priceCents < 0)
    return { error: "Geçerli bir fiyat girin." };

  const prisma = getPrisma();
  const { coverImageUrl, ...fields } = d;
  await prisma.product.update({
    where: { id },
    data: { ...fields, priceCents: d.priceCents },
  });

  if (coverImageUrl) {
    const existing = await prisma.productImage.findFirst({
      where: { productId: id, isCover: true },
    });
    if (existing) {
      await prisma.productImage.update({
        where: { id: existing.id },
        data: { url: coverImageUrl, alt: d.title },
      });
    } else {
      await prisma.productImage.create({
        data: { productId: id, url: coverImageUrl, alt: d.title, isCover: true, position: 0 },
      });
    }
  }
  revalidatePath("/admin/urunler");
  redirect("/admin/urunler");
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/urunler");
}

export async function toggleActive(id: string): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  const p = await prisma.product.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (p) {
    await prisma.product.update({
      where: { id },
      data: { isActive: !p.isActive },
    });
    revalidatePath("/admin/urunler");
  }
}
