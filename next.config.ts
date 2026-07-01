import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
