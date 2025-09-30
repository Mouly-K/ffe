import z from "zod";
import { PriceSchema } from "./currency";
import {
  ActualRouteBaseSchema,
  ShippingRouteBaseSchema,
  VolumetricRouteBaseSchema,
} from "./shipping";
import { CountrySchema } from "./country";

const PACKAGE_STATUS = {
  PENDING: "Pending",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
} as const;

const RUN_STATUS = {
  PENDING: "Pending",
  ONGOING: "Ongoing",
  CONCLUDED: "Concluded",
  ENDED: "Ended",
} as const;

const PackageStatusSchema = z.literal(
  Object.values(
    PACKAGE_STATUS
  ) as unknown as (typeof PACKAGE_STATUS)[keyof typeof PACKAGE_STATUS]
);

const RunStatusSchema = z.literal(
  Object.values(
    RUN_STATUS
  ) as unknown as (typeof RUN_STATUS)[keyof typeof RUN_STATUS]
);

const DimensionSchema = z.object({
  length: z.number(),
  breadth: z.number(),
  height: z.number(),
});

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  dimensions: DimensionSchema,
  weight: z.number(),
  quantity: z.number(),
  cost: PriceSchema,
  timeStamp: z.iso.datetime(),
  link: z.url(),
  image: z.string().optional(),
});

const PackageRouteBaseSchema = z.object({
  feeSplit: z.object({
    ...ShippingRouteBaseSchema.shape.feeSplit.shape,
    convertedCurrency: CountrySchema.shape.currencyTag,
    conversionRate: z.number(),
  }),
  price: PriceSchema,
  trackingNumber: z.string(),
  status: PackageStatusSchema,
  shippedOn: z.iso.datetime().optional(),
  deliveredOn: z.iso.datetime().optional(),
});

const PackageRouteSchema = z.discriminatedUnion("evaluationType", [
  z.object({
    ...ActualRouteBaseSchema.shape,
    ...PackageRouteBaseSchema.shape,
  }),
  z.object({
    ...VolumetricRouteBaseSchema.shape,
    ...PackageRouteBaseSchema.shape,
  }),
]);

const ItemRouteSchema = z.object({
  routeId: z.string(),
  price: PriceSchema,
});

const PackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  dimensions: DimensionSchema,
  weight: z.number(),
  itemCurrency: CountrySchema.shape.currencyTag,
  routes: z.array(PackageRouteSchema),
  timeStamp: z.iso.datetime(),
  link: z.url(),
  items: z.array(ItemSchema),
});

const RunSchema = z.object({
  id: z.string(),
  name: z.string(),
  timeStamp: z.iso.datetime(),
  status: RunStatusSchema,
  convertedCurrency: CountrySchema.shape.currencyTag,
  concludedOn: z.iso.datetime().optional(),
  endedOn: z.iso.datetime().optional(),
});

type PackageStatus = z.infer<typeof PackageStatusSchema>;
type RunStatus = z.infer<typeof RunStatusSchema>;
type Dimensions = z.infer<typeof DimensionSchema>;
type Item = z.infer<typeof ItemSchema>;
type PackageRoute = z.infer<typeof PackageRouteSchema>;
type ItemRoute = z.infer<typeof ItemRouteSchema>;
type Package = z.infer<typeof PackageSchema>;
type Run = z.infer<typeof RunSchema>;

export {
  PACKAGE_STATUS,
  RUN_STATUS,
  PackageStatusSchema,
  RunStatusSchema,
  DimensionSchema,
  ItemSchema,
  PackageRouteSchema,
  ItemRouteSchema,
  PackageSchema,
  RunSchema,
};

export type {
  PackageStatus,
  RunStatus,
  Dimensions,
  Item,
  PackageRoute,
  ItemRoute,
  Package,
  Run,
};
