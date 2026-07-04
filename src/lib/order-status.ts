// Order status labels + colors. Shared by admin and customer sides.
export const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Awaiting Payment", cls: "bg-amber-100 text-amber-800" },
  PAID: { label: "Paid", cls: "bg-emerald-100 text-emerald-800" },
  PREPARING: { label: "Preparing", cls: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Shipped", cls: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "Delivered", cls: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "Cancelled", cls: "bg-rose-100 text-rose-700" },
  REFUNDED: { label: "Refunded", cls: "bg-slate-200 text-slate-600" },
};

export const ORDER_STATUS_ORDER = [
  "PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];
