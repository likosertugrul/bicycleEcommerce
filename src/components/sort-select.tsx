"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function SortSelect({
  label,
  options,
}: {
  label: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  function onChange(value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    const qs = params.toString();
    start(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  return (
    <label
      className={`flex items-center gap-2 text-sm ${pending ? "opacity-70" : ""}`}
    >
      <span className="text-slate-500">{label}</span>
      <select
        value={sp.get("sort") ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-1.5 outline-none focus:border-emerald-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
