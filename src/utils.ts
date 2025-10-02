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
} from "./types/package";

import type { Price, Currency, LocalPrice } from "./types/currency";

import { EVALUATION_TYPE } from "./types/shipping";
import type {
  Warehouse,
  EvaluationType,
  ShippingRoute,
  Shipper,
} from "./types/shipping";
import type { SidebarRoute } from "./routes";
import { isEqual } from "lodash";

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

function isEqualSansId<T extends { id: string }>(obj1: T, obj2: T): boolean {
  return isEqual(
    (({ id, ...rest }: T) => rest)(obj1),
    (({ id, ...rest }: T) => rest)(obj2)
  );
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
  date: string = new Date().toISOString()
): Promise<{ status: string; conversion_rate?: number }> {
  // Converting to lowercase to match with API calls
  let source = from.toLowerCase(),
    dest = to.toLowerCase();

  const exchangeRates = JSON.parse(
    localStorage.getItem("exchangeRates") || "{}"
  ) as Record<string, any>;

  if (source === dest)
    return Promise.resolve({
      status: "No conversion required",
      conversion_rate: 1,
    });

  async function fetchFromUrl(
    url: string,
    storageKey: string,
    baseUrl: string,
    isRetry: boolean = false
  ): Promise<{ status: string; conversion_rate: number }> {
    const response = await fetch(url);
    const data = await response.json();

    if (
      data.error?.includes("Couldn't find the requested release version") &&
      !isRetry
    ) {
      // Try previous day if release not found
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const result = await getConversionRate(from, to, prevDate.toISOString());
      if (!result.conversion_rate) {
        throw new Error("No conversion rate available for previous day");
      }
      return {
        status: "Fetched from previous day",
        conversion_rate: result.conversion_rate,
      };
    }

    if (!data.date) {
      throw new Error(`Failed to fetch conversion rate from ${url}`);
    }

    // Store the fetched rates in local storage
    localStorage.setItem(
      "exchangeRates",
      JSON.stringify({
        ...exchangeRates,
        [storageKey]: data[source],
      })
    );

    return {
      status:
        url === baseUrl ? "Fetched from API" : "Fetched from fallback API",
      conversion_rate: data[source][dest],
    };
  }

  function getDateString(dateString: string) {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }
  const presentDay = getDateString(date);
  const storageKey = `${presentDay}/${source}`;

  try {
    // Check direct source -> dest rate in cache
    if (exchangeRates[storageKey]?.[dest]) {
      return {
        status: "Fetched from cache (direct)",
        conversion_rate: exchangeRates[storageKey][dest],
      };
    }

    // Check reverse dest -> source rate in cache
    const reverseStorageKey = `${presentDay}/${dest}`;
    if (exchangeRates[reverseStorageKey]?.[source]) {
      return {
        status: "Fetched from cache (reverse)",
        conversion_rate: 1 / exchangeRates[reverseStorageKey][source],
      };
    }

    // If not found in local storage, fetch from API
    const _url = {
      date: presentDay,
      apiVersion: "v1",
      endpoint: `currencies/${source}.json`,
    };

    const BASE_URL = `${import.meta.env.VITE_EXCHANGE_RATE_BASE_URL}${
      _url.date
    }/${_url.apiVersion}/${_url.endpoint}`;

    const FALLBACK_URL = `https://${_url.date}${
      import.meta.env.VITE_EXCHANGE_RATE_FALLBACK_URL
    }${_url.apiVersion}/${_url.endpoint}`;

    // Try primary URL first, then fallback if it fails
    return await fetchFromUrl(BASE_URL, storageKey, BASE_URL).catch(() =>
      fetchFromUrl(FALLBACK_URL, storageKey, BASE_URL)
    );
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    // If not found in local storage, and API call also fails
    const keys = Object.keys(exchangeRates)
      .filter((k) => k.includes(source))
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
      timeStamp: new Date().toISOString(),
    },
  };
}

async function generatePrice(
  paidCurrency: Currency,
  convertedCurrency: Currency,
  paidAmount: number = 0,
  timeStamp: string = new Date().toISOString(),
  conversionRate?: number
): Promise<{ status: string; price?: Price }> {
  const conversion_rate =
    conversionRate ||
    (await getConversionRate(paidCurrency, convertedCurrency, timeStamp))
      .conversion_rate!;
  return {
    status: "Price generated successfully! ",
    price: {
      paidCurrency,
      paidAmount,
      timeStamp,
      convertedCurrency: convertedCurrency || paidCurrency,
      conversionRate: conversion_rate,
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
  const timeStamp = new Date().toISOString();

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
      paidCurrency,
      firstWeightKg: 0,
      firstWeightAmount: 0,
      continuedWeightAmount: 0,
      miscAmount: 0,
      timeStamp,
    },
    feeOverride: false,
    price: price || {
      paidCurrency: paidCurrency,
      paidAmount: 0,
      timeStamp,
    },
  };
}

function generateShipper(
  name: string = "",
  defaultCurrency: Currency = "CNY",
  basedIn: Warehouse
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
  timeStamp: string = new Date().toISOString(),
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
  const conversionRate = (
    await getConversionRate(route.feeSplit.paidCurrency, convertedCurrency)
  ).conversion_rate;

  const packageRoute: PackageRoute = {
    ...route,
    feeSplit: {
      ...route.feeSplit,
      convertedCurrency,
      conversionRate,
    },
    price: {
      ...route.price,
      convertedCurrency,
      conversionRate,
    },
    trackingNumber: "",
    status: PACKAGE_STATUS.PENDING,
    shippedOn,
    deliveredOn,
  } as PackageRoute;

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
  timeStamp: string = new Date().toISOString(),
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
  timeStamp: string = new Date().toISOString(),
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
 * @returns {ItemRoute[]} - The function returns the price of the route
 */
function calculatePackageRoutePrice(pkg: Package, routeIndex: number): Price {
  const route = pkg.routes[routeIndex];

  if (route.feeOverride) return route.price;

  const excessKg =
    (route.evaluationType === EVALUATION_TYPE.ACTUAL
      ? pkg.weight / 1000
      : getVolumetricWeight(
          pkg.dimensions,
          route.volumetricDivisor as number
        )) - 1;

  const feeSplit = route.feeSplit;

  return {
    paidCurrency: feeSplit.paidCurrency,
    paidAmount:
      feeSplit.firstWeightAmount +
      excessKg * feeSplit.continuedWeightAmount +
      feeSplit.miscAmount,
    timeStamp: feeSplit.timeStamp,
    convertedCurrency: feeSplit.convertedCurrency,
    conversionRate: feeSplit.conversionRate,
  };
}

function calculatePackageShippingPrice(pkg: Package): LocalPrice {
  // Since each route can have their own paid currency,
  // the total shipping price of the package is calculated only using convertedCurrency
  return pkg.routes.reduce(
    (total: LocalPrice, _, routeIndex: number) => {
      const routePrice = calculatePackageRoutePrice(pkg, routeIndex);
      return {
        ...total,
        paidAmount:
          total.paidAmount + routePrice.paidAmount * routePrice.conversionRate,
      };
    },
    {
      paidCurrency: pkg.routes[0].price.convertedCurrency,
      paidAmount: 0,
      timeStamp: new Date().toISOString(),
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
    const routePrice = calculatePackageRoutePrice(pkg, routeIndex);
    const ratio =
      route.evaluationType === EVALUATION_TYPE.ACTUAL
        ? weightRatio
        : volumeRatio;
    return {
      routeId: route.id,
      price: {
        ...routePrice,
        paidAmount: ratio * routePrice.paidAmount,
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
      paidAmount:
        total.paidAmount + route.price.paidAmount * route.price.conversionRate,
    }),
    {
      paidCurrency: routes[0].price.convertedCurrency,
      paidAmount: 0,
      timeStamp: new Date().toISOString(),
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
    paidAmount:
      item.cost.paidAmount * item.cost.conversionRate +
      shippingPrice.paidAmount,
    timeStamp: new Date().toISOString(),
  };
}

export {
  indexBy,
  filterObject,
  toFixedWithoutTrailingZeros,
  isEqualSansId,
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
