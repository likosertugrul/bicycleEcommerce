import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/server/products";
import { site } from "@/lib/site";

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

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${site.url}/urunler/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
