import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getT } from "@/lib/locale";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getT();
  return (
    <>
      <SiteHeader t={t} />
      <main className="flex-1">{children}</main>
      <SiteFooter t={t} />
    </>
  );
}
