import z from "zod";
import type { CountryName } from "./country";
import { LocalPriceSchema, type Currency, type LocalPrice } from "./currency";

const EVALUATION_TYPE = {
  VOLUMETRIC: "Volumetric",
  ACTUAL: "Actual",
} as const;

type EvaluationType = (typeof EVALUATION_TYPE)[keyof typeof EVALUATION_TYPE];

type Warehouse = {
  id: string;
  name: string | CountryName;
  countryName: CountryName;
};

const WarehouseSchema = z.object({
  id: z.string(),
  name: z.string(),
  countryName: z.string(),
});

type ShippingRoute = {
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
};

const ShippingRouteSchema = z.object({
  id: z.string(),
  shipperId: z.string(),
  name: z.string(),
  originWarehouse: WarehouseSchema,
  destinationWarehouse: WarehouseSchema,
  evaluationType: z.string(),
  volumetricDivisor: z.number().optional(),
  feeSplit: {
    firstWeightKg: z.number(),
    firstWeightCost: LocalPriceSchema,
    continuedWeightCost: LocalPriceSchema,
    miscFee: LocalPriceSchema,
  },
  price: LocalPriceSchema.optional(),
});

type Shipper = {
  id: string;
  name: string;
  defaultCurrency: Currency;
  image?: string;
  basedIn?: Warehouse;
  shippingRoutes: ShippingRoute[];
};

const ShipperSchema = z.object({
  id: z.string(),
  name: z.string(),
  defaultCurrency: z.string(),
  image: z.string().optional,
  basedIn: WarehouseSchema.optional(),
  shippingRoutes: z.array(ShippingRouteSchema),
});

export { WarehouseSchema, ShippingRouteSchema, ShipperSchema, EVALUATION_TYPE };
export type { Warehouse, EvaluationType, ShippingRoute, Shipper };
