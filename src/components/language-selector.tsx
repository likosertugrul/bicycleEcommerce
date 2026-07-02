"use client";

import { useEffect, useRef, useState } from "react";

// Şimdilik yalnızca TR + EN (cookie `lang` + <html lang>). Diğer diller ve
// gerçek içerik çevirisi (i18n) o adıma gelince eklenecek.
const LANGUAGES = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
] as const;

const COOKIE = "lang";

function readLang(): string {
  if (typeof document === "undefined") return "tr";
  const m = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  return m?.split("=")[1] ?? "tr";
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("tr");
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // Mount: kaydedilmiş dili benimse (yalnızca client — hydration uyumu için).
  useEffect(() => {
    const saved = readLang();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only cookie okuması
    if (saved !== "tr") setLang(saved);
  }, []);

  // Dil değişince <html lang/dir> güncelle ve cookie'ye yaz (side-effect: effect'te).
  useEffect(() => {
    document.documentElement.lang = lang;
    if (mounted.current) {
      document.cookie = `${COOKIE}=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    } else {
      mounted.current = true;
    }
  }, [lang]);

  // Dışarı tıklayınca kapat.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const active = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Dil seçimi"
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
      >
        <span aria-hidden className="text-base">🌐</span>
        <span className="hidden sm:inline">{active.flag}</span>
        <span className="uppercase">{active.code}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  l.code === lang ? "font-semibold text-emerald-700" : "text-slate-700"
                }`}
              >
                <span aria-hidden className="text-base">{l.flag}</span>
                {l.label}
                {l.code === lang && <span className="ml-auto text-emerald-600">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
