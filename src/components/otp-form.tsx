"use client";

import { useActionState } from "react";
import { verifyEmailOtp, type AuthState } from "@/server/auth-actions";
import type { Dictionary } from "@/lib/i18n";

export function OtpForm({
  email,
  t,
}: {
  email: string;
  t: Dictionary["auth"];
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    verifyEmailOtp,
    {},
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="email" value={email} />
      <div>
        <label className="block text-sm font-medium text-slate-700">
          {t.codeLabel}
        </label>
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="______"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-[0.4em] outline-none focus:border-emerald-500"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {t.verifyBtn}
      </button>
    </form>
  );
}
