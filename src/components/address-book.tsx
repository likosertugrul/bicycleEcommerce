"use client";

import { useState, useTransition } from "react";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressResult,
} from "@/server/address-actions";
import type { AddressView } from "@/server/addresses";
import type { Dictionary } from "@/lib/i18n";
import { PhoneField } from "@/components/phone-field";
import { formatPhone, isValidPhone } from "@/lib/phone";
import { ConfirmButton } from "@/components/confirm-button";

type T = Dictionary["address"];

export function AddressBook({
  addresses,
  t,
}: {
  addresses: AddressView[];
  t: T;
}) {
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<AddressResult>, onOk?: () => void) {
    setError(null);
    start(async () => {
      const res = await action();
      if (res.ok) onOk?.();
      else
        setError(
          res.error === "phone"
            ? t.invalidPhone
            : res.error === "required"
              ? t.required
              : "Hata",
        );
    });
  }

  function submit(e: React.FormEvent<HTMLFormElement>, id?: string) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const dialCode = String(fd.get("dialCode") ?? "+90");
    const phoneLocal = String(fd.get("phoneLocal") ?? "");
    if (!isValidPhone(dialCode, phoneLocal)) {
      setError(t.invalidPhone);
      return;
    }
    const input = {
      title: String(fd.get("title") ?? ""),
      recipient: String(fd.get("recipient") ?? ""),
      phone: formatPhone(dialCode, phoneLocal),
      city: String(fd.get("city") ?? ""),
      district: String(fd.get("district") ?? ""),
      fullAddress: String(fd.get("fullAddress") ?? ""),
      zipCode: String(fd.get("zipCode") ?? ""),
    };
    run(
      () => (id ? updateAddress(id, input) : addAddress(input)),
      () => {
        setAdding(false);
        setEditingId(null);
      },
    );
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !adding && (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          {t.empty}
        </p>
      )}

      <ul className="space-y-3">
        {addresses.map((a) =>
          editingId === a.id ? (
            <li key={a.id}>
              <AddressForm t={t} initial={a} pending={pending} error={error}
                onSubmit={(e) => submit(e, a.id)} onCancel={() => setEditingId(null)} />
            </li>
          ) : (
            <li
              key={a.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {a.title || a.recipient}
                    </span>
                    {a.isDefault && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {t.default}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{a.recipient} · {a.phone}</p>
                  <p className="text-sm text-slate-600">
                    {a.fullAddress}, {a.district}/{a.city}
                    {a.zipCode ? ` ${a.zipCode}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {!a.isDefault && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => setDefaultAddress(a.id))}
                    className="font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    {t.makeDefault}
                  </button>
                )}
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setError(null);
                    setEditingId(a.id);
                    setAdding(false);
                  }}
                  className="font-medium text-slate-600 hover:text-slate-900"
                >
                  {t.edit}
                </button>
                <ConfirmButton
                  action={() => deleteAddress(a.id)}
                  title={t.delete}
                  message={t.confirmDelete}
                  confirmLabel={t.delete}
                  cancelLabel={t.cancel}
                  className="font-medium text-slate-400 hover:text-rose-600"
                >
                  {t.delete}
                </ConfirmButton>
              </div>
            </li>
          ),
        )}
      </ul>

      {adding ? (
        <AddressForm t={t} pending={pending} error={error}
          onSubmit={(e) => submit(e)} onCancel={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setAdding(true);
            setEditingId(null);
          }}
          className="rounded-lg border border-dashed border-emerald-400 px-4 py-2.5 font-medium text-emerald-700 hover:bg-emerald-50"
        >
          + {t.addNew}
        </button>
      )}
    </div>
  );
}

function AddressForm({
  t,
  initial,
  pending,
  error,
  onSubmit,
  onCancel,
}: {
  t: T;
  initial?: AddressView;
  pending: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  const inputCls =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500";
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          {t.fTitle}
          <input name="title" defaultValue={initial?.title ?? ""} className={inputCls} />
        </label>
        <label className="text-sm">
          {t.fRecipient} *
          <input name="recipient" defaultValue={initial?.recipient ?? ""} className={inputCls} />
        </label>
        <div className="text-sm">
          {t.fPhone} *
          <PhoneField defaultValue={initial?.phone} />
        </div>
        <label className="text-sm">
          {t.fCity} *
          <input name="city" defaultValue={initial?.city ?? ""} className={inputCls} />
        </label>
        <label className="text-sm">
          {t.fDistrict} *
          <input name="district" defaultValue={initial?.district ?? ""} className={inputCls} />
        </label>
        <label className="text-sm">
          {t.fZip}
          <input name="zipCode" defaultValue={initial?.zipCode ?? ""} className={inputCls} />
        </label>
      </div>
      <label className="block text-sm">
        {t.fFullAddress} *
        <textarea name="fullAddress" rows={2} defaultValue={initial?.fullAddress ?? ""} className={inputCls} />
      </label>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {t.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}
