// Currency is a per-user label choice — amounts are never converted, just
// formatted with the chosen symbol. Keeps the app backend-free.

export interface CurrencyInfo {
  code: string;
  /** Display symbol (glyph like "$" or a code like "AED"). */
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "AED", symbol: "AED", name: "UAE Dirham" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
];

export const DEFAULT_CURRENCY = "AED";

export function currencyInfo(code: string): CurrencyInfo {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Whether a symbol is really a letter-code (e.g. "AED") vs a glyph ("$"). */
function isCodeSymbol(symbol: string): boolean {
  return /^[A-Za-z]{2,}$/.test(symbol);
}

/**
 * Format an amount in the given currency. Code-style symbols ("AED 1,200")
 * get a trailing space; glyphs sit flush ("$1,200"). Locale is fixed to
 * en-US grouping for SSR stability.
 */
export function formatMoney(n: number, code: string, withSymbol = true): string {
  const s = Math.round(n).toLocaleString("en-US");
  if (!withSymbol) return s;
  const { symbol } = currencyInfo(code);
  return isCodeSymbol(symbol) ? `${symbol} ${s}` : `${symbol}${s}`;
}
