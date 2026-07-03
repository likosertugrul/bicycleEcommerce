import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/server/products";
import { getT, getCurrency } from "@/lib/locale";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { FavoriteButton } from "@/components/favorite-button";
import { formatPrice, discountPercent } from "@/lib/format";
import { BIKE_TYPE_TO_SLUG } from "@/lib/types";
import { site } from "@/lib/site";

// Ürün detay — runtime'da render (build ortamı DB'ye bağlanmasın diye).
// Runtime SSR yine tam HTML üretir; SEO için sorun değil.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/urunler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };

  const cover = product.images.find((i) => i.isCover) ?? product.images[0];
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: `/urunler/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.description,
      images: cover ? [{ url: cover.url }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/urunler/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [t, currency] = await Promise.all([getT(), getCurrency()]);
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const related = await getRelatedProducts(product);
  const inStock = product.stock > 0;

  // JSON-LD: Product + Offer (SEO — vazgeçilmez)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images.map((i) => `${site.url}${i.url}`),
    itemCondition:
      product.condition === "USED"
        ? "https://schema.org/UsedCondition"
        : "https://schema.org/NewCondition",
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: (product.priceCents / 100).toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site.url}/urunler/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600">{t.detail.home}</Link>
        <span>/</span>
        <Link href="/urunler" className="hover:text-emerald-600">{t.detail.bikes}</Link>
        <span>/</span>
        <Link
          href={`/urunler?tur=${BIKE_TYPE_TO_SLUG[product.bikeType]}`}
          className="hover:text-emerald-600"
        >
          {t.bikeType[product.bikeType]}
        </Link>
        <span>/</span>
        <span className="text-slate-700">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Galeri */}
        <ProductGallery
          images={product.images}
          isPlaceholder={product.isPlaceholder}
          placeholderLabel={t.card.placeholder}
        />

        {/* Bilgi */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                product.condition === "USED"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {t.condition[product.condition]}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {t.bikeType[product.bikeType]} · {product.brand}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {product.title}
          </h1>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatPrice(product.priceCents, currency)}
            </span>
            {product.compareAtCents && (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.compareAtCents, currency)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-sm font-semibold text-white">
                %{discount} {t.detail.discount}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm">
            {inStock ? (
              <span className="font-medium text-emerald-600">
                {t.detail.inStock(product.stock)}
              </span>
            ) : (
              <span className="font-medium text-rose-600">{t.detail.outOfStock}</span>
            )}
          </p>

          <p className="mt-4 text-slate-600">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton
              productId={product.id}
              disabled={!inStock}
              labels={{
                addToCart: t.detail.addToCart,
                adding: t.detail.adding,
                added: t.detail.added,
              }}
            />
            <FavoriteButton
              productId={product.id}
              labels={{ fav: t.detail.fav, faved: t.detail.faved }}
            />
          </div>

          {/* Teknik özellikler */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-sm">
            <Spec label={t.detail.frameSize} value={product.frameSize} />
            <Spec
              label={t.detail.wheel}
              value={product.wheelSize ? `${product.wheelSize}″` : null}
            />
            <Spec
              label={t.detail.gears}
              value={product.gearCount ? `${product.gearCount}` : null}
            />
            <Spec label={t.detail.brake} value={product.brakeType} />
            <Spec label={t.detail.color} value={product.color} />
            {product.specs.map((s) => (
              <Spec key={s.key} label={s.key} value={s.value} />
            ))}
          </dl>

          {/* 2. El özel alanları */}
          {product.condition === "USED" && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">{t.detail.usedInfo}</h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-amber-900">
                <Spec label={t.detail.usage} value={product.usageLevel} />
                <Spec
                  label={t.detail.year}
                  value={product.manufactureYear?.toString() ?? null}
                />
                <Spec
                  label={t.detail.mileage}
                  value={product.mileageKm ? `${product.mileageKm} km` : null}
                />
              </dl>
              {product.cosmeticNotes && (
                <p className="mt-3 text-sm text-amber-900">
                  <span className="font-medium">{t.detail.cosmeticNotes}: </span>
                  {product.cosmeticNotes}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900">{t.detail.related}</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, idx) => (
              <Reveal key={p.id} delay={(idx % 3) * 80} className="h-full">
                <ProductCard product={p} t={t} currency={currency} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2 border-b border-black/5 pb-1">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
