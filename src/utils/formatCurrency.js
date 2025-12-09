// src/utils/formatCurrency.js
export function formatCurrency(value) {
  if (value == null || isNaN(value)) return "0,00 Kz";

  return value
    .toLocaleString("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    })
    .replace("AOA", "Kz");
}