import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Sunucu tarafı Supabase client'ı (Server Component / Action / Route).
// Oturum cookie'lerini Next'in cookie store'undan okur/yazar.
export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Component'ten çağrılırsa set atılamaz; middleware zaten
          // oturumu tazeliyor, bu yüzden hatayı yutmak güvenli.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* noop */
          }
        },
      },
    },
  );
}
