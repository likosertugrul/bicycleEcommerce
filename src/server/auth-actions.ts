"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ensureUserRow } from "@/server/auth";

export type AuthState = { error?: string; message?: string };

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/** E-posta + şifre ile giriş. */
export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "E-posta ve şifre gerekli." };

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };
  if (data.user) await ensureUserRow(data.user);
  redirect("/hesabim");
}

/** E-posta + şifre ile kayıt. */
export async function signUpWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!email || password.length < 6)
    return { error: "Geçerli e-posta ve en az 6 karakter şifre girin." };

  const supabase = await createSupabaseServer();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
      emailRedirectTo: `${origin}/auth/callback?next=/hesabim`,
    },
  });
  if (error) return { error: error.message };

  // "Confirm email" kapalıysa oturum hemen açılır; açıksa doğrulama sayfasına git.
  if (data.session && data.user) {
    await ensureUserRow(data.user);
    redirect("/hesabim");
  }
  redirect(`/dogrula?email=${encodeURIComponent(email)}`);
}

/** E-posta doğrulama — 6 haneli kod ile. */
export async function verifyEmailOtp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("code") ?? "").trim();
  if (!email || token.length < 6) return { error: "6 haneli kodu girin." };

  const supabase = await createSupabaseServer();
  // Sürüme göre tip 'email' veya 'signup' olabilir; ikisini de dene.
  let res = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (res.error) res = await supabase.auth.verifyOtp({ email, token, type: "signup" });
  if (res.error) return { error: res.error.message };
  if (res.data.user) await ensureUserRow(res.data.user);
  redirect("/hesabim");
}

/** Google ile giriş — OAuth sağlayıcısına yönlendirir. */
export async function signInWithGoogle(): Promise<void> {
  const supabase = await createSupabaseServer();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=/hesabim` },
  });
  if (error) redirect(`/giris?error=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
}

/** Çıkış. */
export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}
