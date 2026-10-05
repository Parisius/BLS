export const DEFAULT_CURRENCY = "XOF";

export const formatAmount = (amount: number, currency = DEFAULT_CURRENCY) => {
  try {
    return amount.toLocaleString("fr-FR", { style: "currency", currency, currencyDisplay: "code" });
  } catch {
    // An unknown ISO code in the tenant settings must not break every screen showing money.
    return amount.toLocaleString("fr-FR", { style: "currency", currency: DEFAULT_CURRENCY, currencyDisplay: "code" });
  }
};

export const formatNumber = (value: number) => value.toLocaleString("fr-FR");
