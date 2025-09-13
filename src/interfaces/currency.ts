import { countries } from "./country";
import { indexBy } from "@/utils";

type Currency = (typeof countries)[number]["currencyTag"];

// @ts-expect-error
const CURRENCIES: {
  [key in Currency]: Omit<(typeof countries)[number], "currencyTag">;
} = indexBy(countries, "currencyTag");

interface LocalPrice {
  paidCurrency: Currency;
  paidAmount: number;
  timeStamp: Date;
}

interface Price extends LocalPrice {
  convertedCurrency: Currency; // the default currency to convert to chosen by user
  conversionRate: number; // if user wants to set a custom conversion rate
  convertedAmount: number;
}

export { CURRENCIES };
export type { Currency, LocalPrice, Price };
