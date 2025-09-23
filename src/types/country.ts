import z from "zod";
import { indexBy } from "@/utils";

const countries = [
  {
    name: "China",
    currencyName: "Chinese Yuan",
    currencyTag: "CNY",
    currencySymbol: "¥",
    flag: "🇨🇳",
  },
  {
    name: "India",
    currencyName: "Indian Rupee",
    currencyTag: "INR",
    currencySymbol: "₹",
    flag: "🇮🇳",
  },
  {
    name: "United States",
    currencyName: "United States Dollar",
    currencyTag: "USD",
    currencySymbol: "$",
    flag: "🇺🇸",
  },
  {
    name: "Australia",
    currencyName: "Australian Dollar",
    currencyTag: "AUD",
    currencySymbol: "$",
    flag: "🇦🇺",
  },
  {
    name: "Austria",
    currencyName: "Austrian Schilling",
    currencyTag: "ATS",
    currencySymbol: "S",
    flag: "🇦🇹",
  },
  {
    name: "Belgium",
    currencyName: "Belgian Franc",
    currencyTag: "BEF",
    currencySymbol: "F",
    flag: "🇧🇪",
  },
  {
    name: "Brazil",
    currencyName: "Brazilian Real",
    currencyTag: "BRL",
    currencySymbol: "R$",
    flag: "🇧🇷",
  },
  {
    name: "Canada",
    currencyName: "Canadian Dollar",
    currencyTag: "CAD",
    currencySymbol: "$",
    flag: "🇨🇦",
  },
  {
    name: "Switzerland",
    currencyName: "Swiss Franc",
    currencyTag: "CHF",
    currencySymbol: "Fr",
    flag: "🇨🇭",
  },
  {
    name: "Germany",
    currencyName: "German Mark",
    currencyTag: "DEM",
    currencySymbol: "DM",
    flag: "🇩🇪",
  },
  {
    name: "Denmark",
    currencyName: "Danish Krone",
    currencyTag: "DKK",
    currencySymbol: "kr",
    flag: "🇩🇰",
  },
  {
    name: "Spain",
    currencyName: "Spanish Peseta",
    currencyTag: "ESP",
    currencySymbol: "Pts",
    flag: "🇪🇸",
  },
  {
    name: "European Union",
    currencyName: "Euro",
    currencyTag: "EUR",
    currencySymbol: "€",
    flag: "🇪🇺",
  },
  {
    name: "Finland",
    currencyName: "Finnish Markka",
    currencyTag: "FIM",
    currencySymbol: "mk",
    flag: "🇫🇮",
  },
  {
    name: "France",
    currencyName: "French Franc",
    currencyTag: "FRF",
    currencySymbol: "F",
    flag: "🇫🇷",
  },
  {
    name: "United Kingdom",
    currencyName: "British Pound Sterling",
    currencyTag: "GBP",
    currencySymbol: "£",
    flag: "🇬🇧",
  },
  {
    name: "Greece",
    currencyName: "Greek Drachma",
    currencyTag: "GRD",
    currencySymbol: "₯",
    flag: "🇬🇷",
  },
  {
    name: "Hong Kong",
    currencyName: "Hong Kong Dollar",
    currencyTag: "HKD",
    currencySymbol: "$",
    flag: "🇭🇰",
  },
  {
    name: "Ireland",
    currencyName: "Irish Pound",
    currencyTag: "IEP",
    currencySymbol: "£",
    flag: "🇮🇪",
  },
  {
    name: "Iran",
    currencyName: "Iranian Rial",
    currencyTag: "IRR",
    currencySymbol: "﷼",
    flag: "🇮🇷",
  },
  {
    name: "Italy",
    currencyName: "Italian Lira",
    currencyTag: "ITL",
    currencySymbol: "₤",
    flag: "🇮🇹",
  },
  {
    name: "Japan",
    currencyName: "Japanese Yen",
    currencyTag: "JPY",
    currencySymbol: "¥",
    flag: "🇯🇵",
  },
  {
    name: "South Korea",
    currencyName: "South Korean Won",
    currencyTag: "KRW",
    currencySymbol: "₩",
    flag: "🇰🇷",
  },
  {
    name: "Sri Lanka",
    currencyName: "Sri Lankan Rupee",
    currencyTag: "LKR",
    currencySymbol: "Rs",
    flag: "🇱🇰",
  },
  {
    name: "Mexico",
    currencyName: "Mexican Peso",
    currencyTag: "MXN",
    currencySymbol: "$",
    flag: "🇲🇽",
  },
  {
    name: "Malaysia",
    currencyName: "Malaysian Ringgit",
    currencyTag: "MYR",
    currencySymbol: "RM",
    flag: "🇲🇾",
  },
  {
    name: "Norway",
    currencyName: "Norwegian Krone",
    currencyTag: "NOK",
    currencySymbol: "kr",
    flag: "🇳🇴",
  },
  {
    name: "Netherlands",
    currencyName: "Dutch Guilder",
    currencyTag: "NLG",
    currencySymbol: "ƒ",
    flag: "🇳🇱",
  },
  {
    name: "New Zealand",
    currencyName: "New Zealand Dollar",
    currencyTag: "NZD",
    currencySymbol: "$",
    flag: "🇳🇿",
  },
  {
    name: "Portugal",
    currencyName: "Portuguese Escudo",
    currencyTag: "PTE",
    currencySymbol: "Esc",
    flag: "🇵🇹",
  },
  {
    name: "Sweden",
    currencyName: "Swedish Krona",
    currencyTag: "SEK",
    currencySymbol: "kr",
    flag: "🇸🇪",
  },
  {
    name: "Singapore",
    currencyName: "Singapore Dollar",
    currencyTag: "SGD",
    currencySymbol: "$",
    flag: "🇸🇬",
  },
  {
    name: "Thailand",
    currencyName: "Thai Baht",
    currencyTag: "THB",
    currencySymbol: "฿",
    flag: "🇹🇭",
  },
  {
    name: "Taiwan",
    currencyName: "New Taiwan Dollar",
    currencyTag: "TWD",
    currencySymbol: "NT$",
    flag: "🇹🇼",
  },
  {
    name: "South Africa",
    currencyName: "South African Rand",
    currencyTag: "ZAR",
    currencySymbol: "R",
    flag: "🇿🇦",
  },
] as const;

const CountrySchema = z.object({
  name: z.string(),
  currencyName: z.string(),
  currencyTag: z.string(),
  currencySymbol: z.string(),
  flag: z.emoji("Expected a flag emoji"),
});

type CountryName = (typeof countries)[number]["name"];
type CountryFlag = (typeof countries)[number]["flag"];

// @ts-expect-error
const COUNTRIES: {
  [key in CountryName]: Omit<(typeof countries)[number], "name">;
} = indexBy(countries, "name");

export { CountrySchema, countries, COUNTRIES };
export type { CountryName, CountryFlag };
