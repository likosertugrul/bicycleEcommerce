import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  BikeType,
  Product,
  ProductCondition,
  ProductFilters,
  SellerType,
} from "@/lib/types";

// Veri erişim katmanı — Supabase (Prisma). İmzalar mock dönemiyle aynı,
// böylece çağıran sayfalar değişmedi.

// İlişkileriyle birlikte ürün tipi (mapper için).
const productInclude = {
  images: { orderBy: { position: "asc" } },
  specs: true,
} satisfies Prisma.ProductInclude;

type DbProduct = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

// Prisma modelini UI'ın kullandığı domain Product tipine çevir.
function toDomain(p: DbProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description ?? "",
    brand: p.brand ?? "",
    condition: p.condition as ProductCondition,
    sellerType: p.sellerType as SellerType,
    bikeType: (p.bikeType ?? "CITY") as BikeType,
    frameSize: p.frameSize,
    wheelSize: p.wheelSize ? Number(p.wheelSize) : null,
    gearCount: p.gearCount,
    brakeType: p.brakeType,
    color: p.color,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    stock: p.stock,
    usageLevel: p.usageLevel,
    manufactureYear: p.manufactureYear,
    cosmeticNotes: p.cosmeticNotes,
    mileageKm: p.mileageKm,
    images: p.images.map((img) => ({
      url: img.url,
      alt: img.alt ?? p.title,
      isCover: img.isCover,
    })),
    specs: p.specs.map((s) => ({ key: s.specKey, value: s.specValue })),
    isPlaceholder: p.isPlaceholder,
    createdAt: p.createdAt.toISOString(),
  };
}

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.bikeType) where.bikeType = filters.bikeType;
  if (filters.condition) where.condition = filters.condition;
  if (filters.frameSize) where.frameSize = filters.frameSize;
  if (filters.brand) where.brand = filters.brand;

  if (
    filters.minPriceCents !== undefined ||
    filters.maxPriceCents !== undefined
  ) {
    where.priceCents = {};
    if (filters.minPriceCents !== undefined)
      where.priceCents.gte = filters.minPriceCents;
    if (filters.maxPriceCents !== undefined)
      where.priceCents.lte = filters.maxPriceCents;
  }

  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query, mode: "insensitive" } },
      { brand: { contains: filters.query, mode: "insensitive" } },
      { description: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(
  sort: ProductFilters["sort"],
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { priceCents: "asc" };
    case "price-desc":
      return { priceCents: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

/** Filtre + sıralamayla ürün listesi. */
export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: buildWhere(filters),
    orderBy: buildOrderBy(filters.sort),
    include: productInclude,
  });
  return rows.map(toDomain);
}

/** Tek ürün (detay sayfası). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  return row ? toDomain(row) : null;
}

/** Ana sayfa vitrini — öne çıkan ürünler. */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: productInclude,
  });
  return rows.map(toDomain);
}

/** Benzer ürünler (aynı tür, kendisi hariç). */
export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      bikeType: product.bikeType,
      id: { not: product.id },
    },
    take: limit,
    include: productInclude,
  });
  return rows.map(toDomain);
}

/** sitemap.ts / generateStaticParams için tüm slug'lar. */
export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

/** Filtre çubuğu için mevcut markalar. */
export async function getBrands(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, brand: { not: null } },
    distinct: ["brand"],
    select: { brand: true },
    orderBy: { brand: "asc" },
  });
  return rows.map((r) => r.brand).filter((b): b is string => Boolean(b));
}
