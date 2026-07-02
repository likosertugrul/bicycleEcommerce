import Link from "next/link";
import { getAuthUser } from "@/server/auth";
import type { Dictionary } from "@/lib/i18n";

// Oturuma göre "Giriş" veya "Hesabım" gösterir. Kendi kullanıcı sorgusunu yapar.
export async function AccountMenu({ t }: { t: Dictionary }) {
  const user = await getAuthUser();

  if (!user) {
    return (
      <Link
        href="/giris"
        className="text-sm font-medium text-slate-600 hover:text-emerald-600"
      >
        {t.auth.signIn}
      </Link>
    );
  }

  const meta = user.user_metadata ?? {};
  const displayName =
    (meta.full_name as string | undefined) ||
    (meta.name as string | undefined) ||
    user.email?.split("@")[0] ||
    t.auth.account;

  return (
    <Link
      href="/hesabim"
      aria-label={t.auth.account}
      className="flex h-9 items-center gap-1.5 rounded-full bg-slate-100 px-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
    >
      <span aria-hidden>👤</span>
      <span className="hidden sm:inline max-w-28 truncate">{displayName}</span>
    </Link>
  );
}
