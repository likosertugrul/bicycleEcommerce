import Link from "next/link";
import { requireAdmin } from "@/server/admin";
import { signOut } from "@/server/auth-actions";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", emoji: "📊" },
  { href: "/admin/slaytlar", label: "Slides", emoji: "🖼️" },
  { href: "/admin/urunler", label: "Products", emoji: "🚲" },
  { href: "/admin/ilanlar", label: "Listings", emoji: "📝" },
  { href: "/admin/siparisler", label: "Orders", emoji: "📦" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <aside className="border-b border-slate-800 bg-slate-900 text-slate-200 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 px-5 py-4 text-lg font-bold text-white">
          <span aria-hidden>🚲</span> Admin
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:gap-0.5">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <span aria-hidden>{n.emoji}</span> {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-slate-800 p-3 md:block">
          <Link href="/" className="block rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
            ← Back to site
          </Link>
          <form action={signOut}>
            <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800 hover:text-white">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
