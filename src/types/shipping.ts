import z from "zod";
import { CountrySchema } from "./country";
import { LocalPriceSchema } from "./currency";

import { indexBy } from "@/utils";

import warehouses from "@/data/warehouses.json";

const EVALUATION_TYPE = {
  VOLUMETRIC: "Volumetric",
  ACTUAL: "Actual",
} as const;

const WAREHOUSES: {
  [id: string]: Omit<Warehouse, "id">;
} = indexBy(warehouses as Warehouse[], "id");

const EvaluationTypeSchema = z.literal(
  Object.values(
    EVALUATION_TYPE
  ) as unknown as (typeof EVALUATION_TYPE)[keyof typeof EVALUATION_TYPE]
);

const WarehouseSchema = z.object({
  id: z.string(),
  name: CountrySchema.shape.name.or(z.string()),
  countryName: CountrySchema.shape.name,
});

// Base schema with all shared fields
const ShippingRouteBaseSchema = z.object({
  id: z.string(),
  shipperId: z.string(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be less than 50 characters." }),
  originWarehouse: WarehouseSchema,
  destinationWarehouse: WarehouseSchema,
  feeSplit: z.object({
    paidCurrency: CountrySchema.shape.currencyTag,
    firstWeightKg: z.number().positive("Must be > 0"),
    firstWeightAmount: z.number().positive("Must be > 0"),
    continuedWeightAmount: z.number().positive("Must be > 0"),
    miscAmount: z.number().positive("Must be > 0"),
    timeStamp: z.iso.datetime(),
  }),
  feeOverride: z.boolean(),
  price: LocalPriceSchema,
});

const ActualRouteBaseSchema = z.object({
  ...ShippingRouteBaseSchema.shape,
  evaluationType: z.literal(EVALUATION_TYPE.ACTUAL),
  volumetricDivisor: z.number().optional().nullable(),
});

const VolumetricRouteBaseSchema = z.object({
  ...ShippingRouteBaseSchema.shape,
  evaluationType: z.literal(EVALUATION_TYPE.VOLUMETRIC),
  volumetricDivisor: z
    .number()
    .positive("Must be > 0")
    .multipleOf(100, "Must be a multiple of 100"),
});

// Discriminated union for evaluation type
const ShippingRouteSchema = z.discriminatedUnion("evaluationType", [
  ActualRouteBaseSchema,
  VolumetricRouteBaseSchema,
]);

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
  WAREHOUSES,
  EVALUATION_TYPE,
  EvaluationTypeSchema,
  WarehouseSchema,
  ShippingRouteBaseSchema,
  VolumetricRouteBaseSchema,
  ActualRouteBaseSchema,
  ShippingRouteSchema,
  ShipperSchema,
};
export type { EvaluationType, Warehouse, ShippingRoute, Shipper };
