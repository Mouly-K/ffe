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
import type { LocalPrice, Currency } from "@/types/currency";
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

function generateLocalPrice(
  paidCurrency: Currency,
  timeStamp: Date,
  amount: number
): LocalPrice {
  return {
    paidCurrency,
    paidAmount: amount,
    timeStamp,
  };
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
      image:
        "data:image/jpeg;base64,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",
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
): ShippingRoute {
  const timeStamp = new Date();
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
  const firstWeightCost = faker.number.float({
    min: 1,
    max: 10,
    fractionDigits: 2,
  });
  const continuedWeightCost = firstWeightCost / 4;
  const miscFee = faker.number.float({
    min: 0,
    max: 5,
    fractionDigits: 2,
  });

  const route: ShippingRoute = {
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
      firstWeightKg: faker.number.int({ min: 1, max: 20 }), // 1-20 in steps of 1
      firstWeightCost: generateLocalPrice(
        paidCurrency,
        timeStamp,
        firstWeightCost
      ),
      continuedWeightCost: generateLocalPrice(
        paidCurrency,
        timeStamp,
        continuedWeightCost
      ),
      miscFee: generateLocalPrice(paidCurrency, timeStamp, miscFee),
    },
    ...(Math.random() > 0.5 && {
      price: generateLocalPrice(
        paidCurrency,
        timeStamp,
        faker.number.int({ min: 15, max: 200 })
      ),
    }),
  };

  return route;
}
