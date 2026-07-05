import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getT } from "@/lib/locale";
import { getAuthUser } from "@/server/auth";
import { getAddresses } from "@/server/addresses";
import { AddressBook } from "@/components/address-book";

export const metadata: Metadata = { title: "Adreslerim", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const [t, user] = await Promise.all([getT(), getAuthUser()]);
  if (!user) redirect("/login");
  const addresses = await getAddresses();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/account" className="hover:text-emerald-600">
          {t.auth.account}
        </Link>{" "}
        / {t.address.title}
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{t.address.title}</h1>
      <AddressBook addresses={addresses} t={t.address} />
    </div>
  );
}
