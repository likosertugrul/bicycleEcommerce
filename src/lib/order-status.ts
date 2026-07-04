// Sipariş durumu etiketleri + renkleri (TR). Admin ve kullanıcı tarafı ortak.
export const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Ödeme Bekliyor", cls: "bg-amber-100 text-amber-800" },
  PAID: { label: "Ödendi", cls: "bg-emerald-100 text-emerald-800" },
  PREPARING: { label: "Hazırlanıyor", cls: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Kargoda", cls: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "Teslim Edildi", cls: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "İptal", cls: "bg-rose-100 text-rose-700" },
  REFUNDED: { label: "İade", cls: "bg-slate-200 text-slate-600" },
};

export const ORDER_STATUS_ORDER = [
  "PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];
