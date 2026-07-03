"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  isPlaceholder,
  placeholderLabel,
}: {
  images: ProductImage[];
  isPlaceholder: boolean;
  placeholderLabel: string;
}) {
  const ordered = [...images].sort(
    (a, b) => Number(b.isCover) - Number(a.isCover),
  );
  const [active, setActive] = useState(0);
  const main = ordered[active] ?? ordered[0];

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        {main && (
          <Image
            src={main.url}
            alt={main.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
        {isPlaceholder && (
          <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-1 text-xs text-white">
            {placeholderLabel}
          </span>
        )}
      </div>

      {ordered.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {ordered.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Görsel ${i + 1}`}
              className={`relative aspect-square w-16 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-emerald-500" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
