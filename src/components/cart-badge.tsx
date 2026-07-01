"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Sepet adedini /api/cart'tan çeker; "cart:updated" olayında ve sekmeye
// dönüldüğünde tazeler. Böylece ürün sayfaları statik kalır (layout cookie okumaz).
export function CartBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = await res.json();
        if (active) setCount(typeof data.count === "number" ? data.count : 0);
      } catch {
        /* sessiz geç */
      }
    };
    refresh();
    window.addEventListener("cart:updated", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      window.removeEventListener("cart:updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <Link
      href="/sepet"
      className="relative rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
    >
      Sepet
      {count != null && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
