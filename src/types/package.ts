import z from "zod";
import { PriceSchema, type Currency, type Price } from "./currency";
import { ShippingRouteSchema, type ShippingRoute } from "./shipping";

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

type PackageStatus = (typeof PACKAGE_STATUS)[keyof typeof PACKAGE_STATUS];

type RunStatus = (typeof RUN_STATUS)[keyof typeof RUN_STATUS];

type Dimensions = {
  length: number;
  breadth: number;
  height: number;
};

const DimensionSchema = z.object({
  length: z.number(),
  breadth: z.number(),
  height: z.number(),
});

type Item = {
  id: string;
  name: string;
  dimensions: Dimensions;
  weight: number;
  quantity: number;
  cost: Price;
  timeStamp: string;
  link: string;
  image?: string;
};

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

type PackageRoute = ShippingRoute & {
  feeSplit: {
    firstWeightKg: number;
    firstWeightCost: Price;
    continuedWeightCost: Price;
    miscFee: Price; // any additional fixed fee
  };
  price?: Price;
  trackingNumber: string;
  status: PackageStatus;
  shippedOn?: string;
  deliveredOn?: string;
};

const PackageRouteSchema = ShippingRouteSchema.extend({
  feeSplit: {
    firstWeightKg: z.number(),
    firstWeightCost: PriceSchema,
    continuedWeightCost: PriceSchema,
    miscFee: PriceSchema,
  },
  price: PriceSchema.optional(),
  trackingNumber: z.string(),
  status: z.string(),
  shippedOn: z.string().optional(),
  deliveredOn: z.string().optional(),
});

type ItemRoute = {
  routeId: string;
  price: Price;
};

type Package = {
  id: string;
  name: string;
  dimensions: Dimensions;
  weight: number;
  itemCurrency: Currency;
  routes: PackageRoute[];
  timeStamp: string;
  link: string; // link to the package on the agent / middleman website
  items: Item[];
};

const PackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  dimensions: DimensionSchema,
  weight: z.number(),
  itemCurrency: z.string(),
  routes: z.array(PackageRouteSchema),
  timeStamp: z.iso.datetime(),
  link: z.url(),
  items: z.array(ItemSchema),
});

type Run = {
  id: string;
  name: string;
  timeStamp: string;
  status: RunStatus;
  convertedCurrency: Currency;
  concludedOn?: string;
  endedOn?: string;
};

const RunSchema = z.object({
  id: z.string(),
  name: z.string(),
  timeStamp: z.iso.datetime(),
  status: z.string(),
  convertedCurrency: z.string(),
  concludedOn: z.iso.datetime(),
  endedOn: z.iso.datetime(),
});

export {
  DimensionSchema,
  ItemSchema,
  PackageRouteSchema,
  PackageSchema,
  RunSchema,
  PACKAGE_STATUS,
  RUN_STATUS,
};
export type {
  Dimensions,
  Run,
  PackageRoute,
  ItemRoute,
  Package,
  Item,
  PackageStatus,
  RunStatus,
};
