const currencies = {
  CNY: {
    name: "Chinese Yuan",
    currency: "CNY",
    flag: "🇨🇳",
  },
  INR: {
    name: "Indian Rupee",
    currency: "INR",
    flag: "🇮🇳",
  },
  USD: {
    name: "United States Dollar",
    currency: "USD",
    flag: "🇺🇸",
  },
  AUD: {
    name: "Australian Dollar",
    currency: "AUD",
    flag: "🇦🇺",
  },
  ATS: {
    name: "Austrian Schilling",
    currency: "ATS",
    flag: "🇦🇹",
  },
  BEF: {
    name: "Belgian Franc",
    currency: "BEF",
    flag: "🇧🇪",
  },
  BRL: {
    name: "Brazilian Real",
    currency: "BRL",
    flag: "🇧🇷",
  },
  CAD: {
    name: "Canadian Dollar",
    currency: "CAD",
    flag: "🇨🇦",
  },
  CHF: {
    name: "Swiss Franc",
    currency: "CHF",
    flag: "🇨🇭",
  },
  DEM: {
    name: "German Mark",
    currency: "DEM",
    flag: "🇩🇪",
  },
  DKK: {
    name: "Danish Krone",
    currency: "DKK",
    flag: "🇩🇰",
  },
  ESP: {
    name: "Spanish Peseta",
    currency: "ESP",
    flag: "🇪🇸",
  },
  EUR: {
    name: "Euro",
    currency: "EUR",
    flag: "🇪🇺",
  },
  FIM: {
    name: "Finnish Markka",
    currency: "FIM",
    flag: "🇫🇮",
  },
  FRF: {
    name: "French Franc",
    currency: "FRF",
    flag: "🇫🇷",
  },
  GBP: {
    name: "British Pound Sterling",
    currency: "GBP",
    flag: "🇬🇧",
  },
  GRD: {
    name: "Greek Drachma",
    currency: "GRD",
    flag: "🇬🇷",
  },
  HKD: {
    name: "Hong Kong Dollar",
    currency: "HKD",
    flag: "🇭🇰",
  },
  IEP: {
    name: "Irish Pound",
    currency: "IEP",
    flag: "🇮🇪",
  },
  IRR: {
    name: "Iranian Rial",
    currency: "IRR",
    flag: "🇮🇷",
  },
  ITL: {
    name: "Italian Lira",
    currency: "ITL",
    flag: "🇮🇹",
  },
  JPY: {
    name: "Japanese Yen",
    currency: "JPY",
    flag: "🇯🇵",
  },
  KRW: {
    name: "South Korean Won",
    currency: "KRW",
    flag: "🇰🇷",
  },
  LKR: {
    name: "Sri Lankan Rupee",
    currency: "LKR",
    flag: "🇱🇰",
  },
  MXN: {
    name: "Mexican Peso",
    currency: "MXN",
    flag: "🇲🇽",
  },
  MYR: {
    name: "Malaysian Ringgit",
    currency: "MYR",
    flag: "🇲🇾",
  },
  NOK: {
    name: "Norwegian Krone",
    currency: "NOK",
    flag: "🇳🇴",
  },
  NLG: {
    name: "Dutch Guilder",
    currency: "NLG",
    flag: "🇳🇱",
  },
  NZD: {
    name: "New Zealand Dollar",
    currency: "NZD",
    flag: "🇳🇿",
  },
  PTE: {
    name: "Portuguese Escudo",
    currency: "PTE",
    flag: "🇵🇹",
  },
  SEK: {
    name: "Swedish Krona",
    currency: "SEK",
    flag: "🇸🇪",
  },
  SGD: {
    name: "Singapore Dollar",
    currency: "SGD",
    flag: "🇸🇬",
  },
  THB: {
    name: "Thai Baht",
    currency: "THB",
    flag: "🇹🇭",
  },
  TWD: {
    name: "New Taiwan Dollar",
    currency: "TWD",
    flag: "🇹🇼",
  },
  ZAR: {
    name: "South African Rand",
    currency: "ZAR",
    flag: "🇿🇦",
  },
} as const;

type CurrencyName = (typeof currencies)[keyof typeof currencies]["name"];
type CountryFlag = (typeof currencies)[keyof typeof currencies]["flag"];
type Currency = (typeof currencies)[keyof typeof currencies]["currency"];

const currenciesString = JSON.stringify(currencies);
function gen(
  key: keyof (typeof currencies)[keyof typeof currencies]
): Record<string, CurrencyName | Currency | CountryFlag> {
  let obj = JSON.parse(currenciesString);
  Object.keys(obj).forEach((k) => (obj[k] = obj[k][key]));
  return obj;
}

const CURRENCY_NAME = gen("name") as Record<string, CurrencyName>;
const COUNTRY_FLAGS = gen("flag") as Record<string, CountryFlag>;
const CURRENCY = gen("currency") as Record<string, Currency>;

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

export { CURRENCY_NAME, COUNTRY_FLAGS, CURRENCY };
export type { Currency, CountryFlag, LocalPrice, Price };
