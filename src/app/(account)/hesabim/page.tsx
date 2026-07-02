import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/lib/locale";
import { getAuthUser } from "@/server/auth";
import { isAdmin } from "@/server/admin";
import { signOut } from "@/server/auth-actions";

export const metadata: Metadata = { title: "Hesabım", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const [t, user] = await Promise.all([getT(), getAuthUser()]);
  if (!user) redirect("/giris");
  const admin = await isAdmin();

  const name =
    (user.user_metadata?.full_name as string | undefined) || user.email;

  const cards = [
    { href: "/siparislerim", label: t.auth.orders, emoji: "📦", soon: false },
    { href: "/favorilerim", label: t.auth.favorites, emoji: "♥", soon: false },
    { href: "/adreslerim", label: t.auth.addresses, emoji: "📍", soon: false },
    { href: "/ilanlarim", label: t.auth.listings, emoji: "🚲", soon: true },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t.auth.welcome}, {name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t.auth.panelIntro}</p>
        </div>
        <div className="flex gap-2">
          {admin && (
            <Link
              href="/admin"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Admin Paneli
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {t.auth.signOut}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.soon ? "#" : c.href}
            aria-disabled={c.soon}
            className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 transition-colors ${
              c.soon
                ? "cursor-default opacity-70"
                : "hover:border-emerald-400 hover:bg-emerald-50"
            }`}
          >
            <span aria-hidden className="text-2xl">{c.emoji}</span>
            <span className="font-medium text-slate-800">{c.label}</span>
            {c.soon && (
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {t.auth.comingSoon}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
