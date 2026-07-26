"use client";

// Currency-aware money formatting bound to the user's chosen currency.
// Components use this instead of a hardcoded AED formatter.

import { currencyInfo, formatMoney } from "./currency";
import { useStore } from "./store-context";

export function useMoney() {
  const { data } = useStore();
  const code = data.profile.currency || "AED";
  const info = currencyInfo(code);
  return {
    code,
    symbol: info.symbol,
    /** Format an amount in the user's currency. */
    fmt: (n: number, withSymbol = true) => formatMoney(n, code, withSymbol),
  };
}
