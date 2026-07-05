import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/server/products";
import { getT, getCurrency, getLocale } from "@/lib/locale";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { BIKE_TYPE_SLUGS } from "@/lib/types";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const EMOJI: Record<string, string> = {
  mountain: "⛰️", road: "🏁", city: "🏙️", electric: "⚡", kids: "🧒", gravel: "🌄",
};

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const bikeType = BIKE_TYPE_SLUGS[slug];
  if (!bikeType) return { title: "Kategori bulunamadı" };
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const name = t.bikeType[bikeType];
  const title = locale === "en" ? `${name} Bikes` : `${name} Bisikletleri`;
  const description =
    locale === "en"
      ? `${name} bikes — new and second-hand models at great prices.`
      : `${name} bisikletleri — sıfır ve 2. el modeller, uygun fiyatlarla.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title, description },
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const bikeType = BIKE_TYPE_SLUGS[slug];
  if (!bikeType) notFound();

  const [t, currency, locale, products] = await Promise.all([
    getT(),
    getCurrency(),
    getLocale(),
    getProducts({ bikeType }),
  ]);
  const name = t.bikeType[bikeType];

  // JSON-LD: kategori listesi (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: locale === "en" ? `${name} Bikes` : `${name} Bisikletleri`,
    url: `${site.url}/category/${slug}`,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-4 flex flex-wrap gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600">{t.detail.home}</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-600">{t.detail.bikes}</Link>
        <span>/</span>
        <span className="text-slate-700">{name}</span>
      </nav>

      <div className="flex items-center gap-3">
        <span aria-hidden className="text-4xl">{EMOJI[slug]}</span>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {locale === "en" ? `${name} Bikes` : `${name} Bisikletleri`}
          </h1>
          <p className="text-sm text-slate-500">
            {t.list.productsFound(products.length)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/products?type=${slug}`}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          {t.filters.filter} →
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          {t.list.empty}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, idx) => (
            <Reveal key={product.id} delay={(idx % 3) * 80} className="h-full">
              <ProductCard product={product} t={t} currency={currency} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
