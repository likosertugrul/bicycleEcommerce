"use client";

import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const count = ordered.length;
  const main = ordered[active] ?? ordered[0];
  const go = (n: number) => setActive(((n % count) + count) % count);

  // Lightbox açıkken klavye (Esc / oklar) + arka plan kaydırma kilidi.
  useEffect(() => {
    if (!open) return;
    const step = (d: number) =>
      setActive((v) => ((v + d) % count + count) % count);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, count]);

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        {main && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Büyük görseli aç"
            className="absolute inset-0 cursor-zoom-in"
          >
            <Image
              src={main.url}
              alt={main.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </button>
        )}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Önceki görsel"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-slate-800 backdrop-blur hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Sonraki görsel"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-slate-800 backdrop-blur hover:bg-white"
            >
              ›
            </button>
          </>
        )}
        {isPlaceholder && (
          <span className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-1 text-xs text-white">
            {placeholderLabel}
          </span>
        )}
      </div>

      {count > 1 && (
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

      {/* Lightbox */}
      {open && main && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Kapat"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
          >
            ✕
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(active - 1);
                }}
                aria-label="Önceki görsel"
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(active + 1);
                }}
                aria-label="Sonraki görsel"
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={main.url}
              alt={main.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {count > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {active + 1} / {count}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
