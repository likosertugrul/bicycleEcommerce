"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LANG_COOKIE,
  LOCALES,
  isLocale,
  type Locale,
} from "@/lib/i18n";

const LABELS: Record<Locale, { label: string; flag: string }> = {
  tr: { label: "Türkçe", flag: "🇹🇷" },
  en: { label: "English", flag: "🇺🇸" },
};

function readLang(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const m = document.cookie.split("; ").find((c) => c.startsWith(`${LANG_COOKIE}=`));
  const v = m?.split("=")[1];
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

// Modül seviyesinde DOM yazımı (React immutability kuralı dışında).
function persistLang(code: Locale) {
  document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  document.documentElement.lang = code;
}

export function LanguageSelector() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Locale>(DEFAULT_LOCALE);
  const ref = useRef<HTMLDivElement>(null);

  // Mount: kaydedilmiş dili benimse (client-only, hydration uyumu için).
  useEffect(() => {
    const saved = readLang();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only cookie okuması
    if (saved !== DEFAULT_LOCALE) setLang(saved);
  }, []);

  // Dışarı tıklayınca kapat.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function choose(code: Locale) {
    setOpen(false);
    if (code === lang) return;
    setLang(code);
    persistLang(code);
    router.refresh(); // sunucu bileşenlerini yeni dille yeniden render et
  }

  const active = LABELS[lang];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
      >
        <span aria-hidden className="text-base">🌐</span>
        <span className="hidden sm:inline">{active.flag}</span>
        <span className="uppercase">{lang}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {LOCALES.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === lang}
                onClick={() => choose(code)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  code === lang ? "font-semibold text-emerald-700" : "text-slate-700"
                }`}
              >
                <span aria-hidden className="text-base">{LABELS[code].flag}</span>
                {LABELS[code].label}
                {code === lang && <span className="ml-auto text-emerald-600">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
