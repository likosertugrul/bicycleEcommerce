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
**Sprint 2 — Auth, Sepet & Kullanıcı (devam ediyor):** Sepet ✓. Kalan: Supabase Auth (kayıt/giriş, middleware), adres yönetimi, kullanıcı paneli (siparişlerim, favoriler). Sprint 0 + Sprint 1 (Katalog/Vitrin) tamam; **canlıda çalışıyor** (Cloudflare Workers, https://bisiklet.likosertugrul.com).

## Mevcut Durum
- **Canlı deploy:** GitHub `main`'e push → Cloudflare Workers (OpenNext) otomatik build+deploy. Env değişkenleri Cloudflare'de **hem Build hem Runtime** bölümünde (DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_*, SUPABASE_SERVICE_ROLE_KEY). `pg` sürücüsü Workers'ta `nodejs_compat` ile çalışıyor.
- **Veri katmanı CANLI (Supabase):** `src/server/products.ts` gerçek Prisma sorguları. `src/lib/prisma.ts` Prisma 7 driver adapter'ı (`@prisma/adapter-pg` + `pg`) ile `DATABASE_URL` (transaction pooler). Migration `20260701051722_init`, 8 örnek ürün seed'li.
- **Sepet:** cookie tabanlı (`bisiklet_cart`, httpOnly), `src/server/cart.ts` (okuma+toplam) + `src/server/cart-actions.ts` (`"use server"`: add/setQty/remove/clear). **Fiyat/toplam DB'den yeniden hesaplanır, istemciden alınmaz.** Header rozeti `CartBadge` (client) `/api/cart`'tan adet çeker (ürün sayfaları statik kalsın diye layout cookie okumaz).
- **Çalışan sayfalar:** `/` (ISR), `/urunler` (SSR filtre), `/urunler/[slug]` (ISR+JSON-LD, "Sepete Ekle" çalışıyor), `/sepet` (tam işlevsel), `/bisikletini-sat` (demo form), `sitemap.ts`, `robots.ts`, `api/cart`.
- **Görseller:** `public/placeholders/*.svg`. `dangerouslyAllowSVG` açık. Gerçek/AI görseller sonra.
- **Çalıştırma:** `npm run dev` (port 3000 doluysa 3001). DB: `db:migrate/seed/studio/generate`. Deploy: `main`'e push (CI) veya `npm run deploy`.

## Sıradaki TODO
- [x] Sprint 0 + Sprint 1: iskelet, şema, Supabase, katalog/vitrin, SEO, canlı deploy
- [x] Sepet (cookie + server actions, sunucu-hesaplı toplam)
- [x] Favoriler/Wishlist (cookie tabanlı, misafir dostu; Auth gelince `WishlistItem`'a taşınır). `src/server/wishlist*.ts`, `FavoriteButton`, `WishlistBadge`, `/favorilerim`.
- [ ] Supabase Auth (kayıt/giriş, oturum middleware) — @supabase/ssr
- [ ] Adres yönetimi + kullanıcı paneli (siparişlerim, favoriler)
- [ ] Ödeme (Sprint 3): `createOrder`, iyzico, `/odeme`, webhook
- [ ] Supabase Storage (gerçek görsel yükleme), RLS politikaları
- [ ] shadcn/ui

## Notlar
- Placeholder bisiklet görselleri harici AI modeliyle üretilip eklenecek (yol haritası Bölüm 5). 2. el gerçek ilanlarda AI görsel yok.
- Büyük yol haritasını bu dosyaya kopyalama; `@bisiklet-eticaret-yol-haritasi.md` ile referansla.

## Compact talimatı
Compact yaparken şunları koru: alınan mimari/şema kararları, değişen dosyalar ve ne değiştiği, aktif görev durumu ve sıradaki adımlar, çözülen hatalar.
