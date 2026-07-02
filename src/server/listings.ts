import "server-only";
import { getPrisma } from "@/lib/prisma";
import { getAuthUser } from "@/server/auth";

export interface ListingView {
  id: string;
  title: string;
  description: string | null;
  bikeType: string | null;
  frameSize: string | null;
  wheelSize: number | null;
  askingPriceCents: number | null;
  images: string[];
  status: string;
  adminNote: string | null;
  convertedProductId: string | null;
  createdAt: string;
  userEmail?: string;
}

function toImages(json: unknown): string[] {
  if (Array.isArray(json)) return json.filter((x): x is string => typeof x === "string");
  return [];
}

/** Giriş yapmış kullanıcının ilanları. */
export async function getMyListings(): Promise<ListingView[]> {
  const user = await getAuthUser();
  if (!user) return [];
  const prisma = getPrisma();
  const rows = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    bikeType: l.bikeType,
    frameSize: l.frameSize,
    wheelSize: l.wheelSize != null ? Number(l.wheelSize) : null,
    askingPriceCents: l.askingPriceCents,
    images: toImages(l.images),
    status: l.status,
    adminNote: l.adminNote,
    convertedProductId: l.convertedProductId,
    createdAt: l.createdAt.toISOString(),
  }));
}

/** Admin: tüm ilanlar (inceleme bekleyenler önce). */
export async function getAdminListings(): Promise<ListingView[]> {
  const prisma = getPrisma();
  const rows = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
  });
  const order: Record<string, number> = { PENDING: 0, APPROVED: 1, PUBLISHED: 2, REJECTED: 3 };
  return rows
    .map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      bikeType: l.bikeType,
      frameSize: l.frameSize,
      wheelSize: l.wheelSize != null ? Number(l.wheelSize) : null,
      askingPriceCents: l.askingPriceCents,
      images: toImages(l.images),
      status: l.status,
      adminNote: l.adminNote,
      convertedProductId: l.convertedProductId,
      createdAt: l.createdAt.toISOString(),
      userEmail: l.user.email,
    }))
    .sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
}
