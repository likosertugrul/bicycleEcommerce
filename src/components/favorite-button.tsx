"use client";

import { useEffect, useState, useTransition } from "react";
import { toggleFavorite } from "@/server/wishlist-actions";
import { readFavIdsFromDocument } from "@/lib/wishlist-cookie";

export function FavoriteButton({
  productId,
  variant = "full",
}: {
  productId: string;
  variant?: "full" | "icon";
}) {
  const [fav, setFav] = useState(false);
  const [, startTransition] = useTransition();

  // İlk durumu cookie'den oku; başka yerden değişince senkronla.
  useEffect(() => {
    const sync = () => setFav(readFavIdsFromDocument().includes(productId));
    sync();
    window.addEventListener("wishlist:updated", sync);
    return () => window.removeEventListener("wishlist:updated", sync);
  }, [productId]);

  function handleClick(e: React.MouseEvent) {
    // Ürün kartı bir <Link>; kalp tıklaması sayfaya gitmesin.
    e.preventDefault();
    e.stopPropagation();
    setFav((v) => !v); // iyimser
    startTransition(async () => {
      await toggleFavorite(productId);
      window.dispatchEvent(new Event("wishlist:updated"));
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
        aria-pressed={fav}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur transition-colors hover:bg-white"
      >
        <span className={fav ? "text-rose-600" : "text-slate-400"}>
          {fav ? "♥" : "♡"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={fav}
      className={`rounded-full border px-6 py-3 font-semibold transition-colors ${
        fav
          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-slate-300 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {fav ? "♥ Favoride" : "♡ Favori"}
    </button>
  );
}
