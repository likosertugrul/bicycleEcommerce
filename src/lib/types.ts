// Alan modeli — Prisma şemasıyla (prisma/schema.prisma) hizalıdır.
// Gerçek DB'ye geçince bu tipler Prisma'nın türettiği tiplerle değiştirilir.

export type ProductCondition = "NEW" | "USED";

export type BikeType =
  | "MOUNTAIN"
  | "ROAD"
  | "CITY"
  | "ELECTRIC"
  | "KIDS"
  | "GRAVEL";

export type SellerType = "SHOP" | "CONSUMER";

// Kullanıcıya görünen tür/durum etiketleri artık i18n sözlüğünde (src/lib/i18n.ts):
// t.bikeType[...] ve t.condition[...]. Buradaki eşlemeler yalnızca slug/enum içindir.

// URL slug'ları ↔ enum eşlemesi (filtre linkleri için)
export const BIKE_TYPE_SLUGS: Record<string, BikeType> = {
  dag: "MOUNTAIN",
  yol: "ROAD",
  sehir: "CITY",
  elektrikli: "ELECTRIC",
  cocuk: "KIDS",
  gravel: "GRAVEL",
};

export const BIKE_TYPE_TO_SLUG: Record<BikeType, string> = {
  MOUNTAIN: "dag",
  ROAD: "yol",
  CITY: "sehir",
  ELECTRIC: "elektrikli",
  KIDS: "cocuk",
  GRAVEL: "gravel",
};

export interface ProductImage {
  url: string;
  alt: string;
  isCover?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  brand: string;
  condition: ProductCondition;
  sellerType: SellerType;

  bikeType: BikeType;
  frameSize: string | null; // 'XS','S','M','L','XL'
  wheelSize: number | null; // 26, 27.5, 29...
  gearCount: number | null;
  brakeType: string | null;
  color: string | null;

  // Para her zaman kuruş (INT) — gösterimde formatla
  priceCents: number;
  compareAtCents: number | null;
  stock: number;

  // 2. el alanları (condition === 'USED' ise dolu)
  usageLevel: string | null;
  manufactureYear: number | null;
  cosmeticNotes: string | null;
  mileageKm: number | null;

  images: ProductImage[];
  specs: { key: string; value: string }[];
  isPlaceholder: boolean;
  createdAt: string; // ISO
}

export interface ProductFilters {
  bikeType?: BikeType;
  condition?: ProductCondition;
  frameSize?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  brand?: string;
  query?: string;
  sort?: "newest" | "price-asc" | "price-desc";
}
