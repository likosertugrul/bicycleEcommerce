"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

// Ürün kartında resimler arası sol/sağ ok ile geçiş. Kart bir <Link> olduğu
// için ok tıklaması sayfaya gitmesin (preventDefault + stopPropagation).
export function ProductCardImage({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const ordered = [...images].sort(
    (a, b) => Number(b.isCover) - Number(a.isCover),
  );
  const [i, setI] = useState(0);
  const count = ordered.length;
  const cur = ordered[i] ?? ordered[0];

  function go(e: React.MouseEvent, n: number) {
    e.preventDefault();
    e.stopPropagation();
    setI(((n % count) + count) % count);
  }

  return (
    <>
      {cur && (
        <Image
          src={cur.url}
          alt={cur.alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(e, i - 1)}
            aria-label="Önceki görsel"
            className="absolute left-1.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-800 backdrop-blur hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => go(e, i + 1)}
            aria-label="Sonraki görsel"
            className="absolute right-1.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-800 backdrop-blur hover:bg-white"
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {ordered.map((img, idx) => (
              <span
                key={img.url + idx}
                className={`h-1.5 rounded-full ${
                  idx === i ? "w-3 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
