import "server-only";
import { getPrisma } from "@/lib/prisma";
import { getAuthUser } from "@/server/auth";

export interface AddressView {
  id: string;
  title: string | null;
  recipient: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  zipCode: string | null;
  isDefault: boolean;
}

/** Giriş yapmış kullanıcının adresleri (varsayılan önce). */
export async function getAddresses(): Promise<AddressView[]> {
  const user = await getAuthUser();
  if (!user) return [];
  const prisma = getPrisma();
  const rows = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    recipient: a.recipient,
    phone: a.phone,
    city: a.city,
    district: a.district,
    fullAddress: a.fullAddress,
    zipCode: a.zipCode,
    isDefault: a.isDefault,
  }));
}
