// public/urunler/ görsellerini optimize eder: max 1600px + WebP (q82).
// Orijinali siler, DB'deki ProductImage.url uzantılarını .webp'ye günceller.
//   node scripts/optimize-images.mjs
import "dotenv/config";
import { readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DIR = "public/urunler";
const SRC = /\.(jpe?g|png|gif|avif)$/i; // webp zaten optimize sayılır
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const kb = (n) => (n / 1024).toFixed(0) + "KB";

try {
  const files = readdirSync(DIR).filter((f) => SRC.test(f));
  if (files.length === 0) {
    console.log("Optimize edilecek görsel yok.");
    process.exit(0);
  }

  const map = {}; // eskiDosya -> yeniDosya(.webp)
  let before = 0,
    after = 0;

  for (const f of files) {
    const inPath = path.join(DIR, f);
    const outName = f.replace(SRC, ".webp");
    const outPath = path.join(DIR, outName);
    const bSize = statSync(inPath).size;

    await sharp(inPath)
      .rotate() // EXIF yönünü uygula
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);

    const aSize = statSync(outPath).size;
    before += bSize;
    after += aSize;
    if (outName !== f) unlinkSync(inPath); // orijinali sil
    map[f] = outName;
    console.log(`✓ ${f}  ${kb(bSize)} → ${outName}  ${kb(aSize)}`);
  }

  // DB linklerini güncelle
  const imgs = await prisma.productImage.findMany({
    where: { url: { startsWith: "/urunler/" } },
  });
  let updated = 0;
  for (const img of imgs) {
    const filename = decodeURIComponent(img.url.replace("/urunler/", ""));
    const nn = map[filename];
    if (nn && nn !== filename) {
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: `/urunler/${encodeURIComponent(nn)}` },
      });
      updated++;
    }
  }

  console.log(
    `\nToplam: ${kb(before)} → ${kb(after)}  (%${Math.round(
      (1 - after / before) * 100,
    )} küçüldü). DB: ${updated} görsel linki güncellendi.`,
  );
} catch (e) {
  console.error("HATA:", e.message);
} finally {
  await prisma.$disconnect();
}
