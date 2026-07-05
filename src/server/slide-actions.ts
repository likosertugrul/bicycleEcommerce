"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/admin";
import { uploadImage } from "@/server/upload";

export type SlideFormState = { error?: string };

function parse(fd: FormData) {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  return {
    title: s("title"),
    subtitle: s("subtitle") || null,
    ctaLabel: s("ctaLabel") || null,
    ctaHref: s("ctaHref") || null,
    position: Number(s("position")) || 0,
    isActive: fd.get("isActive") === "on",
    imageUrl: s("imageUrl") || null,
  };
}

export async function createSlide(
  _prev: SlideFormState,
  formData: FormData,
): Promise<SlideFormState> {
  await requireAdmin();
  const d = parse(formData);
  if (!d.title) return { error: "Title is required." };

  let image: string | null;
  try {
    image = (await uploadImage(formData.get("imageFile"), "slides")) ?? d.imageUrl;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Image upload failed." };
  }

  const prisma = getPrisma();
  await prisma.heroSlide.create({
    data: {
      title: d.title,
      subtitle: d.subtitle,
      ctaLabel: d.ctaLabel,
      ctaHref: d.ctaHref,
      position: d.position,
      isActive: d.isActive,
      imageUrl: image,
    },
  });
  revalidatePath("/admin/slides");
  revalidatePath("/");
  redirect("/admin/slides");
}

export async function updateSlide(
  id: string,
  _prev: SlideFormState,
  formData: FormData,
): Promise<SlideFormState> {
  await requireAdmin();
  const d = parse(formData);
  if (!d.title) return { error: "Title is required." };

  let image: string | null;
  try {
    image = (await uploadImage(formData.get("imageFile"), "slides")) ?? d.imageUrl;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Image upload failed." };
  }

  const prisma = getPrisma();
  await prisma.heroSlide.update({
    where: { id },
    data: {
      title: d.title,
      subtitle: d.subtitle,
      ctaLabel: d.ctaLabel,
      ctaHref: d.ctaHref,
      position: d.position,
      isActive: d.isActive,
      // image boşsa mevcut korunur
      ...(image ? { imageUrl: image } : {}),
    },
  });
  revalidatePath("/admin/slides");
  revalidatePath("/");
  redirect("/admin/slides");
}

export async function deleteSlide(id: string): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/admin/slides");
  revalidatePath("/");
}

export async function toggleSlide(id: string): Promise<void> {
  await requireAdmin();
  const prisma = getPrisma();
  const s = await prisma.heroSlide.findUnique({ where: { id }, select: { isActive: true } });
  if (s) {
    await prisma.heroSlide.update({ where: { id }, data: { isActive: !s.isActive } });
    revalidatePath("/admin/slides");
    revalidatePath("/");
  }
}
