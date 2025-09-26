import z from "zod";
import { countries, CountrySchema } from "./country";
import { indexBy } from "@/utils";

const LocalPriceSchema = z.object({
  paidCurrency: CountrySchema.shape.currencyTag,
  paidAmount: z.number().positive("Must be > 0"),
  timeStamp: z.iso.datetime(),
});

const PriceSchema = z.object({
  ...LocalPriceSchema.shape,
  convertedCurrency: CountrySchema.shape.currencyTag, // the default currency to convert to chosen by user
  conversionRate: z.number(), // storing conversion rate, in case user wants to set a custom conversion rate
  convertedAmount: z.number(),
});

type Currency = z.infer<typeof CountrySchema.shape.currencyTag>;
type CurrencyValue = Omit<z.infer<typeof CountrySchema>, "currencyTag">;
type LocalPrice = z.infer<typeof LocalPriceSchema>;
type Price = z.infer<typeof PriceSchema>;

// @ts-expect-error
const CURRENCIES: {
  [key in Currency]: CurrencyValue;
} = indexBy(countries, "currencyTag");

export { LocalPriceSchema, PriceSchema, CURRENCIES };
export type { Currency, CurrencyValue, LocalPrice, Price };
