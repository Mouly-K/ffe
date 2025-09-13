import type { Currency, LocalPrice } from "./currency";

const EVALUATION_TYPE = {
  VOLUMETRIC: "Volumetric",
  ACTUAL: "Actual",
} as const;

type EvaluationType = (typeof EVALUATION_TYPE)[keyof typeof EVALUATION_TYPE];

type Warehouse = {
  id: string;
  name: string;
  countryName: string;
};

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
  basedIn?: Warehouse;
  shippingRoutes: ShippingRoute[];
}

export { EVALUATION_TYPE };
export type { Warehouse, EvaluationType, ShippingRoute, Shipper };
