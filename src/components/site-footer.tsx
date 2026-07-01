import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span aria-hidden className="text-xl">🚲</span> {site.name}
          </div>
          <p className="mt-3 text-sm text-slate-500">{site.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Kategoriler</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link href="/urunler?tur=dag" className="hover:text-emerald-600">Dağ Bisikletleri</Link></li>
            <li><Link href="/urunler?tur=yol" className="hover:text-emerald-600">Yol Bisikletleri</Link></li>
            <li><Link href="/urunler?tur=sehir" className="hover:text-emerald-600">Şehir Bisikletleri</Link></li>
            <li><Link href="/urunler?tur=elektrikli" className="hover:text-emerald-600">Elektrikli Bisikletler</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Kurumsal</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link href="/bisikletini-sat" className="hover:text-emerald-600">Bisikletini Sat</Link></li>
            <li><span className="opacity-60">Hakkımızda</span></li>
            <li><span className="opacity-60">İletişim</span></li>
            <li><span className="opacity-60">KVKK & Gizlilik</span></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">İletişim</h3>
          <p className="mt-3 text-sm text-slate-500">
            Mağazadan teslim veya kapınıza kargo.
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">{site.phone}</p>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
