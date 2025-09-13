const countries = [
  {
    name: "China",
    currencyName: "Chinese Yuan",
    currencyTag: "CNY",
    flag: "🇨🇳",
  },
  {
    name: "India",
    currencyName: "Indian Rupee",
    currencyTag: "INR",
    flag: "🇮🇳",
  },
  {
    name: "United States",
    currencyName: "United States Dollar",
    currencyTag: "USD",
    flag: "🇺🇸",
  },
  {
    name: "Australia",
    currencyName: "Australian Dollar",
    currencyTag: "AUD",
    flag: "🇦🇺",
  },
  {
    name: "Austria",
    currencyName: "Austrian Schilling",
    currencyTag: "ATS",
    flag: "🇦🇹",
  },
  {
    name: "Belgium",
    currencyName: "Belgian Franc",
    currencyTag: "BEF",
    flag: "🇧🇪",
  },
  {
    name: "Brazil",
    currencyName: "Brazilian Real",
    currencyTag: "BRL",
    flag: "🇧🇷",
  },
  {
    name: "Canada",
    currencyName: "Canadian Dollar",
    currencyTag: "CAD",
    flag: "🇨🇦",
  },
  {
    name: "Switzerland",
    currencyName: "Swiss Franc",
    currencyTag: "CHF",
    flag: "🇨🇭",
  },
  {
    name: "Germany",
    currencyName: "German Mark",
    currencyTag: "DEM",
    flag: "🇩🇪",
  },
  {
    name: "Denmark",
    currencyName: "Danish Krone",
    currencyTag: "DKK",
    flag: "🇩🇰",
  },
  {
    name: "Spain",
    currencyName: "Spanish Peseta",
    currencyTag: "ESP",
    flag: "🇪🇸",
  },
  {
    name: "European Union",
    currencyName: "Euro",
    currencyTag: "EUR",
    flag: "🇪🇺",
  },
  {
    name: "Finland",
    currencyName: "Finnish Markka",
    currencyTag: "FIM",
    flag: "🇫🇮",
  },
  {
    name: "France",
    currencyName: "French Franc",
    currencyTag: "FRF",
    flag: "🇫🇷",
  },
  {
    name: "United Kingdom",
    currencyName: "British Pound Sterling",
    currencyTag: "GBP",
    flag: "🇬🇧",
  },
  {
    name: "Greece",
    currencyName: "Greek Drachma",
    currencyTag: "GRD",
    flag: "🇬🇷",
  },
  {
    name: "Hong Kong",
    currencyName: "Hong Kong Dollar",
    currencyTag: "HKD",
    flag: "🇭🇰",
  },
  {
    name: "Ireland",
    currencyName: "Irish Pound",
    currencyTag: "IEP",
    flag: "🇮🇪",
  },
  {
    name: "Iran",
    currencyName: "Iranian Rial",
    currencyTag: "IRR",
    flag: "🇮🇷",
  },
  {
    name: "Italy",
    currencyName: "Italian Lira",
    currencyTag: "ITL",
    flag: "🇮🇹",
  },
  {
    name: "Japan",
    currencyName: "Japanese Yen",
    currencyTag: "JPY",
    flag: "🇯🇵",
  },
  {
    name: "South Korea",
    currencyName: "South Korean Won",
    currencyTag: "KRW",
    flag: "🇰🇷",
  },
  {
    name: "Sri Lanka",
    currencyName: "Sri Lankan Rupee",
    currencyTag: "LKR",
    flag: "🇱🇰",
  },
  {
    name: "Mexico",
    currencyName: "Mexican Peso",
    currencyTag: "MXN",
    flag: "🇲🇽",
  },
  {
    name: "Malaysia",
    currencyName: "Malaysian Ringgit",
    currencyTag: "MYR",
    flag: "🇲🇾",
  },
  {
    name: "Norway",
    currencyName: "Norwegian Krone",
    currencyTag: "NOK",
    flag: "🇳🇴",
  },
  {
    name: "Netherlands",
    currencyName: "Dutch Guilder",
    currencyTag: "NLG",
    flag: "🇳🇱",
  },
  {
    name: "New Zealand",
    currencyName: "New Zealand Dollar",
    currencyTag: "NZD",
    flag: "🇳🇿",
  },
  {
    name: "Portugal",
    currencyName: "Portuguese Escudo",
    currencyTag: "PTE",
    flag: "🇵🇹",
  },
  {
    name: "Sweden",
    currencyName: "Swedish Krona",
    currencyTag: "SEK",
    flag: "🇸🇪",
  },
  {
    name: "Singapore",
    currencyName: "Singapore Dollar",
    currencyTag: "SGD",
    flag: "🇸🇬",
  },
  {
    name: "Thailand",
    currencyName: "Thai Baht",
    currencyTag: "THB",
    flag: "🇹🇭",
  },
  {
    name: "Taiwan",
    currencyName: "New Taiwan Dollar",
    currencyTag: "TWD",
    flag: "🇹🇼",
  },
  {
    name: "South Africa",
    currencyName: "South African Rand",
    currencyTag: "ZAR",
    flag: "🇿🇦",
  },
] as const;

type CountryName = (typeof countries)[number]["name"];
type CountryFlag = (typeof countries)[number]["flag"];

export { countries };
export type { CountryName, CountryFlag };
