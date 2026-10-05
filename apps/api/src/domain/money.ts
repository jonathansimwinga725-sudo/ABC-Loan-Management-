const MONEY_PATTERN = /^-?\d+(\.\d{1,4})?$/;

/**
 * Money enters the service layer as decimal strings.
 * This prevents accidental authoritative calculations with JS binary floats.
 */
export function assertMoney(value: string): string {
  if (!MONEY_PATTERN.test(value)) {
    throw new Error("Money must be a decimal string with at most 4 decimal places.");
  }
  return value;
}

export function assertCurrency(value: string): string {
  const currency = value.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Invalid ISO 4217 currency code.");
  return currency;
}
