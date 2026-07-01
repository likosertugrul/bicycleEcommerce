// Favoriler cookie'si. httpOnly DEĞİL — client (FavoriteButton, badge) ilk
// durumu okuyabilsin diye. İçerik yalnızca ürün ID'leri (hassas veri yok).
// Auth gelince WishlistItem tablosuna taşınır; cookie geçici çözüm.

export const WISHLIST_COOKIE = "bisiklet_favs";

/** JSON string → ürün ID dizisi (bozuksa boş). */
export function parseFavIds(raw: string | undefined | null): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Client-only: document.cookie'den favori ID'lerini oku. */
export function readFavIdsFromDocument(): string[] {
  if (typeof document === "undefined") return [];
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${WISHLIST_COOKIE}=`));
  if (!match) return [];
  const value = match.slice(WISHLIST_COOKIE.length + 1);
  return parseFavIds(decodeURIComponent(value));
}
