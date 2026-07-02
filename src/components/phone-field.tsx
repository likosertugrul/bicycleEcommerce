"use client";

import { useState } from "react";
import { PHONE_COUNTRIES, findByDial, parsePhone, DEFAULT_DIAL } from "@/lib/phone";

// Ülke alan kodu seçici + ulusal numara girişi. Numarayı seçilen ülkenin
// max hane sayısına göre kısıtlar. FormData: dialCode + phoneLocal.
export function PhoneField({ defaultValue }: { defaultValue?: string | null }) {
  const parsed = parsePhone(defaultValue);
  const [dial, setDial] = useState(parsed.dial || DEFAULT_DIAL);
  const [national, setNational] = useState(parsed.national);

  const country = findByDial(dial) ?? PHONE_COUNTRIES[0];
  const placeholder =
    (country.min === 10 ? "5" : "").padEnd(country.max, "X") || "X".repeat(country.max);

  return (
    <div className="mt-1 flex gap-2">
      <select
        name="dialCode"
        value={dial}
        onChange={(e) => {
          setDial(e.target.value);
          const c = findByDial(e.target.value);
          if (c) setNational((n) => n.slice(0, c.max));
        }}
        className="w-28 shrink-0 rounded-lg border border-slate-300 px-2 py-2 outline-none focus:border-emerald-500"
      >
        {PHONE_COUNTRIES.map((c) => (
          <option key={c.code} value={c.dial}>
            {c.flag} {c.dial}
          </option>
        ))}
      </select>
      <input
        name="phoneLocal"
        inputMode="numeric"
        autoComplete="tel-national"
        value={national}
        onChange={(e) =>
          setNational(e.target.value.replace(/\D/g, "").slice(0, country.max))
        }
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
      />
    </div>
  );
}
