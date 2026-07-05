import { PrismaPg } from "@prisma/adapter-pg";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

// Runtime'a göre Prisma client seç:
// - Cloudflare Workers (workerd): "@prisma/client/edge" (varsayılan client Node
//   yolunda `new WebAssembly.Module(bytes)` çağırır, Workers bunu yasaklar).
// - Node (next dev / diğer): varsayılan "@prisma/client" (edge sürümü Node'da
//   ".wasm" yükleme hatası verir).
const isWorkerd =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers";

const { PrismaClient } = isWorkerd
  ? await import("@prisma/client/edge")
  : await import("@prisma/client");

// Node'da (next dev) hot-reload sırasında bağlantı patlamasını önlemek için
// singleton; Workers'ta ise bir isteğin soketi başka istekte kullanılırsa Worker
// asılır → her çağrıda TAZE client (singleton YOK).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

export function getPrisma(): PrismaClientType {
  if (isWorkerd) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    return new PrismaClient({ adapter }) as unknown as PrismaClientType;
  }
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
    }) as unknown as PrismaClientType;
  }
  return globalForPrisma.prisma;
}
