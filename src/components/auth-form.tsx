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
          <span aria-hidden className="text-lg">🔵</span>
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
