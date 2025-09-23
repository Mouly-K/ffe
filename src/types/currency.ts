import z from "zod";
import { countries } from "./country";
import { indexBy } from "@/utils";

type Currency = (typeof countries)[number]["currencyTag"];
type CurrencyValue = Omit<(typeof countries)[number], "currencyTag">;

// @ts-expect-error
const CURRENCIES: {
  [key in Currency]: CurrencyValue;
} = indexBy(countries, "currencyTag");

type LocalPrice = {
  paidCurrency: Currency;
  paidAmount: number;
  timeStamp: string;
};

type Price = LocalPrice & {
  convertedCurrency: Currency; // the default currency to convert to chosen by user
  conversionRate: number; // if user wants to set a custom conversion rate
  convertedAmount: number;
};

const LocalPriceSchema = z.object({
  paidCurrency: z.string(),
  paidAmmount: z.number(),
  timeStamp: z.iso.datetime(),
});

const PriceSchema = LocalPriceSchema.extend({
  convertedCurrency: z.string(),
  conversionRate: z.number(),
  convertedAmount: z.number(),
});

export { LocalPriceSchema, PriceSchema, CURRENCIES };
export type { Currency, CurrencyValue, LocalPrice, Price };
