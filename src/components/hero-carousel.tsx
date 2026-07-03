"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SlideView } from "@/server/slides";

export function HeroCarousel({ slides }: { slides: SlideView[] }) {
  const [i, setI] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setI((v) => (v + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;
  const go = (n: number) => setI(((n % count) + count) % count);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
      <div className="relative mx-auto flex min-h-[420px] max-w-6xl items-center px-4 py-16 md:min-h-[460px] md:py-20">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            aria-hidden={idx !== i}
            className={`absolute inset-0 mx-auto flex max-w-6xl items-center px-12 transition-opacity duration-700 md:px-16 ${
              idx === i ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="w-full md:w-1/2">
              <h1 className="max-w-xl text-3xl font-extrabold leading-tight md:text-5xl">
                {s.title}
              </h1>
              {s.subtitle && (
                <p className="mt-4 max-w-lg text-emerald-100">{s.subtitle}</p>
              )}
              {s.ctaHref && (
                <Link
                  href={s.ctaHref}
                  className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  {s.ctaLabel || "İncele"}
                </Link>
              )}
            </div>
            {s.imageUrl && (
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center md:flex">
                <div className="relative h-64 w-full">
                  <Image
                    src={s.imageUrl}
                    alt={s.title}
                    fill
                    sizes="50vw"
                    className="object-contain drop-shadow-2xl"
                    priority={idx === 0}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Oklar */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label="Önceki"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              aria-label="Sonraki"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Noktalar */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(idx)}
              aria-label={`Slayt ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
