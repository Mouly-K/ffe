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
  name: z.string(),
  countryName: CountrySchema.shape.name,
});

const FeeSplitSchema = z.object({
  paidCurrency: CountrySchema.shape.currencyTag,
  firstWeightKg: z.number().positive("First weight must be greater than 0"),
  firstWeightAmount: z
    .number()
    .positive("First weight amount must be greater than 0"),
  continuedWeightAmount: z
    .number()
    .positive("Continued weight amount must be greater than 0"),
  miscAmount: z
    .number()
    .nonnegative("Miscellaneous amount must be 0 or greater"),
  timeStamp: z.iso.datetime(),
});

const ShippingRouteBaseSchema = z.object({
  id: z.string(),
  shipperId: z.string(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be less than 50 characters." }),
  originWarehouse: WarehouseSchema,
  destinationWarehouse: WarehouseSchema,
});

const SplitSchema = z.object({
  feeOverride: z.literal(false),
  feeSplit: FeeSplitSchema,
  price: z.object({
    ...LocalPriceSchema.shape,
    paidAmount: z.number(),
  }),
});

const OverrideSchema = z.object({
  feeOverride: z.literal(true),
  feeSplit: z.object({
    ...FeeSplitSchema.shape,
    firstWeightKg: z.number(),
    firstWeightAmount: z.number(),
    continuedWeightAmount: z.number(),
    miscAmount: z.number(),
  }),
  price: LocalPriceSchema,
});

const FeeUnionSchema = z.discriminatedUnion("feeOverride", [
  SplitSchema,
  OverrideSchema,
]);

// Discriminated union for evaluation type
const EvaluationUnionSchema = z.discriminatedUnion("evaluationType", [
  z.object({
    evaluationType: z.literal(EVALUATION_TYPE.ACTUAL),
    volumetricDivisor: z.number().optional().nullable(),
  }),
  z.object({
    evaluationType: z.literal(EVALUATION_TYPE.VOLUMETRIC),
    volumetricDivisor: z
      .number()
      .positive("Must be greater than 0")
      .multipleOf(100, "Must be a multiple of 100"),
  }),
]);

const ShippingRouteSchema = z.intersection(
  ShippingRouteBaseSchema,
  z.intersection(FeeUnionSchema, EvaluationUnionSchema)
);

const ShipperSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be less than 50 characters." }),
  defaultCurrency: CountrySchema.shape.currencyTag,
  image: z.string().optional(),
  basedIn: WarehouseSchema,
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
  FeeSplitSchema,
  ShippingRouteBaseSchema,
  EvaluationUnionSchema,
  ShippingRouteSchema,
  ShipperSchema,
};
export type { EvaluationType, Warehouse, ShippingRoute, Shipper };
