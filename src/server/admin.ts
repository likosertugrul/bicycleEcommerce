import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getAuthUser } from "@/server/auth";
import { getPrisma } from "@/lib/prisma";

/** Admin değilse yönlendirir; adminse kullanıcıyı döner. */
export async function requireAdmin(): Promise<User> {
  const user = await getAuthUser();
  if (!user) redirect("/giris");
  const prisma = getPrisma();
  const row = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (row?.role !== "ADMIN") redirect("/");
  return user;
}

/** Yönlendirmeden admin mi kontrolü (header/menü için). */
export async function isAdmin(): Promise<boolean> {
  const user = await getAuthUser();
  if (!user) return false;
  const prisma = getPrisma();
  const row = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  return row?.role === "ADMIN";
}
