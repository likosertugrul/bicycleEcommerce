"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CURRENCIES,
  CURRENCY_COOKIE,
  isCurrency,
  type Currency,
} from "@/lib/currency";

function readCurrency(): Currency {
  if (typeof document === "undefined") return "TRY";
  const m = document.cookie.split("; ").find((c) => c.startsWith(`${CURRENCY_COOKIE}=`));
  const v = m?.split("=")[1];
  return isCurrency(v) ? v : "TRY";
}

function persist(code: Currency) {
  document.cookie = `${CURRENCY_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function CurrencySelector() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState<Currency>("TRY");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = readCurrency();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only cookie okuması
    if (saved !== "TRY") setCur(saved);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function choose(code: Currency) {
    setOpen(false);
    if (code === cur) return;
    setCur(code);
    persist(code);
    router.refresh();
  }

  const active = CURRENCIES.find((c) => c.code === cur) ?? CURRENCIES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Para birimi / Currency"
        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
      >
        <span aria-hidden>{active.symbol}</span>
        <span>{active.code}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {CURRENCIES.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                role="option"
                aria-selected={c.code === cur}
                onClick={() => choose(c.code)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  c.code === cur ? "font-semibold text-emerald-700" : "text-slate-700"
                }`}
              >
                <span aria-hidden className="w-5">{c.symbol}</span>
                {c.code}
                {c.code === cur && <span className="ml-auto text-emerald-600">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
