import type { Currency, Price } from "./currency";
import type { ShippingRoute } from "./shipping";

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

interface Dimensions {
  length: number;
  breadth: number;
  height: number;
}

interface Run {
  id: string;
  name: string;
  timeStamp: Date;
  status: RunStatus;
  convertedCurrency: Currency;
  concludedOn?: Date;
  endedOn?: Date;
}

interface PackageRoute extends ShippingRoute {
  trackingNumber: string;
  status: PackageStatus;
  shippedOn?: Date;
  deliveredOn?: Date;
}

interface ItemRoute {
  routeId: string;
  price: Price;
}

interface Package {
  id: string;
  name: string;
  dimensions: Dimensions;
  weight: number;
  itemCurrency: Currency;
  routes: PackageRoute[];
  timeStamp: Date;
  link: string; // link to the package on the agent / middleman website
  items: Item[];
}

interface Item {
  id: string;
  name: string;
  dimensions: Dimensions;
  weight: number;
  quantity: number;
  cost: Price;
  timeStamp: Date;
  link: string;
  image?: string;
}

export { PACKAGE_STATUS, RUN_STATUS };
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
