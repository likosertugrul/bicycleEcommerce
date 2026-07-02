import "server-only";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";

/** Giriş yapmış Supabase kullanıcısı (yoksa null). */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Supabase auth kullanıcısını public.users tablosuna eşle (id = auth.users.id).
 * Giriş/kayıt sonrası çağrılır; tekrar çağrılması güvenli (upsert).
 */
export async function ensureUserRow(user: User): Promise<void> {
  const prisma = getPrisma();
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email ?? "", ...(fullName ? { fullName } : {}) },
    create: {
      id: user.id,
      email: user.email ?? "",
      fullName,
    },
  });
}
