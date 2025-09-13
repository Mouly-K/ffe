import type { CountryFlag, Currency, LocalPrice } from "./currency";

const warehouses = {
  CHINA: {
    name: "China",
    countryName: "China",
    flag: "🇨🇳",
  },
  HK: {
    name: "Hong Kong",
    countryName: "Hong Kong",
    flag: "🇭🇰",
  },
  MUMBAI: {
    name: "Mumbai",
    countryName: "India",
    flag: "🇮🇳",
  },
  CHENNAI: {
    name: "Chennai",
    countryName: "India",
    flag: "🇮🇳",
  },
} as const;

type CountryName = (typeof warehouses)[keyof typeof warehouses]["countryName"];

type Warehouse = (typeof warehouses)[keyof typeof warehouses]["name"];

const EVALUATION_TYPE = {
  VOLUMETRIC: "Volumetric",
  ACTUAL: "Actual",
} as const;

type EvaluationType = (typeof EVALUATION_TYPE)[keyof typeof EVALUATION_TYPE];

const currenciesString = JSON.stringify(warehouses);
function gen(
  key: keyof (typeof warehouses)[keyof typeof warehouses]
): Record<string, Warehouse | CountryName | CountryFlag> {
  let obj = JSON.parse(currenciesString);
  Object.keys(obj).forEach((k) => (obj[k] = obj[k][key]));
  return obj;
}

const WAREHOUSE = gen("name") as Record<string, Warehouse>;
const COUNTRY_NAMES = gen("countryName") as Record<string, CountryName>;

interface ShippingRoute {
  id: string;
  shipperId: string;
  name: string;
  originWarehouse: Warehouse;
  destinationWarehouse: Warehouse;
  evaluationType: EvaluationType;
  volumetricDivisor?: number; // required if evaluationType is volumetric
  feeSplit: {
    firstWeightKg: number;
    firstWeightCost: LocalPrice;
    continuedWeightCost: LocalPrice;
    miscFee: LocalPrice; // any additional fixed fee
  };
  price?: LocalPrice; // Use for both setting the final calculated price as well as custom prices
}

interface Shipper {
  id: string;
  name: string;
  defaultCurrency: Currency;
  basedIn: Warehouse;
  shippingRoutes: ShippingRoute[];
}

export { WAREHOUSE, COUNTRY_NAMES, EVALUATION_TYPE };
export type { Warehouse, EvaluationType, ShippingRoute, Shipper };
