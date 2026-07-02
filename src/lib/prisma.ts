// Cloudflare Workers: WASM sorgu derleyicisini modül olarak yükleyen "edge"
// client'ı kullan. Varsayılan (@prisma/client) Node yolunda
// `new WebAssembly.Module(bytes)` çağırıyor; Workers bunu yasaklıyor.
import { PrismaClient } from "@prisma/client/edge";
import { PrismaPg } from "@prisma/adapter-pg";

// ÖNEMLİ: Workers'ta bir isteğin soketi başka bir istekte kullanılamaz
// ("Cannot perform I/O on behalf of a different request" / hang). Bu yüzden
// global singleton KULLANMIYORUZ; her çağrıda taze client/bağlantı üretiyoruz.
// pgbouncer (transaction pooler) kısa ömürlü bağlantıları verimli yönetir.
export function getPrisma(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}
