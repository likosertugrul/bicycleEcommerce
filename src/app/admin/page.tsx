import Link from "next/link";
import { getAdminStats } from "@/server/admin-products";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const s = await getAdminStats();

  const cards = [
    { label: "Total Products", value: s.total, href: "/admin/products" },
    { label: "Active Products", value: s.active, href: "/admin/products" },
    { label: "Used Products", value: s.used, href: "/admin/products" },
    { label: "Low Stock (≤2)", value: s.lowStock, href: "/admin/products", warn: s.lowStock > 0 },
    { label: "Orders", value: s.orders, href: "/admin/orders" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-emerald-400"
          >
            <div className="text-sm text-slate-500">{c.label}</div>
            <div
              className={`mt-1 text-3xl font-extrabold ${
                c.warn ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {c.value}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
