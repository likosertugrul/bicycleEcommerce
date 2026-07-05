import Link from "next/link";
import { getFeaturedProducts } from "@/server/products";
import { getActiveSlides } from "@/server/slides";
import { getT, getCurrency } from "@/lib/locale";
import { ProductCard } from "@/components/product-card";
import { HeroCarousel } from "@/components/hero-carousel";
import { Reveal } from "@/components/reveal";
import { BIKE_TYPE_TO_SLUG, type BikeType } from "@/lib/types";

// Ana sayfa — runtime'da render (Cloudflare build ortamı DB'ye erişmesin diye).
// DB yalnızca runtime'da kullanılır; orada DATABASE_URL mevcut.
export const dynamic = "force-dynamic";

const CATEGORIES: { type: BikeType; emoji: string }[] = [
  { type: "MOUNTAIN", emoji: "⛰️" },
  { type: "ROAD", emoji: "🏁" },
  { type: "CITY", emoji: "🏙️" },
  { type: "ELECTRIC", emoji: "⚡" },
  { type: "KIDS", emoji: "🧒" },
  { type: "GRAVEL", emoji: "🌄" },
];

export default async function HomePage() {
  const [t, currency, featured, slides] = await Promise.all([
    getT(),
    getCurrency(),
    getFeaturedProducts(6),
    getActiveSlides(),
  ]);

  return (
    <div>
      {/* Hero — admin slaytları varsa slider, yoksa varsayılan */}
      {slides.length > 0 ? (
        <HeroCarousel slides={slides} />
      ) : (
        <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
              {t.home.badge}
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-emerald-100">{t.home.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                {t.home.explore}
              </Link>
              <Link
                href="/sell-your-bike"
                className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {t.home.sell}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Kategoriler */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-900">{t.home.categories}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORIES.map(({ type, emoji }, idx) => (
            <Reveal key={type} delay={idx * 60} className="h-full">
              <Link
                href={`/category/${BIKE_TYPE_TO_SLUG[type]}`}
                className="group flex h-full flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md"
              >
                <span
                  aria-hidden
                  className="text-3xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                >
                  {emoji}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {t.bikeType[type]}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Öne çıkanlar */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">{t.home.featured}</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {t.home.seeAll}
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, idx) => (
            <Reveal key={product.id} delay={(idx % 3) * 80} className="h-full">
              <ProductCard product={product} t={t} currency={currency} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Güven bandı — scroll ile belirir */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl bg-slate-50 p-6 sm:grid-cols-3">
          {t.home.trust.map((item, idx) => (
            <Reveal key={item.t} delay={idx * 120}>
              <h3 className="font-semibold text-slate-900">{item.t}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.d}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
