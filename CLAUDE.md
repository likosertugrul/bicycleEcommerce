# CLAUDE.md — Bisiklet E-Ticaret

> Bu dosya her oturumda otomatik yüklenir. **Yalın tut.** Detaylar için: `@bisiklet-eticaret-yol-haritasi.md`.

## Proje
Yerel bisiklet dükkanı için sıfır + 2. el bisiklet satan, SEO dostu e-ticaret platformu.

## Teknoloji Yığını
- Next.js 16 (App Router, Turbopack) + TypeScript — `params`/`searchParams` artık Promise, `PageProps<'/route'>` global tip yardımcısı kullan.
- PostgreSQL (Supabase) + Prisma 7 ORM — bağlantı URL'leri `prisma.config.ts`'te (schema'da değil), `env()` için `.env` `dotenv/config` ile yüklenir.
- Tailwind CSS v4 (CSS tabanlı yapılandırma, `tailwind.config.js` yok) + shadcn/ui (henüz eklenmedi)
- Supabase Auth + Storage
- Ödeme: iyzico (birincil), Stripe (opsiyonel) — `PaymentProvider` arayüzü ardında
- Hosting: Vercel

## Kilitlenen Kararlar
- **2. el modeli:** MVP'de dükkan-aracılı. Kullanıcı "Bisikletini Sat" ile gönderir → dükkan inceler/satın alır/satar. Şema ileride pazaryerine açık (escrow/komisyon ertelendi).
- **Sıfır vs 2. el:** Tek `products` tablosu, `condition` (NEW/USED) ayrımı. 2. el alanları nullable. Sıfır → varyantlı stok; 2. el → tekil (stock=1).
- **Teslimat:** Kargo + mağazadan teslim (`orders.fulfillment` = DELIVERY/PICKUP).
- **Üyelik:** Misafir (üyeliksiz) alışveriş açık (`orders.user_id` nullable + `guest_email`).

## Kod Kuralları
- Dil: TypeScript, `strict` açık. Tip türetmeyi tercih et, gereksiz `any` yok.
- Para: her zaman **kuruş (INT)** olarak sakla; gösterimde formatla. Float kullanma.
- **Fiyat/toplam asla istemciden alınmaz** — sunucu ürün ID'lerinden DB'den yeniden hesaplar.
- Veri erişimi `src/server/` altında Server Actions ile; istemciye sadece gerekli veri.
- Bileşenler varsayılan Server Component; etkileşim gerekiyorsa `"use client"`.
- Stil yalnızca Tailwind utility + shadcn; özel CSS minimumda.
- Dosya/klasör adları kebab-case; bileşen adları PascalCase.
- Türkçe slug ve kullanıcıya görünen metinler; kod/değişken adları İngilizce.

## SEO Kuralları (vazgeçilmez)
- Her sayfada `generateMetadata`; ürünlerde JSON-LD (`Product`, `Offer`).
- Vitrin/ürün sayfaları ISR; filtreli listeler SSR; sepet/ödeme client.
- `sitemap.ts` + `robots.ts` güncel tut. Görseller `next/image` + WebP + `alt`.

## Klasör Yapısı (özet)
- `src/app/(shop)` vitrin · `(account)` hesap · `(checkout)` sepet/ödeme · `admin` yönetim
- `src/components` UI · `src/lib` (prisma, auth, iyzico) · `src/server` actions
- `prisma/schema.prisma` · `prisma/seed.ts`

## Aktif Sprint
**Sprint 0 — Kurulum (büyük ölçüde tamam):** Next.js + TS + Tailwind iskelet ✓, klasör yapısı ✓, Prisma şeması ✓, seed ✓, placeholder görseller ✓, vitrin/liste/detay + SEO ✓. Kalan: gerçek Supabase bağlantısı + ilk migration, shadcn/ui, CI.

## Mevcut Durum (Sprint 0 çıktısı)
- **Veri katmanı geçici mock:** `src/server/products.ts` şu an `src/server/mock-data.ts`'ten okuyor. Supabase bağlanınca sadece `products.ts` içi Prisma'ya çevrilecek (imzalar aynı). `src/lib/prisma.ts` hazır; Prisma 7'de çalışması için runtime driver adapter (`@prisma/adapter-pg` + `pg`) gerekebilir.
- **Çalışan sayfalar:** `/` (ana, ISR), `/urunler` (liste+filtre, SSR, URL param'lı GET form), `/urunler/[slug]` (detay, ISR + `generateStaticParams` + JSON-LD), `/bisikletini-sat` (demo form), `/sepet` (placeholder), `sitemap.ts`, `robots.ts`.
- **Görseller:** `public/placeholders/*.svg` (jenerik bisiklet çizimleri). `next.config.ts`'te SVG için `dangerouslyAllowSVG` açık. Gerçek/AI görseller sonra.
- **Çalıştırma:** `npm run dev` → port 3000 doluysa 3001. DB komutları: `db:migrate`, `db:seed`, `db:studio`, `db:generate`.

## Sıradaki TODO
- [x] `prisma/schema.prisma` (yol haritası Bölüm 3'e göre)
- [x] Proje iskeleti + klasör yapısı
- [x] `prisma/seed.ts` + placeholder görselleri bağla
- [x] İlk ürün listeleme sayfası `app/(shop)/urunler/page.tsx`
- [ ] Gerçek Supabase projesi + `.env` doldur + `npm run db:migrate` + `db:seed`
- [ ] `src/server/products.ts`'i mock'tan Prisma'ya geçir (gerekirse pg adapter)
- [ ] shadcn/ui kur, CI (Vercel preview)

## Notlar
- Placeholder bisiklet görselleri harici AI modeliyle üretilip eklenecek (yol haritası Bölüm 5). 2. el gerçek ilanlarda AI görsel yok.
- Büyük yol haritasını bu dosyaya kopyalama; `@bisiklet-eticaret-yol-haritasi.md` ile referansla.

## Compact talimatı
Compact yaparken şunları koru: alınan mimari/şema kararları, değişen dosyalar ve ne değiştiği, aktif görev durumu ve sıradaki adımlar, çözülen hatalar.
