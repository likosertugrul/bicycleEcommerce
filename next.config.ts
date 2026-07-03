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
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Admin herhangi bir görsel URL'i girebildiği için tüm https host'larına
    // izin veriyoruz. (Küçük dükkan için pratik; ileride Supabase Storage'a
    // geçilince daraltılabilir.)
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
