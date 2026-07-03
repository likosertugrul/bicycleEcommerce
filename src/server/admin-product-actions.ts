"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ProductCondition, BikeType, SellerType } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/admin";
import { slugify } from "@/lib/slug";
import { uploadImages } from "@/server/upload";

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
  };
}

/** Textarea/virgülle ayrılmış URL'leri diziye çevir. */
function urlLines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
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

  let urls: string[];
  try {
    urls = await uploadImages(formData.getAll("imageFiles"), "products");
    urls.push(...urlLines(formData.get("imageUrls")));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Görsel yüklenemedi." };
  }

  const prisma = getPrisma();
  const slug = await uniqueSlug(prisma, slugify(d.title));
  await prisma.product.create({
    data: {
      ...d,
      priceCents: d.priceCents,
      slug,
      isPlaceholder: false,
      images: urls.length
        ? {
            create: urls.map((url, i) => ({
              url,
              alt: d.title,
              isCover: i === 0,
              position: i,
            })),
          }
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

  let newUrls: string[];
  try {
    newUrls = await uploadImages(formData.getAll("imageFiles"), "products");
    newUrls.push(...urlLines(formData.get("imageUrls")));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Görsel yüklenemedi." };
  }

  const prisma = getPrisma();
  await prisma.product.update({
    where: { id },
    data: { ...d, priceCents: d.priceCents },
  });

  if (newUrls.length) {
    const existingCount = await prisma.productImage.count({ where: { productId: id } });
    const coverCount = await prisma.productImage.count({
      where: { productId: id, isCover: true },
    });
    await prisma.productImage.createMany({
      data: newUrls.map((url, i) => ({
        productId: id,
        url,
        alt: d.title,
        isCover: coverCount === 0 && i === 0,
        position: existingCount + i,
      })),
    });
  }
  revalidatePath("/admin/urunler");
  redirect("/admin/urunler");
}

/** Ürün görselini sil (kapaksa sıradakini kapak yap). */
export async function deleteProductImage(imageId: string): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  const img = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: { productId: true, isCover: true },
  });
  if (!img) return;
  await prisma.productImage.delete({ where: { id: imageId } });
  if (img.isCover) {
    const next = await prisma.productImage.findFirst({
      where: { productId: img.productId },
      orderBy: { position: "asc" },
    });
    if (next)
      await prisma.productImage.update({ where: { id: next.id }, data: { isCover: true } });
  }
  revalidatePath(`/admin/urunler/${img.productId}`);
}

/** Görseli sırada bir sola/sağa taşı (komşuyla yer değiştir). */
export async function moveProductImage(
  imageId: string,
  dir: "left" | "right",
): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  const img = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: { productId: true },
  });
  if (!img) return;
  const siblings = await prisma.productImage.findMany({
    where: { productId: img.productId },
    orderBy: { position: "asc" },
  });
  const idx = siblings.findIndex((s) => s.id === imageId);
  const swap = dir === "left" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= siblings.length) return;
  const a = siblings[idx];
  const b = siblings[swap];
  await prisma.$transaction([
    prisma.productImage.update({ where: { id: a.id }, data: { position: b.position } }),
    prisma.productImage.update({ where: { id: b.id }, data: { position: a.position } }),
  ]);
  revalidatePath(`/admin/urunler/${img.productId}`);
}

/** Görseli kapak yap (diğerlerini kaldır). */
export async function setCoverImage(imageId: string): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  const img = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: { productId: true },
  });
  if (!img) return;
  await prisma.$transaction([
    prisma.productImage.updateMany({
      where: { productId: img.productId },
      data: { isCover: false },
    }),
    prisma.productImage.update({ where: { id: imageId }, data: { isCover: true } }),
  ]);
  revalidatePath(`/admin/urunler/${img.productId}`);
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
