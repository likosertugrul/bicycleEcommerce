import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/admin-client";

const BUCKET = "images";
const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

/**
 * FormData'daki bir dosyayı Supabase Storage'a yükler, public URL döner.
 * Dosya yoksa/boşsa null döner (çağıran link alanına düşebilir).
 */
export async function uploadImage(
  file: FormDataEntryValue | null,
  folder: string,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_BYTES) throw new Error("Görsel 8MB'den büyük olamaz.");
  if (file.type && !ALLOWED.includes(file.type))
    throw new Error("Desteklenmeyen görsel türü.");

  const ext =
    (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const supabase = createSupabaseAdmin();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Birden fazla dosyayı yükler; başarılı URL'leri sırayla döner. */
export async function uploadImages(
  files: FormDataEntryValue[],
  folder: string,
): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) {
    const url = await uploadImage(f, folder);
    if (url) urls.push(url);
  }
  return urls;
}
