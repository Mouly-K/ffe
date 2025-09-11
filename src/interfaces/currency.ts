const CURRENCY = {
  CNY: "CNY",
  INR: "INR",
  USD: "USD",
} as const;

type CurrencyType = (typeof CURRENCY)[keyof typeof CURRENCY];

interface LocalPrice {
  paidCurrency: CurrencyType;
  paidAmount: number;
  timeStamp: Date;
}

interface Price extends LocalPrice {
  convertedCurrency: CurrencyType; // the default currency to convert to chosen by user
  conversionRate: number; // if user wants to set a custom conversion rate
  convertedAmount: number;
}

export { CURRENCY };
export type { CurrencyType, LocalPrice, Price };
