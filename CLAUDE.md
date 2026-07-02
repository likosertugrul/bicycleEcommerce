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
**Sprint 2 — Auth, Sepet & Kullanıcı: TAMAM.** Sepet ✓, Favoriler ✓, i18n (TR/EN) ✓, Auth ✓, Adres yönetimi ✓, Siparişlerim ✓ (iskelet). Sprint 0/1 tamam.

**SIRA DEĞİŞTİ (kullanıcı kararı):** Ödeme (Sprint 3) **ertelendi**. Yeni sıra:
1. **Admin paneli (Sprint 5) — KURULDU.** `/admin` (yalnızca `role=ADMIN`; `requireAdmin` guard, `src/server/admin.ts`). Dashboard (sayılar), ürün CRUD (`/admin/urunler` liste + `yeni` + `[id]` düzenle; `src/server/admin-product-actions.ts`; slug otomatik `src/lib/slug.ts`; kapak görseli URL ile; fiyat TL girilir kuruşa çevrilir), sipariş listesi (iskelet). Admin arayüzü Türkçe (i18n dışı). Kullanıcıyı admin yapmak: `prisma.user.update role=ADMIN`. Hesabım'da admine "Admin Paneli" linki çıkar.
2. **Bisikletini Sat (Sprint 4) — KURULDU.** `/bisikletini-sat` (giriş şart) → `Listing` PENDING (`src/server/listing-actions.ts createListing`). `/ilanlarim` kullanıcı ilanları (durum + dükkan notu). Admin `/admin/ilanlar`: onayla/reddet(not)/**ürüne dönüştür** (Listing→Product USED/CONSUMER stok 1, `convertedProductId` bağlanır, admin fiyat için ürün düzenlemeye yönlendirilir). Görsel şimdilik URL ile (Storage upload sonra). Data: `src/server/listings.ts`.
3. Ödeme (Sprint 3) — en sona (createOrder, iyzico, webhook).

## Auth (Supabase, @supabase/ssr)
- Client'lar: `src/lib/supabase/{server,client,middleware}.ts`. `src/middleware.ts` her istekte oturumu tazeler.
- Aksiyonlar: `src/server/auth-actions.ts` (signInWithPassword / signUpWithPassword / signInWithGoogle / signOut). Yardımcı: `src/server/auth.ts` (`getAuthUser`, `ensureUserRow` → auth kullanıcısını `public.users`'a upsert).
- Sayfalar: `(account)/giris`, `(account)/kayit`, `(account)/hesabim` (korumalı). OAuth dönüşü: `src/app/auth/callback/route.ts`. Header'da `AccountMenu` (giriş yoksa "Giriş", varsa "Hesabım").
- **Kullanıcı tarafı gereken kurulum:** Supabase Auth URL Config (Site URL=localhost:3000, redirect `localhost:3000/**`), yerel test için "Confirm email" KAPALI; Google için Google Cloud OAuth istemcisi + Supabase Google provider (redirect: `https://fsuwkbtpaukfrkmrzmob.supabase.co/auth/v1/callback`).

## Mevcut Durum
- **Canlı deploy:** GitHub `main`'e push → Cloudflare Workers (OpenNext) otomatik build+deploy. `pg` sürücüsü Workers'ta `nodejs_compat` ile çalışıyor.
- **Render stratejisi (ÖNEMLİ):** Cloudflare **build ortamı DB'ye erişemiyor** (ECONNREFUSED). Bu yüzden DB'li sayfalar `export const dynamic = "force-dynamic"` ile **runtime'da** render ediliyor (ana sayfa, ürün detay, sitemap). Yani build hiç DB'ye bağlanmaz; DB yalnızca **runtime**'da (Worker'da DATABASE_URL var). SSG/ISR şimdilik kapalı — Workers zaten per-request render ediyor; ileride güvenilir build var + R2 incremental cache ile ISR geri açılabilir. **Yeni DB'li sayfa eklerken build anında DB çağırma (generateStaticParams/SSG'den kaçın) veya try/catch ile sar.**
- **Cloudflare env:** Runtime "Variables and Secrets"te DATABASE_URL, DIRECT_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_* mevcut. Build var'ları artık zorunlu değil (build DB'siz).
- **Veri katmanı CANLI (Supabase):** `src/server/products.ts` gerçek Prisma sorguları. Migration `20260701051722_init`, 8 örnek ürün seed'li.
- **Prisma + Cloudflare Workers (İKİ KRİTİK KURAL):** (1) Client'ı `@prisma/client/edge`'ten import et — varsayılan Node yolu `new WebAssembly.Module(bytes)` çağırır, Workers bunu yasaklar. (2) **Global singleton client KULLANMA** — `src/lib/prisma.ts` `getPrisma()` her çağrıda taze client/bağlantı üretir; aksi halde bir isteğin soketi başka istekte kullanılıp Worker asılır ("hung"). Her veri-erişim fonksiyonu başında `const prisma = getPrisma()`. Sürücü: `@prisma/adapter-pg` + `pg` (+ `pg-cloudflare`), `DATABASE_URL` = transaction pooler. **Yerel test: `.dev.vars`'a DATABASE_URL/DIRECT_URL koyup `npx opennextjs-cloudflare preview` ile workerd'de doğrula.**
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

## Bilinen Eksikler — Sprint 0 & 1 (sonra dönülecek)
Sprint 1 fonksiyonel olarak ~%85 bitti; aşağıdakiler ertelendi:
- [ ] **Görsel yükleme (Supabase Storage)** — şu an `public/placeholders/*.svg`. Gerçek görsel yükleme altyapısı yok (admin/Sprint 5 ile birlikte anlamlı).
- [ ] **Çoklu görsel galerisi** — ürün detayında sadece tek kapak gösteriliyor; `images[]` şemada var ama thumbnail'lı galeri arayüzü yok.
- [ ] **Ayrı kategori sayfaları** (`/kategori/[slug]`) — kurulmadı; kategoriler `?tur=dag` filtresiyle çözülüyor. SEO için ayrı route ileride eklenebilir.
- [ ] **ISR** — deploy sorunları için tüm DB sayfaları `force-dynamic`'e alındı. Güvenilir build var + R2 incremental cache ile ISR geri açılabilir.
- [ ] **Deploy (Cloudflare)** — parkta. Dönünce tek iş: `lib/prisma.ts`'i runtime-koşullu (Node ↔ workerd/edge + istek başına) yapmak. Diğer 3 düzeltme (force-dynamic, serverExternalPackages, pg-cloudflare) `main`'de hazır. `lib/prisma.ts` şu an YEREL (Node) sürümünde; bu haliyle push edilmemeli.
- Sprint 0'da CI dışında eksik yok; env + şema + seed tamam.

## Notlar
- Placeholder bisiklet görselleri harici AI modeliyle üretilip eklenecek (yol haritası Bölüm 5). 2. el gerçek ilanlarda AI görsel yok.
- Büyük yol haritasını bu dosyaya kopyalama; `@bisiklet-eticaret-yol-haritasi.md` ile referansla.
- **i18n (TR + EN, GERÇEK ÇEVİRİ):** Hafif, bağımlılıksız. Sözlük `src/lib/i18n.ts` (`tr`/`en`), sunucu tarafı `src/lib/locale.ts` `getLocale()`/`getT()` `lang` cookie'sini okur. Sunucu bileşenleri `const t = await getT()` ile çevirir; client çocuklara (AddToCartButton, FavoriteButton, CartBadge, WishlistBadge) etiketler prop olarak geçer. `LanguageSelector` seçince cookie yazar + `router.refresh()` ile sayfayı yeni dille render eder. Tür/durum etiketleri `t.bikeType`/`t.condition` (types.ts'ten kaldırıldı). **Not:** yalnızca arayüz metinleri çevrilir; ürün verisi (başlık/açıklama) DB'de tek dil — çok dilli ürün alanları ayrı iş. Yeni dil eklemek için: i18n.ts'e sözlük + `LOCALES`/`isLocale` güncelle + `LanguageSelector` LABELS.

## Compact talimatı
Compact yaparken şunları koru: alınan mimari/şema kararları, değişen dosyalar ve ne değiştiği, aktif görev durumu ve sıradaki adımlar, çözülen hatalar.
