import Link from "next/link";
import { getFeaturedProducts } from "@/server/products";
import { ProductCard } from "@/components/product-card";
import { BIKE_TYPE_LABELS, BIKE_TYPE_TO_SLUG, type BikeType } from "@/lib/types";

// Ana sayfa — ISR (vitrin). Placeholder veriyle çalışıyor.
export const revalidate = 3600;

const CATEGORIES: { type: BikeType; emoji: string }[] = [
  { type: "MOUNTAIN", emoji: "⛰️" },
  { type: "ROAD", emoji: "🏁" },
  { type: "CITY", emoji: "🏙️" },
  { type: "ELECTRIC", emoji: "⚡" },
  { type: "KIDS", emoji: "🧒" },
  { type: "GRAVEL", emoji: "🌄" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts(6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
            Yerel bisiklet dükkanınız
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">
            Sıfır ve 2. el bisikletler, tek çatı altında.
          </h1>
          <p className="mt-4 max-w-xl text-emerald-100">
            Dağdan yola, şehirden elektrikliye — bütçenize ve tarzınıza uygun
            bisikleti bulun. Mağazadan teslim veya kapınıza kargo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/urunler"
              className="rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              Bisikletleri Keşfet
            </Link>
            <Link
              href="/bisikletini-sat"
              className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Bisikletini Sat
            </Link>
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-900">Kategoriler</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORIES.map(({ type, emoji }) => (
            <Link
              key={type}
              href={`/urunler?tur=${BIKE_TYPE_TO_SLUG[type]}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50"
            >
              <span aria-hidden className="text-3xl">{emoji}</span>
              <span className="text-sm font-medium text-slate-700">
                {BIKE_TYPE_LABELS[type]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Öne çıkanlar */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Öne Çıkanlar</h2>
          <Link
            href="/urunler"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Tümünü gör →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Güven bandı */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl bg-slate-50 p-6 sm:grid-cols-3">
          {[
            { t: "Ekspertizli 2. El", d: "Her 2. el bisiklet dükkanımızca kontrol edilir." },
            { t: "Mağazadan Teslim", d: "Kargo beklemeden mağazamızdan hemen teslim alın." },
            { t: "Güvenli Ödeme", d: "3D Secure ile korumalı, taksit seçenekli ödeme." },
          ].map((item) => (
            <div key={item.t}>
              <h3 className="font-semibold text-slate-900">{item.t}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
