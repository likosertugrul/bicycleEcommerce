import "server-only";
import { getPrisma } from "@/lib/prisma";

export interface SlideView {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  isActive: boolean;
  position: number;
}

function toView(s: {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  isActive: boolean;
  position: number;
}): SlideView {
  return {
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    imageUrl: s.imageUrl,
    ctaLabel: s.ctaLabel,
    ctaHref: s.ctaHref,
    isActive: s.isActive,
    position: s.position,
  };
}

/** Ana sayfa için aktif slaytlar (sıraya göre). */
export async function getActiveSlides(): Promise<SlideView[]> {
  const prisma = getPrisma();
  const rows = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toView);
}

/** Admin: tüm slaytlar. */
export async function getAdminSlides(): Promise<SlideView[]> {
  const prisma = getPrisma();
  const rows = await prisma.heroSlide.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toView);
}

export async function getSlide(id: string): Promise<SlideView | null> {
  const prisma = getPrisma();
  const s = await prisma.heroSlide.findUnique({ where: { id } });
  return s ? toView(s) : null;
}
