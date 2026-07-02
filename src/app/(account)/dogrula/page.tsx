import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpForm } from "@/components/otp-form";
import { getT } from "@/lib/locale";

export const metadata: Metadata = {
  title: "E-postanı Doğrula",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: PageProps<"/dogrula">) {
  const [t, sp] = await Promise.all([getT(), searchParams]);
  const email = typeof sp.email === "string" ? sp.email : "";
  if (!email) redirect("/kayit");

  return (
    <div className="px-4 py-16">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          {t.auth.verifyTitle}
        </h1>
        <p className="mt-3 text-sm text-slate-500">{t.auth.sentTo}</p>
        <p className="font-medium text-slate-800">{email}</p>
        <p className="mt-3 text-sm text-slate-500">{t.auth.verifyHint}</p>
        <OtpForm email={email} t={t.auth} />
      </div>
    </div>
  );
}
