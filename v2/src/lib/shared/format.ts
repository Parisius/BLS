export const formatAmount = (amount: number) =>
  amount.toLocaleString("fr-FR", { style: "currency", currency: "XOF", currencyDisplay: "code" });

export const formatNumber = (value: number) => value.toLocaleString("fr-FR");
