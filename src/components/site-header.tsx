import Link from "next/link";
import { site } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n";
import { CartBadge } from "@/components/cart-badge";
import { WishlistBadge } from "@/components/wishlist-badge";
import { LanguageSelector } from "@/components/language-selector";
import { CurrencySelector } from "@/components/currency-selector";
import { AccountMenu } from "@/components/account-menu";

export function SiteHeader({ t }: { t: Dictionary }) {
  const nav = [
    { href: "/urunler", label: t.nav.allBikes },
    { href: "/urunler?durum=sifir", label: t.nav.new },
    { href: "/urunler?durum=2el", label: t.nav.used },
    { href: "/bisikletini-sat", label: t.nav.sell },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span aria-hidden className="text-2xl">🚲</span>
          <span className="text-slate-900">{site.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-emerald-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/urunler"
            className="hidden sm:inline text-sm text-slate-600 hover:text-emerald-600"
          >
            {t.nav.search}
          </Link>
          <CurrencySelector />
          <LanguageSelector />
          <AccountMenu t={t} />
          <WishlistBadge label={t.nav.wishlist} />
          <CartBadge label={t.nav.cart} />
        </div>
      </div>

      {/* Mobil nav */}
      <nav className="md:hidden flex items-center gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap hover:text-emerald-600"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
