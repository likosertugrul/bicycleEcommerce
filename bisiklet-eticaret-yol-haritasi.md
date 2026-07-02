# Bisiklet E-Ticaret Platformu — Geliştirme Yol Haritası

> Yerel bir bisiklet dükkanı için **sıfır + 2. el** bisiklet satışı yapan, SEO dostu, e-ticaret özellikli web platformu.
> Bu doküman; mimari, teknoloji yığını, veritabanı şeması ve sprint planını içerir. Sonraki adımlarda kod üretimi bu plana göre yapılacaktır.

---

## 0. Özet ve Karar Tablosu

| Konu | Karar | Gerekçe |
|------|-------|---------|
| Framework | **Next.js 15 (App Router)** | SSR/SSG ile SEO, tek dilde full-stack, Server Actions |
| Dil | **TypeScript** | Tip güvenliği, ölçeklenebilirlik |
| Veritabanı | **PostgreSQL (Supabase)** | İlişkisel yapı, RLS, hazır Auth + Storage |
| ORM | **Prisma** | Tip-güvenli sorgular, migration yönetimi |
| Stil | **Tailwind CSS + shadcn/ui** | Hızlı, tutarlı, erişilebilir bileşenler |
| Auth | **Supabase Auth** (veya Auth.js) | Hazır oturum, e-posta/OAuth |
| Ödeme | **iyzico** (birincil, TR) + Stripe (opsiyonel) | TR pazarı için iyzico, taksit desteği |
| Görsel | **Supabase Storage** + next/image | CDN, optimize görsel |
| Hosting | **Vercel** + Supabase Cloud | Next.js ile native uyum |
| Arama/Filtre | PostgreSQL indeksleri (MVP) → Meilisearch (ileri) | Önce basit, büyüyünce ayrı servis |

---

## 1. Proje Mimarisi & Teknoloji Yığını

### 1.1 Genel Mimari

Monolitik ama modüler bir Next.js uygulaması öneriyorum. Mikroservise gerek yok; yerel bir dükkan için fazla karmaşık olur ve maliyeti artırır.

```
┌─────────────────────────────────────────────────────┐
│                   Tarayıcı (İstemci)                 │
│   React Server Components + Client Components         │
└───────────────────────┬─────────────────────────────┘
                        │  HTTPS
┌───────────────────────▼─────────────────────────────┐
│                Next.js (Vercel)                      │
│  • App Router (sayfalar, SEO meta, SSG/SSR/ISR)      │
│  • Server Actions / Route Handlers (API)             │
│  • Middleware (auth koruması, yönlendirme)           │
└───────┬───────────────────┬──────────────────┬───────┘
        │                   │                  │
┌───────▼──────┐   ┌────────▼───────┐  ┌───────▼────────┐
│  Supabase    │   │   iyzico /     │  │  Supabase      │
│  PostgreSQL  │   │   Stripe API   │  │  Storage (CDN) │
│  + Auth + RLS│   │  (ödeme)       │  │  (görseller)   │
└──────────────┘   └────────────────┘  └────────────────┘
```

### 1.2 Render Stratejisi (SEO için kritik)

| Sayfa Tipi | Yöntem | Neden |
|------------|--------|-------|
| Ana sayfa, kategori sayfaları | **ISR** (revalidate) | Hızlı + güncel, Google taraması için hazır HTML |
| Ürün detay sayfaları | **ISR / SSG** | `generateStaticParams` ile statik üretim, anlık güncelleme |
| Filtreli liste (`?tur=dag&kadro=L`) | **SSR** | Dinamik parametreler, taze sonuç |
| Sepet, ödeme, kullanıcı paneli | **Client + Server Actions** | Kişisel, cache'lenmez |

SEO için ek olarak: `generateMetadata`, dinamik `sitemap.ts`, `robots.ts`, JSON-LD (`Product`, `Offer`, `BreadcrumbList` schema), Open Graph görselleri.

### 1.3 Önerilen Klasör Yapısı

```
src/
├── app/
│   ├── (shop)/                 # Vitrin (public)
│   │   ├── page.tsx            # Ana sayfa
│   │   ├── urunler/
│   │   │   ├── page.tsx        # Liste + filtre
│   │   │   └── [slug]/page.tsx # Ürün detay
│   │   ├── kategori/[slug]/page.tsx
│   │   └── bisikletini-sat/page.tsx
│   ├── (account)/              # Giriş gerektiren
│   │   ├── hesabim/
│   │   ├── siparislerim/
│   │   └── ilanlarim/
│   ├── (checkout)/
│   │   ├── sepet/page.tsx
│   │   └── odeme/page.tsx
│   ├── admin/                  # Dükkan yönetim paneli
│   ├── api/
│   │   ├── webhooks/iyzico/route.ts
│   │   └── ...
│   ├── sitemap.ts
│   └── robots.ts
├── components/   # UI bileşenleri (shadcn + özel)
├── lib/          # db (prisma), auth, iyzico client, utils
├── server/       # Server actions (data layer)
├── types/
└── prisma/
    └── schema.prisma
```

### 1.4 E-Ticaret Altyapısı & Ödeme Yaklaşımı

**Hazır platform (Shopify/Medusa) yerine kendi altyapımız** öneriliyor — çünkü 2. el ekspertiz, ilan yükleme gibi özel alanlar standart platformlara zor oturur.

**Ödeme akışı (iyzico — TR pazarı için önerilir):**

1. Kullanıcı sepeti onaylar → Server Action `createOrder()` siparişi `PENDING` durumunda oluşturur.
2. iyzico **Checkout Form** veya **3D Secure** başlatılır (`initialize`).
3. Kullanıcı banka 3D sayfasına yönlendirilir.
4. iyzico, `/api/webhooks/iyzico` (callback) adresine sonucu POST eder.
5. İmza/`paymentId` doğrulanır → sipariş `PAID` olur, stok düşülür, e-posta gönderilir.
6. Başarısızsa sipariş `FAILED`/`CANCELLED` olur.

> **Önemli güvenlik kuralı:** Fiyat ve toplam tutar **asla istemciden** alınmaz. Sunucu, ürün ID'lerinden fiyatı DB'den yeniden hesaplar. İstemci yalnızca "ne istediğini" söyler, "ne kadar ödeyeceğini" sunucu belirler.

**Stripe** opsiyonu: Yurt dışı satış veya kart saklama gerekirse Stripe Payment Intents eklenebilir. Ödeme katmanını soyut bir `PaymentProvider` arayüzü ile yazalım ki iyzico ↔ Stripe değişimi kolay olsun.

---

## 2. Temel Özellikler & Fonksiyonlar

### 2.1 Sıfır vs. 2. El Ayrımı

Ürünlerde ortak bir `condition` (durum) alanı: `NEW` | `USED`.

2. el ürünler için ek alanlar (sadece `USED` ise dolu):
- `usageLevel` — kullanım durumu (Az Kullanılmış / İyi / Orta)
- `manufactureYear` — üretim yılı
- `inspectionReportUrl` — ekspertiz/kontrol raporu (PDF/görsel)
- `cosmeticNotes` — kozmetik kusur notları (çizik, boya vb.)
- `mileageKm` — opsiyonel km bilgisi
- `sellerType` — `SHOP` (dükkan stoğu) | `CONSUMER` (müşteri ilanı)

> 2. el üründe genelde **stok = 1** ve **varyant yoktur** (tekildir). Sıfır üründe beden/renk varyantları olur. Şema bunu destekleyecek (bkz. Bölüm 3).

### 2.2 Gelişmiş Filtreleme Sistemi

Filtrelenecek teknik alanlar (ürün özellikleri olarak tutulur):
- **Bisiklet türü:** Dağ / Yol / Şehir / Elektrikli / Çocuk / Gravel
- **Kadro boyu:** XS, S, M, L, XL (veya cm)
- **Jant çapı (inch):** 24, 26, 27.5, 28, 29
- **Vites sayısı:** 1, 7, 8, 21, 24...
- **Fren tipi:** V-Brake / Disk (Mekanik/Hidrolik)
- **Bütçe aralığı:** min–max (slider)
- **Durum:** Sıfır / 2. El
- **Marka, renk**

**Teknik yaklaşım:**
- Sık filtrelenen alanlar **ayrı kolonlar** olarak `Product`'ta tutulur (`bikeType`, `frameSize`, `wheelSize`, `gearCount`) → indekslenir, hızlı sorgu.
- Daha az kullanılan/değişken özellikler için `ProductSpec` (key-value) veya `jsonb` kolon.
- URL'e yansıyan filtreler: `/urunler?tur=dag&kadro=L&jant=29&minFiyat=10000` → SSR ile sorgu, paylaşılabilir & SEO dostu link.
- Performans: `(bikeType, condition, priceCents)` üzerinde **composite index**; metin araması için `pg_trgm` veya MVP sonrası Meilisearch.

### 2.3 Kullanıcı Paneli

- **Siparişlerim:** sipariş durumu (Hazırlanıyor / Kargoda / Teslim), kargo takip no, fatura.
- **Adreslerim:** birden çok teslimat/fatura adresi.
- **Favorilerim (Wishlist).**
- **"Bisikletini Sat" / İlanlarım:**
  - Kullanıcı form doldurur (foto + teknik bilgi) → ilan `PENDING` (onay bekliyor) olur.
  - Dükkan admini inceler: **Onayla** (yayınla / satın al teklifi ver) veya **Reddet**.
  - Bu sayede dükkan dışarıdan 2. el alımını da yönetir.
- **Admin paneli:** ürün/stok yönetimi, sipariş yönetimi, ilan onayı, ekspertiz raporu yükleme.

---

## 3. Veritabanı Şeması (PostgreSQL)

### 3.1 Tasarım Kararı: Tek tablo mu, ayrı tablo mu?

**Karar: Tek `Product` tablosu + `condition` ayrımı + 2. el alanları nullable.**

Gerekçe:
- Sıfır ve 2. el aslında "aynı varlık" (bisiklet); sadece bazı ek alanlar farklı. Ayrı tablo → her sorguda `UNION`, çift bakım, kod tekrarı.
- 2. el'e özgü alanlar `NULL` olabilir; bu temiz ve sorgulanabilir.
- Varyant ihtiyacı (sıfır ürünlerin beden/renk stoğu) ayrı `ProductVariant` tablosuyla çözülür. 2. el ürün → tek varyant veya doğrudan `stock=1`.

> İleride 2. el alanları çok büyürse `UsedBikeDetail` adında 1-1 yardımcı tablo ayrılabilir. MVP için tek tablo yeterli ve daha hızlı.

### 3.2 ER İlişkileri (özet)

```
User 1───* Address
User 1───* Order 1───* OrderItem *───1 ProductVariant *───1 Product
User 1───* Listing (Bisikletini Sat)   *───1 Product (onaylanınca)
Product *───1 Category (self-referencing: alt kategori)
Product 1───* ProductImage
Product 1───* ProductVariant
Product 1───* ProductSpec
User 1───* WishlistItem *───1 Product
Order 1───1 Payment
```

### 3.3 SQL Şeması (PostgreSQL — DDL)

```sql
-- ============ ENUM TİPLERİ ============
CREATE TYPE product_condition AS ENUM ('NEW', 'USED');
CREATE TYPE bike_type        AS ENUM ('MOUNTAIN','ROAD','CITY','ELECTRIC','KIDS','GRAVEL');
CREATE TYPE seller_type      AS ENUM ('SHOP','CONSUMER');
CREATE TYPE order_status     AS ENUM ('PENDING','PAID','PREPARING','SHIPPED','DELIVERED','CANCELLED','REFUNDED');
CREATE TYPE payment_status   AS ENUM ('PENDING','PAID','FAILED','REFUNDED');
CREATE TYPE listing_status   AS ENUM ('PENDING','APPROVED','REJECTED','PUBLISHED');
CREATE TYPE user_role        AS ENUM ('CUSTOMER','ADMIN');
CREATE TYPE fulfillment_type AS ENUM ('DELIVERY','PICKUP');  -- kargo / mağazadan teslim

-- ============ USERS ============
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    full_name     TEXT,
    phone         TEXT,
    role          user_role NOT NULL DEFAULT 'CUSTOMER',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Not: Supabase Auth kullanılırsa users.id = auth.users.id ile eşlenir.

-- ============ ADDRESSES ============
CREATE TABLE addresses (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         TEXT,                 -- "Ev", "İş"
    recipient     TEXT NOT NULL,
    phone         TEXT NOT NULL,
    city          TEXT NOT NULL,
    district      TEXT NOT NULL,
    full_address  TEXT NOT NULL,
    zip_code      TEXT,
    is_default    BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ============ CATEGORIES (self-referencing) ============
CREATE TABLE categories (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    slug          TEXT UNIQUE NOT NULL,
    parent_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ PRODUCTS (sıfır + 2. el tek tabloda) ============
CREATE TABLE products (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
    title            TEXT NOT NULL,
    slug             TEXT UNIQUE NOT NULL,
    description      TEXT,
    brand            TEXT,
    condition        product_condition NOT NULL DEFAULT 'NEW',
    seller_type      seller_type NOT NULL DEFAULT 'SHOP',

    -- Filtrelenebilir teknik alanlar (indekslenir)
    bike_type        bike_type,
    frame_size       TEXT,        -- 'XS','S','M','L','XL' veya cm
    wheel_size       NUMERIC(4,1),-- 26, 27.5, 29...
    gear_count       INT,
    brake_type       TEXT,        -- 'V-Brake','Disc-Hydraulic'...
    color            TEXT,

    -- Fiyat ve stok (varyant yoksa burada; varsa ProductVariant kullanılır)
    price_cents      INT NOT NULL,        -- kuruş cinsinden (TL * 100)
    compare_at_cents INT,                 -- üstü çizili "eski fiyat"
    stock            INT NOT NULL DEFAULT 0,

    -- 2. EL'e özgü alanlar (condition='USED' ise dolu)
    usage_level         TEXT,             -- 'Az Kullanılmış','İyi','Orta'
    manufacture_year    INT,
    inspection_report_url TEXT,           -- ekspertiz raporu
    cosmetic_notes      TEXT,
    mileage_km          INT,

    is_active        BOOLEAN NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT price_positive CHECK (price_cents >= 0)
);
-- Filtre performansı için indeksler
CREATE INDEX idx_products_filter  ON products (bike_type, condition, price_cents);
CREATE INDEX idx_products_active  ON products (is_active);
CREATE INDEX idx_products_brand   ON products (brand);
CREATE INDEX idx_products_search  ON products USING gin (to_tsvector('simple', title || ' ' || coalesce(description,'')));

-- ============ PRODUCT IMAGES ============
CREATE TABLE product_images (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url           TEXT NOT NULL,
    alt           TEXT,
    position      INT NOT NULL DEFAULT 0,
    is_cover      BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX idx_images_product ON product_images(product_id);

-- ============ PRODUCT VARIANTS (sıfır ürün beden/renk stoğu) ============
CREATE TABLE product_variants (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku           TEXT UNIQUE,
    frame_size    TEXT,
    color         TEXT,
    price_cents   INT,        -- NULL ise products.price_cents geçerli
    stock         INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ============ PRODUCT SPECS (esnek key-value teknik özellikler) ============
CREATE TABLE product_specs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    spec_key      TEXT NOT NULL,   -- 'Kadro Malzemesi', 'Amortisör'...
    spec_value    TEXT NOT NULL
);
CREATE INDEX idx_specs_product ON product_specs(product_id);

-- ============ ORDERS ============
CREATE TABLE orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID REFERENCES users(id) ON DELETE SET NULL,  -- NULL = misafir sipariş
    order_number     TEXT UNIQUE NOT NULL,        -- insan-okur 'BIS-2026-00042'
    status           order_status NOT NULL DEFAULT 'PENDING',

    -- Misafir (üyeliksiz) alışveriş için iletişim bilgisi
    guest_email      TEXT,        -- user_id NULL ise zorunlu (uygulama katmanında)
    guest_phone      TEXT,

    -- Teslimat: kargo mı, mağazadan teslim mi
    fulfillment      fulfillment_type NOT NULL DEFAULT 'DELIVERY',

    subtotal_cents   INT NOT NULL,
    shipping_cents   INT NOT NULL DEFAULT 0,       -- PICKUP ise 0
    total_cents      INT NOT NULL,
    shipping_address JSONB,                        -- DELIVERY ise dolu (sipariş anı kopyası)
    tracking_code    TEXT,                         -- DELIVERY için kargo takip
    pickup_ready     BOOLEAN NOT NULL DEFAULT false,-- PICKUP: "teslime hazır" bildirimi
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Misafirse e-posta, üyeyse user_id olmalı
    CONSTRAINT contact_present CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL),
    -- Kargo ise adres zorunlu
    CONSTRAINT addr_for_delivery CHECK (fulfillment <> 'DELIVERY' OR shipping_address IS NOT NULL)
);
CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ============ ORDER ITEMS ============
CREATE TABLE order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id    UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    -- Sipariş anındaki kopya (ürün sonradan değişse/silinse bile bozulmaz)
    product_title TEXT NOT NULL,
    unit_cents    INT NOT NULL,
    quantity      INT NOT NULL DEFAULT 1,
    line_cents    INT NOT NULL,
    CONSTRAINT qty_positive CHECK (quantity > 0)
);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============ PAYMENTS ============
CREATE TABLE payments (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    provider         TEXT NOT NULL DEFAULT 'iyzico',
    provider_ref     TEXT,                 -- iyzico paymentId
    status           payment_status NOT NULL DEFAULT 'PENDING',
    amount_cents     INT NOT NULL,
    raw_response     JSONB,                -- denetim için ham yanıt
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ LISTINGS ("Bisikletini Sat") ============
CREATE TABLE listings (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title            TEXT NOT NULL,
    description      TEXT,
    bike_type        bike_type,
    frame_size       TEXT,
    wheel_size       NUMERIC(4,1),
    asking_price_cents INT,
    images           JSONB,                -- yüklenen foto url'leri
    status           listing_status NOT NULL DEFAULT 'PENDING',
    admin_note       TEXT,                 -- red sebebi / teklif notu
    -- Onaylanıp dükkan stoğuna alınınca üretilen ürünle bağ:
    converted_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_listings_user   ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);

-- ============ WISHLIST ============
CREATE TABLE wishlist_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, product_id)
);
```

### 3.4 Tasarımdaki Kritik Notlar

- **Para birimi `cents` (INT) olarak tutulur** — float yuvarlama hatalarını önler (10.000 TL → `1000000`).
- **OrderItem'da ürün başlığı/fiyatı kopyalanır** — ürün sonradan silinse/değişse bile geçmiş sipariş bozulmaz (immutability).
- **Adres sipariş anında `JSONB` olarak kopyalanır** — kullanıcı adresi değiştirse bile eski sipariş doğru kalır.
- **2. el = tekil ürün:** `stock=1`, varyant kullanılmaz. Sıfır = varyantlı stok.
- **RLS (Supabase):** `orders`, `addresses`, `listings` tablolarında "kullanıcı yalnızca kendi kaydını görür" politikası; admin rolü hepsini görür.

---

## 4. Geliştirme Aşamaları (Roadmap)

İki haftalık sprint'ler önerilir. Aşağıdaki süreler tek bir geliştirici (siz + ben) varsayımıyladır; ekip varsa hızlanır.

> **UYGULAMA DURUMU (güncel):** Sprint 0 ✅ ve Sprint 1 ~%85 tamamlandı. Ayrıntılı güncel durum + kalan işler `CLAUDE.md > Bilinen Eksikler` bölümünde. Not: Next.js 16 + Prisma 7 kuruldu (planda 15'ti), hosting Vercel yerine **Cloudflare Workers** (OpenNext) — deploy şimdilik parkta, yerel geliştirme aktif.

### Sprint 0 — Kurulum & Temel (≈ 3-4 gün)
- [x] Next.js + TypeScript + Tailwind projesi (shadcn/ui henüz yok)
- [x] Supabase projesi, Prisma kurulumu, ilk migration (Bölüm 3 şeması)
- [x] ESLint, klasör yapısı, env yönetimi (Prettier eklenmedi)
- [~] CI — Cloudflare (Vercel değil); şimdilik parkta
- **Çıktı:** Boş ama derlenir, deploy edilir iskelet. ✅

### Sprint 1 — Katalog & Vitrin (MVP çekirdeği) (≈ 2 hafta)
- [x] Ürün listeleme sayfası + filtre (kategori ayrı route yerine `?tur=` filtresiyle)
- [x] Ürün detay sayfası (teknik özellikler, 2. el alanları) — [~] galeri: yalnızca tek kapak
- [x] Temel filtreleme (tür, durum, fiyat + kadro, marka, arama, sıralama) — URL parametreli
- [ ] **Görsel yükleme (Supabase Storage)** — YAPILMADI; şu an `public/placeholders/*.svg`
- [x] SEO temeli: `generateMetadata`, JSON-LD, `sitemap.ts`, `robots.ts`
- **Çıktı:** Ürünler gezilebilir, aranabilir, Google'a hazır vitrin. ✅ (görsel altyapısı hariç)

### Sprint 2 — Auth, Sepet & Kullanıcı (≈ 2 hafta)
- [ ] Supabase Auth (kayıt/giriş, oturum middleware)
- [ ] Sepet (server-side, cookie/DB), miktar yönetimi
- [ ] Adres yönetimi
- [ ] Kullanıcı paneli iskeleti (siparişlerim, favoriler)
- **Çıktı:** Kullanıcı giriş yapar, sepete ekler, profilini yönetir.

### Sprint 3 — Sipariş & Ödeme (≈ 2 hafta) ★ kritik
- [ ] `createOrder` server action (fiyat sunucuda hesaplanır)
- [ ] iyzico entegrasyonu (3D Secure / Checkout Form)
- [ ] Webhook/callback doğrulama → sipariş `PAID`, stok düşümü
- [ ] Sipariş onay e-postası, sipariş takip sayfası
- [ ] Soyut `PaymentProvider` arayüzü (Stripe'a açık)
- **Çıktı:** Uçtan uca gerçek satış yapılabilir. **Bu nokta = canlıya çıkılabilir MVP.**

### Sprint 4 — "Bisikletini Sat" & 2. El Akışı (≈ 1.5 hafta)
- [ ] İlan formu (foto + teknik bilgi yükleme)
- [ ] Admin onay akışı (onayla/reddet/teklif), ekspertiz raporu yükleme
- [ ] İlan → ürün dönüştürme (dükkan stoğuna alma)
- **Çıktı:** Dükkan dışarıdan 2. el alıp satışa koyabilir.

### Sprint 5 — Admin Paneli & Yönetim (≈ 2 hafta)
- [ ] Ürün/stok/varyant CRUD
- [ ] Sipariş yönetimi (durum, kargo kodu)
- [ ] Basit dashboard (satış, stok uyarıları)
- **Çıktı:** Dükkan günlük operasyonu panelden yönetir.

### Sprint 6 — İyileştirme & Lansman (≈ 1.5 hafta)
- [ ] Gelişmiş filtre (kadro, jant, vites, fren) + performans indeksleri
- [ ] (Opsiyonel) Meilisearch ile arama
- [ ] Performans (Core Web Vitals), erişilebilirlik (a11y), test
- [ ] KVKK/çerez metni, kullanım şartları, fatura/kargo entegrasyonu
- [ ] Yük testi, son güvenlik gözden geçirmesi → **Canlı**

### Özet Zaman Çizelgesi

```
Sprint 0  ▓                    Kurulum
Sprint 1  ▓▓▓▓                 Katalog (MVP başlangıcı)
Sprint 2  ▓▓▓▓                 Auth + Sepet
Sprint 3  ▓▓▓▓  ★ MVP CANLI    Ödeme + Sipariş
Sprint 4  ▓▓▓                  Bisikletini Sat
Sprint 5  ▓▓▓▓                 Admin
Sprint 6  ▓▓▓   ★ TAM LANSMAN  İyileştirme
```

> **Hızlı yol (sadece çekirdek MVP):** Sprint 0 → 1 → 2 → 3 tamamlanınca satış yapan bir site elinizde olur (≈ 6-7 hafta). 2. el alım, admin paneli ve gelişmiş filtreler sonradan eklenebilir.

---

## 5. Yer Tutucu (Placeholder) Görseller — AI ile Üretim

Başlangıçta gerçek ürün fotoğrafları henüz yokken, katalog ve tasarımın boş görünmemesi için **AI ile üretilmiş yer tutucu bisiklet görselleri** kullanacağız. Amaç; sayfa düzenini, galeriyi ve filtreleri gerçek veri gelmeden test edebilmek.

### 5.1 Yaklaşım

- Her ana bisiklet türü için (Dağ / Yol / Şehir / Elektrikli / Çocuk / Gravel) birkaç temsili görsel üretilir.
- Görseller **tutarlı bir stil** taşımalı: sade/nötr arka plan (tercihen düz açık gri veya stüdyo zemini), bisiklet yandan ve hafif açılı (3/4) çekim, gerçekçi ama "stok fotoğraf" hissinde.
- Tek tip en-boy oranı: **1:1 (kare, 1024×1024)** veya ürün kartı için **4:3** — `next/image` ile sabit oran, layout shift olmaz.
- Dosya adlandırma: `placeholder-mountain-01.webp`, `placeholder-road-02.webp` … → veritabanında `product_images.url` alanına seed ile girilir.

### 5.2 Hazır Üretim Prompt'u (kopyala-yapıştır)

> Görselleri **harici bir model ile sen üreteceksin** ve bana ileteceksin. Aşağıdaki şablon model-bağımsızdır (Midjourney, Flux, DALL·E, Stable Diffusion vb. hepsinde çalışır). Tutarlılık için **ortak stil bloğunu** sabit tut, sadece `[BİSİKLET TANIMI]` kısmını değiştir.

**① Ana şablon (master prompt):**

```
[BİSİKLET TANIMI], full bicycle visible, studio product photography,
plain seamless light-gray (#f2f2f2) background, soft even diffused lighting,
side 3/4 angle view, bike centered, sharp focus, high detail,
realistic materials, generic unbranded design, e-commerce catalog style,
photorealistic, 4k
```

**② Negatif prompt (istenmeyenler):**

```
text, watermark, logo, brand name, people, hands, cluttered background,
shadows on wall, blurry, low quality, distorted frame, extra wheels,
cartoon, illustration, cropped, cut off
```

**③ Ayarlar:**

| Parametre | Değer | Not |
|-----------|-------|-----|
| En-boy oranı | **1:1** (1024×1024) | Ürün kartlarında tutarlı kare. Geniş istersen 4:3 |
| Stil | Fotoğrafik / realistic | "Photo" modu varsa aç |
| Adet | Tür başına **3 varyasyon** | Sonra en iyisini seçeriz |
| Çıktı | Yüksek çözünürlük, sonra WebP | Bölüm 5.3'teki optimizasyon |

**④ Tür başına `[BİSİKLET TANIMI]` değerleri:**

| Tür | `[BİSİKLET TANIMI]` yerine yaz |
|-----|-------------------------------|
| Dağ (Mountain) | `a modern hardtail mountain bike with knobby off-road tires, front suspension fork, matte dark-green frame` |
| Yol (Road) | `a lightweight road racing bike with drop handlebars, thin slick tires, aerodynamic red frame` |
| Şehir (City) | `a comfortable city commuter bike with upright handlebars, fenders, rear rack, step-through cream frame` |
| Elektrikli | `an electric city e-bike with battery integrated into the down tube, hub motor, clean modern grey frame` |
| Çocuk (Kids) | `a small kids bicycle with a bright blue frame, training wheels, 16-inch wheels` |
| Gravel | `a gravel adventure bike with drop bars, wide tan-wall tires, rugged sand-colored frame` |

> **İpucu:** Renkleri prompt içinde değiştirerek aynı türden farklı varyant (örn. siyah/mavi/kırmızı dağ bisikleti) üretebilirsin — böylece "renk" filtresini de gerçekçi test ederiz.

**Bana iletirken:** dosyaları tür adıyla gönderirsen (`dag-01.png`, `yol-02.png`…) doğrudan `seed.ts`'e bağlarım.

### 5.3 Üretim ve Optimizasyon Akışı

1. Görseller AI ile üretilir (her tür için 2-3 varyasyon).
2. Arka plan tutarsızsa hafifçe düzenlenir / kırpılır (kare orana getirilir).
3. **WebP**'e çevrilir ve sıkıştırılır (örn. `sharp` veya squoosh) — hız + Core Web Vitals için kritik.
4. `public/placeholders/` altına veya **Supabase Storage**'a yüklenir.
5. Seed script ile ürünlere bağlanır (örn. `prisma/seed.ts`).
6. `alt` metni doldurulur (örn. *"Dağ bisikleti — temsili görsel"*) → erişilebilirlik + SEO.

### 5.4 Önemli Notlar

- **Geçici olduğu işaretlensin:** Yer tutucu kayıtlar için ürün/görselde `is_placeholder` bayrağı veya görsel üstünde küçük "Temsili görseldir" etiketi düşünülebilir. Böylece canlıya geçmeden önce hepsi kolayca tespit edilip gerçek fotoğraflarla değiştirilir.
- **Yanıltıcı olmasın:** Özellikle 2. el ürünlerde gerçek fotoğraf zorunlu olmalı (alıcı gerçek durumu görmeli). AI görseli yalnızca sıfır ürün vitrininde ve geliştirme/tasarım aşamasında kullanılmalı; satışa açılan gerçek 2. el ilanlarda AI görsel kullanılmaz.
- **Telif/marka:** Prompt'larda gerçek marka logoları veya tescilli tasarımlar istemeyelim; jenerik, markasız bisikletler üretelim.
- Boş kalan yerler için ayrıca düşük çözünürlüklü bir **blur/skeleton placeholder** (yükleme sırasında) `next/image`'in `placeholder="blur"` özelliğiyle eklenebilir.

### 5.5 Roadmap'e Etkisi

Bu iş **Sprint 1 (Katalog & Vitrin)** içinde, görsel yükleme altyapısıyla birlikte yapılır:
- [ ] Tür başına 2-3 yer tutucu görsel üret (AI)
- [ ] WebP optimize et + Storage/`public`'e yükle
- [ ] `seed.ts` ile örnek ürünlere bağla
- [ ] `is_placeholder` bayrağı / "temsili görsel" etiketi ekle

---

## 6. Açık Kararlar & Genişletme Fikirleri

### 6.0 Kilitlenen Kararlar ✅

| Konu | Karar | Şemaya/koda etkisi |
|------|-------|--------------------|
| 2. el satış modeli | **MVP: dükkan-aracılı.** Kullanıcı "Bisikletini Sat" ile gönderir → dükkan inceler, satın alır, kendi adına satar. İleride tam **pazaryeri**ne (kullanıcı→kullanıcı satış) geçişe açık. | `listings` akışı yeterli. `seller_type`, `products` alanları pazaryerine hazır tutuldu. Komisyon/emanet (escrow) **ertelendi**. |
| Teslimat | **Kargo + Mağazadan teslim (ikisi de).** | `orders.fulfillment` (DELIVERY/PICKUP), PICKUP'ta kargo ücreti 0 + adres opsiyonel, `pickup_ready` bildirimi. |
| Üyelik | **Misafir (üyeliksiz) alışveriş açık.** | `orders.user_id` nullable + `guest_email`/`guest_phone`. Ödeme sonrası "hesap oluştur" teklifi. |

> Yukarıdaki kararlar Bölüm 3'teki SQL şemasına işlendi (yeni `fulfillment_type` enum'u, `orders` tablosundaki misafir ve teslimat alanları).

### 6.1 Hâlâ Karar Vermen Gereken Konular

| # | Konu | Seçenekler | Etkisi |
|---|------|-----------|--------|
| 1 | **Fatura & vergi** | E-fatura/e-arşiv entegrasyonu gerekli mi? Fiyatlar KDV dahil mi? | Muhasebe entegrasyonu ve fiyat gösterimi |
| 2 | **Kargo ücretlendirme** | Sabit ücret / desi-ağırlık bazlı / belirli tutar üstü ücretsiz | Sepet ve ödeme hesaplaması |
| 3 | **Dil** | Sadece TR / TR + EN | i18n altyapısı baştan kurulmalı |
| 4 | **İndirim / kupon** | MVP'de var mı, sonra mı? | Sepet mantığı + `coupons` tablosu |
| 5 | **Ürün yorumları/puan** | Olsun / olmasın | `reviews` tablosu + moderasyon |
| 6 | **Servis & bakım randevusu** | Dükkan servis veriyorsa randevu modülü | Ek tablo + takvim |

### 6.2 Önerdiğim Ek Özellikler (sonraki fazlar için)

Bisiklet sektörüne özgü, dönüşümü artıran fikirler:

- **Kadro/beden bulucu:** Kullanıcı boyunu girince uygun kadro boyunu önerir ("175 cm → M/L"). Bisiklette en çok iade sebebi yanlış beden — bu özellik çok değerli.
- **Ürün karşılaştırma:** 2-3 bisikleti yan yana teknik tabloda kıyaslama.
- **Stok bildirimi:** "Gelince haber ver" — tükenen üründe e-posta toplama.
- **Aksesuar & yedek parça kategorisi:** Kask, kilit, lamba, iç lastik gibi yüksek-frekanslı satışlar (sepet ortalamasını yükseltir).
- **Bisiklet bakım/servis hatırlatıcısı:** Satılan bisiklete bağlı periyodik bakım e-postası.
- **WhatsApp / hızlı iletişim butonu:** Yerel dükkan için güçlü dönüşüm aracı.
- **Analitik:** GA4 veya Vercel Analytics + temel e-ticaret olayları (sepete ekleme, satın alma).
- **Blog / rehber içerikleri:** "Şehir bisikleti nasıl seçilir" gibi SEO odaklı yazılar — organik trafik getirir.

> Bunları MVP'ye sokmuyoruz; ama veritabanını bu büyümeye **açık** tasarladık (esnek `product_specs`, kategori self-reference vb.). Karar verirsen ilgili tabloları şemaya eklerim.

---

## 7. Sonraki Adım

Bu plan onaylandıktan sonra **Sprint 0** ile başlayabiliriz. İlk üreteceğim kod blokları şu sırada olacak:

1. `prisma/schema.prisma` — Bölüm 3'teki şemanın Prisma karşılığı
2. Proje kurulum komutları + klasör iskeleti
3. İlk ürün listeleme sayfası (`app/(shop)/urunler/page.tsx`)

Hangi noktadan başlamamı istersiniz? (Önerim: Prisma şeması ile başlamak — gerisi onun üstüne oturur.)
