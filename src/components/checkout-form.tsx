"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createOrder, type OrderFormState } from "@/server/order-actions";
import type { AddressView } from "@/server/addresses";

const input =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500";
const card = "rounded-xl border border-slate-200 bg-white p-5";

export function CheckoutForm({
  addresses,
  isLoggedIn,
}: {
  addresses: AddressView[];
  isLoggedIn: boolean;
}) {
  const [state, action, pending] = useActionState<OrderFormState, FormData>(
    createOrder,
    {},
  );
  const [fulfillment, setFulfillment] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const defaultAddr = addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id;

  return (
    <form action={action} className="space-y-5">
      {/* Teslimat yöntemi */}
      <section className={card}>
        <h2 className="font-semibold text-slate-900">Teslimat Yöntemi</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            { v: "DELIVERY", t: "🚚 Kargo ile Teslim", d: "Adresinize gönderilir" },
            { v: "PICKUP", t: "🏪 Mağazadan Teslim", d: "Dükkandan alırsınız (ücretsiz)" },
          ].map((o) => (
            <label
              key={o.v}
              className={`flex cursor-pointer flex-col rounded-lg border p-3 text-sm ${
                fulfillment === o.v
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300"
              }`}
            >
              <span className="flex items-center gap-2 font-medium text-slate-900">
                <input
                  type="radio"
                  name="fulfillment"
                  value={o.v}
                  checked={fulfillment === o.v}
                  onChange={() => setFulfillment(o.v as "DELIVERY" | "PICKUP")}
                  className="accent-emerald-600"
                />
                {o.t}
              </span>
              <span className="ml-6 text-xs text-slate-500">{o.d}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Adres (kargo) */}
      {fulfillment === "DELIVERY" && (
        <section className={card}>
          <h2 className="font-semibold text-slate-900">Teslimat Adresi</h2>
          {isLoggedIn ? (
            addresses.length > 0 ? (
              <div className="mt-3 space-y-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 text-sm hover:border-emerald-400"
                  >
                    <input
                      type="radio"
                      name="addressId"
                      value={a.id}
                      defaultChecked={a.id === defaultAddr}
                      className="mt-1 accent-emerald-600"
                    />
                    <span>
                      <span className="font-medium text-slate-900">
                        {a.title ? `${a.title} · ` : ""}{a.recipient}
                      </span>
                      <span className="block text-slate-500">
                        {a.fullAddress}, {a.district}/{a.city} · {a.phone}
                      </span>
                    </span>
                  </label>
                ))}
                <Link
                  href="/adreslerim"
                  className="inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  + Yeni adres ekle
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Kayıtlı adresiniz yok.{" "}
                <Link href="/adreslerim" className="font-medium text-emerald-600">
                  Adres ekleyin
                </Link>{" "}
                ya da mağazadan teslimi seçin.
              </p>
            )
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input name="recipient" placeholder="Ad Soyad" className={input} required />
              <input name="phone" placeholder="Telefon" className={input} required />
              <input name="city" placeholder="İl" className={input} required />
              <input name="district" placeholder="İlçe" className={input} required />
              <textarea
                name="fullAddress"
                placeholder="Açık adres"
                rows={2}
                className={`${input} sm:col-span-2`}
                required
              />
              <input name="zipCode" placeholder="Posta kodu (opsiyonel)" className={input} />
            </div>
          )}
        </section>
      )}

      {/* Misafir iletişim */}
      {!isLoggedIn && (
        <section className={card}>
          <h2 className="font-semibold text-slate-900">İletişim</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              type="email"
              name="email"
              placeholder="E-posta (sipariş bilgisi için)"
              className={input}
              required
            />
            {fulfillment === "PICKUP" && (
              <input name="phone" placeholder="Telefon" className={input} required />
            )}
          </div>
        </section>
      )}

      {/* Ödeme (placeholder) */}
      <section className={card}>
        <h2 className="font-semibold text-slate-900">Ödeme</h2>
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Online ödeme (iyzico) yakında eklenecek. Şimdilik siparişiniz{" "}
          <strong>Ödeme Bekliyor</strong> olarak oluşturulur; havale/EFT veya
          mağazadan ödeme ile tamamlanır. Sipariş numaranızla takip edebilirsiniz.
        </p>
      </section>

      {state.error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60"
      >
        {pending ? "Sipariş oluşturuluyor…" : "Siparişi Tamamla"}
      </button>
    </form>
  );
}
