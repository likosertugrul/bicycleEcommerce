"use client";

import { useState, useTransition } from "react";

// Tetikleyici buton + onay modalı. `action` bir (bound) server action ya da
// herhangi bir async fonksiyon olabilir; "onayla"ya basınca çalışır.
export function ConfirmButton({
  action,
  children,
  message,
  title = "Emin misin?",
  confirmLabel = "Sil",
  cancelLabel = "Vazgeç",
  className,
  stopPropagation = false,
}: {
  action: () => void | Promise<unknown>;
  children: React.ReactNode;
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  stopPropagation?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
          setOpen(true);
        }}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={(e) => {
                  e.stopPropagation();
                  start(async () => {
                    await action();
                    setOpen(false);
                  });
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
