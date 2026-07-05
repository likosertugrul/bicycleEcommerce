import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg + pg-cloudflare bundle'a gömülmesin; harici paket olarak (tam paket
  // kopyalanıp) runtime'da require edilsin. Cloudflare Workers'ta pg'nin
  // pg-cloudflare (CloudflareSocket) sürücüsü için gerekli — aksi halde
  // OpenNext esbuild "Could not resolve pg-cloudflare" hatası veriyor.
  serverExternalPackages: ["pg", "pg-cloudflare"],
  // Görsel yükleme Server Action üzerinden geçtiği için gövde limitini yükselt
  // (varsayılan 1MB). Birden fazla fotoğrafa izin ver.
  experimental: {
    serverActions: { bodySizeLimit: "25mb" },
  },
  images: {
    // Admin/kullanıcı rastgele görsel URL'i girebildiği için optimizer katmanını
    // devre dışı bırakıyoruz — görseller doğrudan (native) yüklenir. Daha
    // güvenilir (optimizer host/format sorunları yaşanmaz) ve Cloudflare Images
    // maliyeti olmaz. Görseller zaten çoğunlukla dış CDN'lerden geliyor.
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;

// Cloudflare dev binding'lerini yalnızca yerel geliştirmede kur. Vercel/başka
// platformlarda (production build) tetiklenmesin.
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}
