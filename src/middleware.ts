import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Statik dosyalar ve görseller hariç tüm yollarda çalış.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|placeholders|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
