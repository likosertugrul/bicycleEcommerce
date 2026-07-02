import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg + pg-cloudflare bundle'a gömülmesin; harici paket olarak (tam paket
  // kopyalanıp) runtime'da require edilsin. Cloudflare Workers'ta pg'nin
  // pg-cloudflare (CloudflareSocket) sürücüsü için gerekli — aksi halde
  // OpenNext esbuild "Could not resolve pg-cloudflare" hatası veriyor.
  serverExternalPackages: ["pg", "pg-cloudflare"],
  images: {
    // Yer tutucu görseller kendi ürettiğimiz güvenli SVG'ler (public/placeholders).
    // Gerçek görsellere (Supabase Storage) geçince remotePatterns eklenecek.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Örnek — Supabase Storage bağlanınca aç:
    // remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
