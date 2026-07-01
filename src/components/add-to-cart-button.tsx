"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/server/cart-actions";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleClick() {
    startTransition(async () => {
      await addToCart(productId, 1);
      setAdded(true);
      // Header rozetinin güncellenmesi için bildir.
      window.dispatchEvent(new Event("cart:updated"));
      setTimeout(() => setAdded(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      className="rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Ekleniyor…" : added ? "Sepete eklendi ✓" : "Sepete Ekle"}
    </button>
  );
}
