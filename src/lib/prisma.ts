import { PrismaClient } from "@prisma/client";

// Dev'de hot-reload sırasında çoklu bağlantıyı önlemek için global singleton.
// DATABASE_URL tanımlanınca src/server/*.ts sorguları bu istemciyi kullanır.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
