import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/server/products";
import { BIKE_TYPE_TO_SLUG } from "@/lib/types";
import { site } from "@/lib/site";

const LEGAL_ROUTES = [
  "gizlilik", "kullanim-sartlari", "mesafeli-satis", "cerez-politikasi", "iptal-iade",
];

// Runtime'da üret (build ortamı DB'ye bağlanmasın diye).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // DB'ye ulaşılamazsa (örn. build/edge sorunu) statik rotalarla dön, çökme.
  let slugs: string[] = [];
  try {
    slugs = await getAllProductSlugs();
  } catch (err) {
    console.error("sitemap: ürün slug'ları alınamadı.", err);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/urunler`, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${site.url}/bisikletini-sat`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = (
    Object.values(BIKE_TYPE_TO_SLUG) as string[]
  ).map((slug) => ({
    url: `${site.url}/kategori/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_ROUTES.map((r) => ({
    url: `${site.url}/${r}`,
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${site.url}/urunler/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...legalRoutes, ...productRoutes];
}
