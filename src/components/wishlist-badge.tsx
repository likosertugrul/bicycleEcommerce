"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readFavIdsFromDocument } from "@/lib/wishlist-cookie";

// Favori adedini cookie'den okur (non-httpOnly); "wishlist:updated" olayında
// ve sekmeye dönüldüğünde tazeler. Ürün sayfaları statik kalır.
export function WishlistBadge({ label }: { label: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setCount(readFavIdsFromDocument().length);
    sync();
    window.addEventListener("wishlist:updated", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("wishlist:updated", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return (
    <Link
      href="/favorites"
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-rose-600"
    >
      <span aria-hidden>♡</span>
      {count != null && count > 0 && (
        <span
          key={count}
          className="animate-pop absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-bold text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
