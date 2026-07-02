import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// YEREL (Node) yapılandırması. `next dev` Node üzerinde çalışır; varsayılan
// @prisma/client + global singleton en verimli ve hot-reload dostu yöntemdir.
//
// NOT (deploy'a dönünce): Cloudflare Workers için bunu değiştirmek gerekir —
// (1) import'u `@prisma/client/edge` yap (WASM modül yüklemesi), (2) singleton
// yerine istek başına taze client üret (istekler arası soket paylaşımı Worker'ı
// asar). Ayrıntı CLAUDE.md'de. Şimdilik yerel geliştirmeye odaklanıyoruz.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}
