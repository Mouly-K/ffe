import { v4 as uuidv4 } from "uuid";

import {
  type Run,
  type PackageRoute,
  type Package,
  type Item,
  PACKAGE_STATUS,
  RUN_STATUS,
  type Dimensions,
  type ItemRoute,
} from "./interfaces/package";

import type { Price, Currency, LocalPrice } from "./interfaces/currency";

import { EVALUATION_TYPE } from "./interfaces/shipping";
import type {
  Warehouse,
  EvaluationType,
  ShippingRoute,
  Shipper,
} from "./interfaces/shipping";
import type { SidebarRoute } from "./routes";

// Generic Helepr Functions
function indexBy<T extends Record<K, T[K]>, K extends keyof T>(
  array: readonly T[],
  key: K
): { [key in K]: Omit<T, K> } {
  return array.reduce((acc, item) => {
    const keyValue = item[key];
    const { [key]: _, ...rest } = item;
    acc[keyValue] = rest;
    return acc;
  }, {} as { [key in K]: Omit<T, K> });
}

function filterObject<T extends Record<K, T[K]>, K extends keyof T>(
  obj: T,
  predicate: <K extends keyof T>(key: K, value: T[K]) => boolean
): Partial<T> {
  const filteredEntries = Object.entries(obj).filter(([key, value]) =>
    predicate(key as keyof T, value as T[keyof T])
  );
  return Object.fromEntries(filteredEntries) as Partial<T>;
}

function toFixedWithoutTrailingZeros(num: number, precision: number) {
  return String(parseFloat(num.toFixed(precision)));
}

function getVolume(dimensions: Dimensions): number {
  return dimensions.length * dimensions.breadth * dimensions.height;
}

function getVolumetricWeight(
  dimensions: Dimensions,
  volumetricDivisor: number
): number {
  return getVolume(dimensions) / volumetricDivisor;
}

function findSidebarRouteNameByPath(
  routes: SidebarRoute[],
  path: string
): string | undefined {
  for (const route of routes) {
    if (route.path === path) {
      return route.name;
    }
    if (route.children) {
      const found = findSidebarRouteNameByPath(route.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

// Specific helper functions
async function getConversionRate(
  from: Currency,
  to: Currency,
  date: Date = new Date()
): Promise<{ status: string; conversion_rate?: number }> {
  // Converting to lowercase to match with API calls
  let source = from.toLowerCase(),
    dest = to.toLowerCase();

  let exchangeRates = JSON.parse(
    localStorage.getItem("exchangeRates") || "{}"
  ) as Record<string, any>;

  if (source === dest)
    return Promise.resolve({
      status: "No conversion required",
      conversion_rate: 1,
    });

  const formattedDateString = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const storageKey = `${formattedDateString}/${source}`;

  try {
    // Exchange rate API query requires currency, date, month and year
    // To avoid frequent API calls, store the rates in local storage with key same as URL
    // v6.exchangerate-api.com/v6/YOUR-API-KEY/history/USD/YEAR/MONTH/DAY

    // Check direct source -> dest rate in cache
    if (exchangeRates[storageKey] && exchangeRates[storageKey][dest]) {
      return Promise.resolve({
        status: "Fetched from cache (direct)",
        conversion_rate: exchangeRates[storageKey][dest],
      });
    }

    // Check reverse dest -> source rate in cache
    const reverseStorageKey = `${formattedDateString}/${dest}`;
    if (
      exchangeRates[reverseStorageKey] &&
      exchangeRates[reverseStorageKey][source]
    ) {
      // Calculate reciprocal of the reverse rate
      const reverseRate = exchangeRates[reverseStorageKey][source];
      return Promise.resolve({
        status: "Fetched from cache (reverse)",
        conversion_rate: 1 / reverseRate,
      });
    }

    // If not found in local storage, fetch from API
    const key = `${formattedDateString}/v1/currencies/${source}.json`;
    return await fetch(`${import.meta.env.VITE_EXCHANGE_RATE_BASE_URL}${key}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.date) {
          // Store the fetched rates in local storage
          exchangeRates = {
            ...exchangeRates,
            [storageKey]: data[source],
          };
          localStorage.setItem("exchangeRates", JSON.stringify(exchangeRates));
          return Promise.resolve({
            status: "Fetched from API",
            conversion_rate: data[source][dest],
          });
        }
        throw new Error("Failed to fetch conversion rate");
      });
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    // If not found in local storage, and API call also fails
    const keys = Object.keys(exchangeRates)
      .filter((k) => k.startsWith(source))
      .sort();
    if (keys.length > 0) {
      // Return the rate that is present just after the requested date
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] > storageKey && exchangeRates[keys[i]][dest]) {
          return Promise.resolve({
            status: "Fetched from cache (next available date)",
            conversion_rate: exchangeRates[keys[i]][dest],
          });
        }
      }
      // If no future date found, return the last known rate
      return Promise.resolve({
        status: "Fetched from cache (last known date)",
        conversion_rate: exchangeRates[keys[keys.length - 1]][dest],
      });
    }
    // GG, absolutely hope-less case
    return Promise.reject({
      status: "No exchange rate data available",
    });
  }
}

async function refreshPrice(
  price: Price
): Promise<{ status: string; price?: Price }> {
  const newRate = await getConversionRate(
    price.paidCurrency,
    price.convertedCurrency
  );
  return {
    status: newRate.status,
    price: {
      ...price,
      conversionRate: newRate.conversion_rate!,
      convertedAmount: price.paidAmount * newRate.conversion_rate!,
      timeStamp: new Date(),
    },
  };
}

async function generatePrice(
  paidCurrency: Currency,
  convertedCurrency: Currency,
  paidAmount: number = 0,
  timeStamp: Date = new Date(),
  conversionRate?: number,
  convertedAmount: number = 0
): Promise<{ status: string; price?: Price }> {
  const conversion_rate =
    conversionRate ||
    (await getConversionRate(paidCurrency, convertedCurrency)).conversion_rate!;
  return {
    status: "Price generated successfully! ",
    price: {
      paidCurrency,
      paidAmount,
      timeStamp,
      convertedCurrency: convertedCurrency || paidCurrency,
      conversionRate: conversion_rate,
      convertedAmount: convertedAmount || paidAmount * conversion_rate,
    },
  };
}

function generateShippingRoute(
  shipperId: string,
  paidCurrency: Currency,
  basedIn: Warehouse,
  evaluationType: EvaluationType = EVALUATION_TYPE.ACTUAL,
  price?: LocalPrice
): ShippingRoute {
  const splitPrice: LocalPrice = {
    paidCurrency: paidCurrency,
    paidAmount: 0,
    timeStamp: new Date(),
  };

  return {
    id: uuidv4(),
    shipperId: shipperId,
    name: "",
    originWarehouse: basedIn,
    destinationWarehouse: basedIn,
    evaluationType: EVALUATION_TYPE.ACTUAL,
    ...(evaluationType === EVALUATION_TYPE.VOLUMETRIC && {
      volumetricDivisor: 8000,
    }),
    feeSplit: {
      firstWeightKg: 1,
      firstWeightCost: { ...splitPrice },
      continuedWeightCost: { ...splitPrice },
      miscFee: { ...splitPrice },
    },
    ...(price && { price }),
  };
}

function generateShipper(
  name: string = "",
  defaultCurrency: Currency = "CNY",
  basedIn?: Warehouse
): Shipper {
  return {
    id: uuidv4(),
    name,
    defaultCurrency,
    basedIn,
    shippingRoutes: [],
  };
}

function generateRun(
  name: string = "",
  timeStamp: Date = new Date(),
  convertedCurrency: Currency
): Run {
  return {
    id: uuidv4(),
    name,
    timeStamp,
    status: RUN_STATUS.PENDING,
    convertedCurrency,
  };
}

async function generatePackageRoute(
  route: ShippingRoute,
  convertedCurrency: Currency,
  shippedOn: Date | undefined = undefined,
  deliveredOn: Date | undefined = undefined
): Promise<{ status: string; route: PackageRoute }> {
  const packageRoute: PackageRoute = {
    ...route,
    feeSplit: {
      firstWeightKg: route.feeSplit.firstWeightKg,
      firstWeightCost: (
        await refreshPrice({
          ...route.feeSplit.firstWeightCost,
          convertedCurrency,
        } as Price)
      ).price!,
      continuedWeightCost: (
        await refreshPrice({
          ...route.feeSplit.continuedWeightCost,
          convertedCurrency,
        } as Price)
      ).price!,
      miscFee: (
        await refreshPrice({
          ...route.feeSplit.miscFee,
          convertedCurrency,
        } as Price)
      ).price!,
    },
    ...(route.price && {
      price: (
        await refreshPrice({ ...route.price, convertedCurrency } as Price)
      ).price!,
    }),
    trackingNumber: "",
    status: PACKAGE_STATUS.PENDING,
    shippedOn,
    deliveredOn,
  } as PackageRoute;

  // route.feeSplit = {
  //   firstWeightKg: 0,
  // };

  return {
    status: "Package route created successfully!",
    route: packageRoute,
  };
}

function generatePackage(
  name: string = "",
  dimensions: Dimensions = {
    length: 0,
    breadth: 0,
    height: 0,
  },
  weight: number = 0,
  itemCurrency: Currency,
  timeStamp: Date = new Date(),
  link: string = ""
): Package {
  return {
    id: uuidv4(),
    name,
    dimensions,
    weight,
    itemCurrency,
    routes: [],
    timeStamp,
    link,
    items: [],
  };
}

async function generateItem(
  name: string = "",
  dimensions: Dimensions = {
    length: 0,
    breadth: 0,
    height: 0,
  },
  weight: number = 0,
  quantity: number = 1,
  timeStamp: Date = new Date(),
  link: string = "",
  itemCurrency: Currency,
  convertedCurrency: Currency,
  image?: string
): Promise<{ status: string; item?: Item }> {
  return {
    status: "Item generated suceessfully",
    item: {
      id: uuidv4(),
      name,
      dimensions,
      weight,
      quantity,
      cost: (await generatePrice(itemCurrency, convertedCurrency, 0, timeStamp))
        .price!,
      timeStamp,
      link,
      ...(image && { image }),
    },
  };
}

/**
 * Calculates the shipping price of a package for a particular route
 * @param {Package} pkg - The package
 * @param {number} routeIndex - The index of the route for which the shipping price needs to be computed
 * @returns {ItemRoute[]} - The function updates the price of the route in the route object itself and returns the same
 */
function calculatePackageRoutePrice(pkg: Package, routeIndex: number): Price {
  const route = pkg.routes[routeIndex];
  if (route.price) return route.price;

  const excessKg =
    (route.evaluationType === EVALUATION_TYPE.ACTUAL
      ? pkg.weight / 1000
      : getVolumetricWeight(
          pkg.dimensions,
          route.volumetricDivisor as number
        )) - 1;

  const feeSplit = route.feeSplit;

  route.price = {
    ...feeSplit.firstWeightCost,
    timeStamp: new Date(),
    paidAmount:
      feeSplit.firstWeightCost.paidAmount +
      excessKg * feeSplit.continuedWeightCost.paidAmount +
      feeSplit.miscFee.paidAmount,
    convertedAmount:
      feeSplit.firstWeightCost.convertedAmount +
      excessKg * feeSplit.continuedWeightCost.convertedAmount +
      feeSplit.miscFee.convertedAmount,
  };

  return route.price;
}

function calculatePackageShippingPrice(pkg: Package): LocalPrice {
  // Since each route can have their own paid currency,
  // the total shipping price of the package is calculated only using convertedCurrency
  calculatePackageRoutePrice(pkg, 0);
  return pkg.routes.reduce(
    (total: LocalPrice, _, routeIndex: number) => ({
      ...total,
      paidAmount:
        total.paidAmount +
        calculatePackageRoutePrice(pkg, routeIndex).convertedAmount,
    }),
    {
      paidCurrency: pkg.routes[0].price!.convertedCurrency,
      paidAmount: 0,
      timeStamp: new Date(),
    } as LocalPrice
  );
}

/**
 * Calculates the item's shipping price for each route of the package.
 * @param {Package} pkg - The package the item belongs to.
 * @param {Item} item - The Item for which the shipping price needs to be computed for each route.
 * @returns {ItemRoute[]} An array of ItemRoute, each containing the price of the item for that particular route.
 */
function calculateItemRoutePrice(
  pkg: Package,
  item: Item
): ItemRoute[] | undefined {
  if (!item.dimensions || !item.weight || !pkg.dimensions || !pkg.weight)
    return undefined;

  const weightRatio =
    item.weight / 1000 / pkg.items.reduce((tw, i) => tw + i.weight / 1000, 0);
  const volumeRatio =
    getVolume(item.dimensions) /
    pkg.items.reduce((tw, i) => tw + getVolume(i.dimensions), 0);

  return pkg.routes.map((route, routeIndex) => {
    calculatePackageRoutePrice(pkg, routeIndex);
    const ratio =
      route.evaluationType === EVALUATION_TYPE.ACTUAL
        ? weightRatio
        : volumeRatio;
    return {
      routeId: route.id,
      price: {
        ...route.price,
        paidAmount: ratio * route.price!.paidAmount,
        convertedAmount: ratio * route.price!.convertedAmount,
      } as Price,
    };
  });
}

/**
 * Calculates the item's total shipping price
 * @param {ItemRoute[]} routes - An array of ItemRoute, each containing the price of the item for that particular route.
 * @returns {LocalPrice} - Item's total shipping price
 */
function calculateItemShippingPrice(routes: ItemRoute[]): LocalPrice {
  // Since each route can have their own paid currency,
  // the total shipping price of each item is calculated only using convertedCurrency
  return routes.reduce(
    (total: LocalPrice, route: ItemRoute) => ({
      ...total,
      paidAmount: total.paidAmount + route.price.convertedAmount,
    }),
    {
      paidCurrency: routes[0].price.convertedCurrency,
      paidAmount: 0,
      timeStamp: new Date(),
    } as LocalPrice
  );
}

/**
 * Calculates the item's total price (item cost + shipping)
 * @param {Item} item - The item for which the total price needs to be computed
 * @param {LocalPrice} shippingPrice - The item's total shipping price for all routes
 * @returns {LocalPrice} - Item's total price
 */
function calculateItemTotalPrice(
  item: Item,
  shippingPrice: LocalPrice
): LocalPrice {
  // Since shipping price is converted, same neeeds to be done for item price as well
  // to calculate total item price with shipping
  return {
    paidCurrency: item.cost.convertedCurrency,
    paidAmount: item.cost.convertedAmount + shippingPrice.paidAmount,
    timeStamp: new Date(),
  };
}

export {
  indexBy,
  filterObject,
  toFixedWithoutTrailingZeros,
  getVolume,
  getVolumetricWeight,
  findSidebarRouteNameByPath,
  getConversionRate,
  refreshPrice,
  generatePrice,
  generateShippingRoute,
  generateShipper,
  generateRun,
  generatePackageRoute,
  generatePackage,
  generateItem,
  calculatePackageRoutePrice,
  calculatePackageShippingPrice,
  calculateItemRoutePrice,
  calculateItemShippingPrice,
  calculateItemTotalPrice,
};
