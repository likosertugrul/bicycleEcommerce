import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 yapılandırması. Bağlantı URL'leri (eskiden schema.prisma'daydı) buraya taşındı.
// Migration/introspection için DIRECT_URL (pooler'sız doğrudan bağlantı) kullanılır.
//
// `env()` helper'ı yerine düz process.env + fallback kullanıyoruz: bazı deploy
// platformlarında (örn. Cloudflare Pages) dashboard'daki env değişkenleri
// `npm install` (postinstall → prisma generate) adımına henüz ulaşmıyor.
// `prisma generate` gerçek bir DB bağlantısı kurmadığı için fallback zararsız;
// migration/seed komutları gerçek DIRECT_URL'i .env'den okumaya devam eder.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
