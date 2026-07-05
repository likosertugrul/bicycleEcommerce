import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getT } from "@/lib/locale";
import { getAuthUser } from "@/server/auth";

export const metadata: Metadata = { title: "Kayıt Ol", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  const [t, user] = await Promise.all([getT(), getAuthUser()]);
  if (user) redirect("/account");
  return (
    <div className="px-4 py-16">
      <AuthForm mode="signup" t={t.auth} />
    </div>
  );
}
