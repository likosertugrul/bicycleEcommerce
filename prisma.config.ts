import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 yapılandırması. Bağlantı URL'leri (eskiden schema.prisma'daydı) buraya taşındı.
// Migration/introspection için DIRECT_URL (pooler'sız doğrudan bağlantı) kullanılır.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
