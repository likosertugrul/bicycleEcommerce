"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithGoogle,
  type AuthState,
} from "@/server/auth-actions";
import type { Dictionary } from "@/lib/i18n";

export function AuthForm({
  mode,
  t,
}: {
  mode: "signin" | "signup";
  t: Dictionary["auth"];
}) {
  const action = mode === "signin" ? signInWithPassword : signUpWithPassword;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        {mode === "signin" ? t.signInTitle : t.signUpTitle}
      </h1>

      {/* Google */}
      <form action={signInWithGoogle} className="mt-6">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          {t.googleContinue}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        {t.or}
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      {/* E-posta + şifre */}
      <form action={formAction} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-slate-700">
              {t.fullName}
            </label>
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            {t.email}
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            {t.password}
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
          {mode === "signup" && (
            <p className="mt-1 text-xs text-slate-400">{t.passwordHint}</p>
          )}
        </div>

        {state.error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {mode === "signin" ? t.signIn : t.signUp}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {mode === "signin" ? (
          <>
            {t.noAccount}{" "}
            <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700">
              {t.signUp}
            </Link>
          </>
        ) : (
          <>
            {t.haveAccount}{" "}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              {t.signIn}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
