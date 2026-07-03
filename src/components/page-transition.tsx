"use client";

import { useEffect, useState } from "react";

// Sayfa geçişinde içeriği yumuşakça belirtir. Animasyon bitince sınıfı kaldırır
// ki sarmalayıcı kalıcı bir stacking-context/compositing etkisi bırakmasın
// (aksi halde galeri görselleri boyanmayabiliyor). Güvenlik: sınıf her koşulda
// kısa süre sonra kalkar, içerik gizli kalmaz.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [anim, setAnim] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAnim(false), 500);
    return () => clearTimeout(t);
  }, []);
  return <div className={anim ? "animate-page-in" : ""}>{children}</div>;
}
