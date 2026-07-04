import Link from "next/link";

// Yasal metin sayfaları için ortak yerleşim.
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600">Ana Sayfa</Link> / {title}
      </nav>
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      {updated && (
        <p className="mt-1 text-sm text-slate-400">Son güncelleme: {updated}</p>
      )}

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        Bu metin bir taslak şablondur. Yayına almadan önce köşeli parantez içindeki
        firma bilgilerini doldurun ve bir hukuk danışmanına inceletin.
      </div>

      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
        {children}
      </div>
    </section>
  );
}
