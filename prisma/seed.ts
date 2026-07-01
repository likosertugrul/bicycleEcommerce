import { PrismaClient, Prisma } from "@prisma/client";

// Yer tutucu ürünlerle DB'yi doldurur. Görseller public/placeholders/*.svg.
// Çalıştırma (DATABASE_URL tanımlıyken):  npx prisma db seed
const prisma = new PrismaClient();

type Seed = {
  slug: string;
  title: string;
  description: string;
  brand: string;
  condition: "NEW" | "USED";
  bikeType: "MOUNTAIN" | "ROAD" | "CITY" | "ELECTRIC" | "KIDS" | "GRAVEL";
  frameSize: string;
  wheelSize: number;
  gearCount: number;
  brakeType: string;
  color: string;
  priceCents: number;
  compareAtCents?: number;
  stock: number;
  image: string;
  usageLevel?: string;
  manufactureYear?: number;
  cosmeticNotes?: string;
  mileageKm?: number;
  specs?: { key: string; value: string }[];
};

const products: Seed[] = [
  {
    slug: "trailblaze-hardtail-dag-bisikleti",
    title: "Trailblaze Hardtail Dağ Bisikleti",
    description:
      "Hafif alüminyum kadro, hidrolik disk fren ve 29 jant ile patika ve şehir dışı sürüşler için ideal hardtail dağ bisikleti.",
    brand: "Trailblaze",
    condition: "NEW",
    bikeType: "MOUNTAIN",
    frameSize: "L",
    wheelSize: 29,
    gearCount: 21,
    brakeType: "Disk (Hidrolik)",
    color: "Mat Yeşil",
    priceCents: 1849000,
    compareAtCents: 2100000,
    stock: 6,
    image: "/placeholders/mountain-01.svg",
    specs: [
      { key: "Kadro Malzemesi", value: "Alüminyum 6061" },
      { key: "Vites Sistemi", value: "Shimano Altus" },
    ],
  },
  {
    slug: "aerolite-yol-yaris-bisikleti",
    title: "Aerolite Yol Yarış Bisikleti",
    description:
      "Aerodinamik karbon kadro, drop gidon ve ince slick lastiklerle asfaltta yüksek hız için tasarlanmış yol bisikleti.",
    brand: "Aerolite",
    condition: "NEW",
    bikeType: "ROAD",
    frameSize: "M",
    wheelSize: 28,
    gearCount: 22,
    brakeType: "Disk (Mekanik)",
    color: "Kırmızı",
    priceCents: 3299000,
    stock: 3,
    image: "/placeholders/road-01.svg",
    specs: [{ key: "Kadro Malzemesi", value: "Karbon" }],
  },
  {
    slug: "urban-cruise-sehir-bisikleti",
    title: "Urban Cruise Şehir Bisikleti",
    description:
      "Dik sürüş pozisyonu, çamurluk ve arka taşıyıcı ile günlük şehir içi ulaşım için konforlu step-through şehir bisikleti.",
    brand: "Urban",
    condition: "NEW",
    bikeType: "CITY",
    frameSize: "M",
    wheelSize: 28,
    gearCount: 7,
    brakeType: "V-Brake",
    color: "Krem",
    priceCents: 1249000,
    compareAtCents: 1450000,
    stock: 10,
    image: "/placeholders/city-01.svg",
  },
  {
    slug: "voltride-elektrikli-sehir-bisikleti",
    title: "VoltRide Elektrikli Şehir Bisikleti",
    description:
      "Kadroya entegre batarya ve arka göbek motoru ile 60 km menzilli, sessiz ve güçlü elektrikli şehir bisikleti.",
    brand: "VoltRide",
    condition: "NEW",
    bikeType: "ELECTRIC",
    frameSize: "L",
    wheelSize: 27.5,
    gearCount: 8,
    brakeType: "Disk (Hidrolik)",
    color: "Gri",
    priceCents: 4499000,
    compareAtCents: 4999000,
    stock: 4,
    image: "/placeholders/electric-01.svg",
    specs: [{ key: "Menzil", value: "~60 km" }],
  },
  {
    slug: "minirider-cocuk-bisikleti-16",
    title: "MiniRider Çocuk Bisikleti 16''",
    description:
      "Yan tekerlekli, 16 inç jantlı, canlı mavi kadrolu, 4-6 yaş çocuklar için güvenli ve hafif bisiklet.",
    brand: "MiniRider",
    condition: "NEW",
    bikeType: "KIDS",
    frameSize: "XS",
    wheelSize: 16,
    gearCount: 1,
    brakeType: "V-Brake",
    color: "Mavi",
    priceCents: 429000,
    stock: 15,
    image: "/placeholders/kids-01.svg",
  },
  {
    slug: "pathfinder-gravel-bisikleti",
    title: "Pathfinder Gravel Macera Bisikleti",
    description:
      "Drop gidon, geniş tan-wall lastikler ve sağlam kadro ile hem asfaltta hem toprak yolda keyifli gravel bisikleti.",
    brand: "Pathfinder",
    condition: "NEW",
    bikeType: "GRAVEL",
    frameSize: "M",
    wheelSize: 28,
    gearCount: 18,
    brakeType: "Disk (Hidrolik)",
    color: "Kum",
    priceCents: 2749000,
    stock: 5,
    image: "/placeholders/gravel-01.svg",
  },
  {
    slug: "ikinci-el-rockline-dag-bisikleti",
    title: "Rockline Dağ Bisikleti (2. El)",
    description:
      "Az kullanılmış, bakımlı dağ bisikleti. Dükkanımız tarafından kontrol edildi, ekspertiz raporu mevcut.",
    brand: "Rockline",
    condition: "USED",
    bikeType: "MOUNTAIN",
    frameSize: "M",
    wheelSize: 27.5,
    gearCount: 24,
    brakeType: "Disk (Mekanik)",
    color: "Siyah",
    priceCents: 899000,
    compareAtCents: 1250000,
    stock: 1,
    image: "/placeholders/mountain-02.svg",
    usageLevel: "Az Kullanılmış",
    manufactureYear: 2023,
    cosmeticNotes: "Sol pedal kolunda hafif çizik, mekanik olarak sorunsuz.",
    mileageKm: 850,
  },
  {
    slug: "ikinci-el-urban-classic-sehir-bisikleti",
    title: "Urban Classic Şehir Bisikleti (2. El)",
    description:
      "İyi durumda, günlük kullanıma hazır şehir bisikleti. Yeni lastik takıldı, frenler ayarlandı.",
    brand: "Urban",
    condition: "USED",
    bikeType: "CITY",
    frameSize: "L",
    wheelSize: 28,
    gearCount: 3,
    brakeType: "V-Brake",
    color: "Lacivert",
    priceCents: 549000,
    stock: 1,
    image: "/placeholders/city-02.svg",
    usageLevel: "İyi",
    manufactureYear: 2021,
    cosmeticNotes: "Selede hafif solma, genel durumu iyi.",
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        brand: p.brand,
        condition: p.condition,
        sellerType: "SHOP",
        bikeType: p.bikeType,
        frameSize: p.frameSize,
        wheelSize: new Prisma.Decimal(p.wheelSize),
        gearCount: p.gearCount,
        brakeType: p.brakeType,
        color: p.color,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? null,
        stock: p.stock,
        usageLevel: p.usageLevel ?? null,
        manufactureYear: p.manufactureYear ?? null,
        cosmeticNotes: p.cosmeticNotes ?? null,
        mileageKm: p.mileageKm ?? null,
        isPlaceholder: true,
        images: {
          create: {
            url: p.image,
            alt: `${p.title} — temsili görsel`,
            isCover: true,
            position: 0,
          },
        },
        specs: p.specs
          ? { create: p.specs.map((s) => ({ specKey: s.key, specValue: s.value })) }
          : undefined,
      },
    });
  }
  console.log(`Seed tamam: ${products.length} ürün.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
