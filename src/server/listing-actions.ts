"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { BikeType, ProductCondition, SellerType, ListingStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { getAuthUser, ensureUserRow } from "@/server/auth";
import { requireAdmin } from "@/server/admin";
import { slugify } from "@/lib/slug";
import { uploadImages } from "@/server/upload";
import { getCurrency } from "@/lib/locale";
import { isCurrency, RATES } from "@/lib/currency";

export type ListingState = { error?: string };

const BIKE_TYPES = ["MOUNTAIN", "ROAD", "CITY", "ELECTRIC", "KIDS", "GRAVEL"] as const;

/** Kullanıcı: yeni ilan gönder (giriş şart). */
export async function createListing(
  _prev: ListingState,
  fd: FormData,
): Promise<ListingState> {
  const user = await getAuthUser();
  if (!user) return { error: "login" };

  const s = (k: string) => String(fd.get(k) ?? "").trim();
  const title = s("title");
  if (!title) return { error: "title" };

  const btRaw = s("bikeType");
  const bikeType = (BIKE_TYPES as readonly string[]).includes(btRaw)
    ? (btRaw as BikeType)
    : null;
  const wheel = s("wheelSize");
  const askingRaw = s("askingPrice");

  // Girilen fiyat, sitedeki seçili para biriminde → TRY kuruşa çevir ve öyle sakla.
  const curRaw = s("currency");
  const currency = isCurrency(curRaw) ? curRaw : await getCurrency();
  const amount = askingRaw ? Number(askingRaw) : null;
  const askingPriceCents =
    amount != null && Number.isFinite(amount) && amount > 0
      ? Math.round((amount / RATES[currency]) * 100)
      : null;

  let images: string[];
  try {
    images = await uploadImages(fd.getAll("imageFiles"), "listings");
    images.push(
      ...fd
        .getAll("imageUrls")
        .flatMap((v) =>
          String(v)
            .split(/[\n,]+/)
            .map((x) => x.trim())
            .filter(Boolean),
        ),
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Görsel yüklenemedi." };
  }

  await ensureUserRow(user);
  const prisma = getPrisma();
  await prisma.listing.create({
    data: {
      userId: user.id,
      title,
      description: s("description") || null,
      bikeType,
      frameSize: s("frameSize") || null,
      wheelSize: wheel ? Number(wheel) : null,
      askingPriceCents,
      images: images.length ? images : undefined,
      status: ListingStatus.PENDING,
    },
  });
  revalidatePath("/my-listings");
  redirect("/my-listings");
}

/** Admin: onayla. */
export async function approveListing(id: string): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  await prisma.listing.update({
    where: { id },
    data: { status: ListingStatus.APPROVED },
  });
  revalidatePath("/admin/listings");
}

/** Admin: reddet (not ile). */
export async function rejectListing(id: string, fd: FormData): Promise<void> {
  await requireAdmin();
  const note = String(fd.get("note") ?? "").trim() || null;
  const prisma = getPrisma();
  await prisma.listing.update({
    where: { id },
    data: { status: ListingStatus.REJECTED, adminNote: note },
  });
  revalidatePath("/admin/listings");
}

/** Admin: ilanı ürüne dönüştür (dükkan stoğuna al) → düzenleme sayfasına git. */
export async function convertToProduct(id: string): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return;

  const images = Array.isArray(listing.images)
    ? (listing.images as unknown[]).filter((x): x is string => typeof x === "string")
    : [];

  // Benzersiz slug
  const base = slugify(listing.title) || "ikinci-el-bisiklet";
  let slug = base;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }

  const product = await prisma.product.create({
    data: {
      title: listing.title,
      slug,
      description: listing.description,
      condition: ProductCondition.USED,
      sellerType: SellerType.CONSUMER,
      bikeType: listing.bikeType,
      frameSize: listing.frameSize,
      wheelSize: listing.wheelSize,
      priceCents: listing.askingPriceCents ?? 0,
      stock: 1,
      isActive: true,
      isPlaceholder: false,
      images: images.length
        ? {
            create: images.map((url, i) => ({
              url,
              alt: listing.title,
              isCover: i === 0,
              position: i,
            })),
          }
        : undefined,
    },
  });

  await prisma.listing.update({
    where: { id },
    data: { status: ListingStatus.PUBLISHED, convertedProductId: product.id },
  });
  revalidatePath("/admin/listings");
  // Admin fiyatı/detayı gözden geçirsin diye ürün düzenlemeye yönlendir.
  redirect(`/admin/products/${product.id}`);
}
