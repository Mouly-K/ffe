import z from "zod";
import { CountrySchema } from "./country";
import { LocalPriceSchema } from "./currency";

const EVALUATION_TYPE = {
  VOLUMETRIC: "Volumetric",
  ACTUAL: "Actual",
} as const;

const EvaluationTypeSchema = z.literal(
  Object.keys(
    EVALUATION_TYPE
  ) as unknown as (typeof EVALUATION_TYPE)[keyof typeof EVALUATION_TYPE]
);

const WarehouseSchema = z.object({
  id: z.string(),
  name: CountrySchema.shape.name.or(z.string()),
  countryName: CountrySchema.shape.name,
});

const ShippingRouteSchema = z.object({
  id: z.string(),
  shipperId: z.string(),
  name: z.string(),
  originWarehouse: WarehouseSchema,
  destinationWarehouse: WarehouseSchema,
  evaluationType: EvaluationTypeSchema,
  volumetricDivisor: z.number().optional(), // required if evaluationType is volumetric
  feeSplit: z.object({
    firstWeightKg: z.number(),
    firstWeightCost: LocalPriceSchema,
    continuedWeightCost: LocalPriceSchema,
    miscFee: LocalPriceSchema, // any additional fixed fee
  }),
  price: LocalPriceSchema.optional(), // Use for both setting the final calculated price as well as custom prices
});

const ShipperSchema = z.object({
  id: z.string(),
  name: z.string(),
  defaultCurrency: CountrySchema.shape.currencyTag,
  image: z.string().optional(),
  basedIn: WarehouseSchema.optional(),
  shippingRoutes: z.array(ShippingRouteSchema),
});

type EvaluationType = z.infer<typeof EvaluationTypeSchema>;
type Warehouse = z.infer<typeof WarehouseSchema>;
type ShippingRoute = z.infer<typeof ShippingRouteSchema>;
type Shipper = z.infer<typeof ShipperSchema>;

export {
  EVALUATION_TYPE,
  EvaluationTypeSchema,
  WarehouseSchema,
  ShippingRouteSchema,
  ShipperSchema,
};
export type { EvaluationType, Warehouse, ShippingRoute, Shipper };
