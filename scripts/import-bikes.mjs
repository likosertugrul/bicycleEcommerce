// public/urunler/ altındaki fotoğrafları ürünlere çevirir.
// Kural: aynı taban ad + numara → tek ürün (çok görselli); numarasız → tekil ürün.
// Ürünler TASLAK (isActive:false, price 0) oluşturulur; admin'de fiyat/tür girip yayınla.
//   Çalıştır: node scripts/import-bikes.mjs
import "dotenv/config";
import { readdirSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DIR = "public/urunler";
const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function slugify(s) {
  const tr = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u" };
  return s.split("").map((c) => tr[c] ?? c).join("").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "urun";
}
function title(base) {
  return base.replace(/[-_]+/g, " ").trim().replace(/\b\w/g, (c) => c.toLocaleUpperCase("tr"));
}
async function uniqueSlug(base) {
  let slug = base, n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) { n++; slug = `${base}-${n}`; }
  return slug;
}

try {
  const files = readdirSync(DIR).filter((f) => IMG.test(f));
  if (files.length === 0) { console.log("public/urunler/ boş — fotoğraf ekleyip tekrar çalıştır."); process.exit(0); }

  // Grupla: taban ad -> [{num, file}] ; numarasızlar tekil
  const groups = new Map(); // base -> [{num,file}]
  const singles = []; // file
  for (const f of files) {
    const name = f.replace(IMG, "");
    const m = name.match(/^(.*?)[\s._-]*(\d+)$/);
    if (m && m[1].trim()) {
      const base = m[1].trim();
      if (!groups.has(base)) groups.set(base, []);
      groups.get(base).push({ num: parseInt(m[2], 10), file: f });
    } else {
      singles.push(f);
    }
  }

  const url = (f) => `/urunler/${encodeURIComponent(f)}`;
  let created = 0;

  async function make(baseName, fileList) {
    const t = title(baseName);
    const slug = await uniqueSlug(slugify(baseName));
    await prisma.product.create({
      data: {
        title: t, slug, condition: "NEW", sellerType: "SHOP",
        priceCents: 0, stock: 1, isActive: false, isPlaceholder: false,
        images: { create: fileList.map((f, i) => ({ url: url(f), alt: t, isCover: i === 0, position: i })) },
      },
    });
    created++;
    console.log(`✓ ${t}  (${fileList.length} görsel)  [taslak]`);
  }

  for (const [base, imgs] of groups) {
    imgs.sort((a, b) => a.num - b.num);
    await make(base, imgs.map((x) => x.file));
  }
  for (const f of singles) {
    await make(f.replace(IMG, ""), [f]);
  }

  console.log(`\nToplam ${created} ürün oluşturuldu (TASLAK). Admin → Ürünler'den fiyat/tür girip 'Aktif' yap.`);
} catch (e) {
  console.error("HATA:", e.message);
} finally {
  await prisma.$disconnect();
}
