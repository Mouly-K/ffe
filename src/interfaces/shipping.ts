import type { CurrencyType, Price } from "./currency";

const WAREHOUSE = {
  CHINA: "China",
  HK: "Hong Kong",
  MUMBAI: "Mumbai",
  CHENNAI: "Chennai",
} as const;

const EVALUATION_TYPE = {
  VOLUMETRIC: "Volumetric",
  ACTUAL: "Actual",
} as const;

type Warehouse = (typeof WAREHOUSE)[keyof typeof WAREHOUSE];

type EvaluationType = (typeof EVALUATION_TYPE)[keyof typeof EVALUATION_TYPE];

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
    firstWeightCost: Price;
    continuedWeightCost: Price;
    miscFee: Price; // any additional fixed fee
  };
  price?: Price; // Use for both setting the final calculated price as well as custom prices
}

interface Shipper {
  id: string;
  name: string;
  currencyType: CurrencyType;
  basedIn: Warehouse;
  shippingRoutes: ShippingRoute[];
}

export { WAREHOUSE, EVALUATION_TYPE };
export type { Warehouse, EvaluationType, ShippingRoute, Shipper };
