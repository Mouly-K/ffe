import { faker } from "@faker-js/faker";

import existingWarehouses from "./warehouses.json";

import { countries } from "../types/country";
import {
  EVALUATION_TYPE,
  type EvaluationType,
  type ShippingRoute,
  type Warehouse,
  type Shipper,
} from "@/types/shipping";
import type { Currency } from "@/types/currency";
import { CURRENCIES } from "@/types/currency";

export function generateWarehouses() {
  // Get unique country names from our country.ts
  const countryNames = Array.from(new Set(countries.map((c) => c.name)));

  // Ensure existing warehouses are included
  const existingPairs = existingWarehouses.map((w) => ({
    name: w.name,
    countryName: w.countryName,
  }));

  // Generate additional random warehouses
  const additionalWarehouses = Array.from({ length: 20 }, () => {
    const countryName = faker.helpers.arrayElement(countryNames);
    return {
      name:
        Math.random() > 0.3
          ? faker.location.city() // 70% chance of being a city
          : countryName, // 30% chance of being the country name
      countryName,
    };
  });

  // Combine existing and new warehouses, ensuring no duplicates
  const allPairs = [...existingPairs, ...additionalWarehouses];
  const uniquePairs = Array.from(
    new Set(allPairs.map((w) => JSON.stringify(w)))
  ).map((str) => JSON.parse(str));

  // Generate final warehouse objects with IDs
  const warehouses = uniquePairs.map(({ name, countryName }) => ({
    id: `WHSE-${faker.string.alphanumeric(6).toUpperCase()}`,
    name,
    countryName,
  }));

  console.log("✅ Generated warehouses", warehouses);
}

export function generateShippers() {
  let shippers = [];
  for (let i = 0; i < 5; i++) {
    const id = `SHIP-${faker.string.alphanumeric(6).toUpperCase()}`;
    const defaultCurrency = faker.helpers.arrayElement(
      Object.keys(CURRENCIES)
    ) as Currency;
    const basedIn = faker.helpers.arrayElement(existingWarehouses) as Warehouse;
    const numRoutes = faker.number.int({ min: 1, max: 5 });

    const shipper: Shipper = {
      id,
      name: faker.company.name(),
      defaultCurrency,
      basedIn,
      image: "",
      shippingRoutes: [],
    };

    // Generate 1-5 shipping routes
    for (let i = 0; i < numRoutes; i++) {
      // 50:50 chance to use defaultCurrency as paidCurrency
      const paidCurrency =
        Math.random() > 0.5
          ? defaultCurrency
          : (faker.helpers.arrayElement(Object.keys(CURRENCIES)) as Currency);
      const route = generateShippingRoute(id, paidCurrency, basedIn);
      shipper.shippingRoutes.push(route);
    }

    shippers.push(shipper);
  }

  console.log("✅ Generated shippers", shippers);
}

export function generateShippingRoute(
  shipperId: string,
  paidCurrency: Currency,
  basedIn: Warehouse
) {
  const timeStamp = new Date().toISOString();
  const evaluationType = faker.helpers.arrayElement([
    EVALUATION_TYPE.VOLUMETRIC,
    EVALUATION_TYPE.ACTUAL,
  ]) as EvaluationType;

  // Random warehouses for origin and destination
  const originWarehouse =
    Math.random() > 0.5
      ? basedIn
      : (faker.helpers.arrayElement(existingWarehouses) as Warehouse);
  const destinationWarehouse =
    Math.random() > 0.8
      ? basedIn
      : (faker.helpers.arrayElement(existingWarehouses) as Warehouse);

  // Generate firstWeightCost (max 10) and calculate continuedWeightCost as 1/4 of it
  const firstWeightAmount = faker.number.float({
    min: 1,
    max: 10,
    fractionDigits: 2,
  });
  const continuedWeightAmount = firstWeightAmount / 4;
  const miscAmount = faker.number.float({
    min: 0,
    max: 5,
    fractionDigits: 2,
  });

  return {
    id: `SRTE-${faker.string.alphanumeric(6).toUpperCase()}`,
    shipperId,
    name: `${originWarehouse.name} to ${destinationWarehouse.name}`,
    originWarehouse,
    destinationWarehouse,
    evaluationType,
    ...(evaluationType === EVALUATION_TYPE.VOLUMETRIC && {
      volumetricDivisor: faker.number.int({ min: 10, max: 16 }) * 500, // 5000 to 8000 in steps of 500
    }),
    feeSplit: {
      paidCurrency,
      timeStamp,
      firstWeightKg: faker.number.int({ min: 1, max: 20 }), // 1-20 in steps of 1
      firstWeightAmount,
      continuedWeightAmount,
      miscAmount,
    },
    feeOverride: Math.random() > 0.5,
    price: {
      paidCurrency,
      paidAmount: faker.number.int({ min: 15, max: 200 }),
      timeStamp,
    },
  } as ShippingRoute;
}
