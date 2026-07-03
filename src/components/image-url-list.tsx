"use client";

import { useState } from "react";

// Tek tek URL ekleme: yaz → "Ekle" → listeye eklenir (istenirse daha fazla).
// Eklenen her URL gizli input olarak forma gider (name ile getAll okunur).
export function ImageUrlList({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const [urls, setUrls] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    setUrls((u) => (u.includes(v) ? u : [...u, v]));
    setDraft("");
  }

  return (
    <div>
      <span className="block text-sm text-slate-600">{label}</span>
      <div className="mt-1 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="https://..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Ekle
        </button>
      </div>

      {urls.length > 0 && (
        <ul className="mt-2 space-y-1">
          {urls.map((u, i) => (
            <li
              key={u + i}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1 text-sm"
            >
              <span className="truncate text-slate-600">{u}</span>
              <button
                type="button"
                onClick={() => setUrls((list) => list.filter((_, j) => j !== i))}
                aria-label="Kaldır"
                className="ml-auto text-slate-400 hover:text-rose-600"
              >
                ✕
              </button>
              <input type="hidden" name={name} value={u} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
