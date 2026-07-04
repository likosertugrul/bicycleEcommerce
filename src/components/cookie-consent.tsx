"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "cookie_consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- ilk ziyarette göster
        setShow(true);
      }
    } catch {
      // localStorage erişilemezse banner gösterme
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // yoksay
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row">
        <p className="text-sm text-slate-600">
          Deneyiminizi iyileştirmek ve sepet gibi temel işlevler için çerez
          kullanıyoruz.{" "}
          <Link
            href="/cerez-politikasi"
            className="font-medium text-emerald-600 hover:underline"
          >
            Çerez Politikası
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 sm:ml-auto"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}
