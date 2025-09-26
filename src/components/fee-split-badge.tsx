import { use } from "react";
import { BadgePercent, Box, PackagePlus } from "lucide-react";
import { useSettings } from "@/components/settings-provider";

import { TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator as HorizontalSeparator } from "@/components/ui/separator";

import { Separator, BadgeWrapper } from "@/components/price-badge";

import { CURRENCIES, type Currency } from "@/types/currency";
import type { ShippingRoute } from "@/types/shipping";

import { getConversionRate, toFixedWithoutTrailingZeros } from "@/utils";

import _ from "lodash";

function getRateObject(
  feeSplit: ShippingRoute["feeSplit"],
  userCurrency: Currency,
  rate?: number
) {
  return {
    currency: !rate ? feeSplit.firstWeightCost.paidCurrency : userCurrency,
    symbol: !rate
      ? CURRENCIES[feeSplit.firstWeightCost.paidCurrency].currencySymbol
      : CURRENCIES[userCurrency].currencySymbol,
    items: [
      {
        icon: Box,
        label: `First ${feeSplit.firstWeightKg}kg`,
        amount: toFixedWithoutTrailingZeros(
          feeSplit.firstWeightCost.paidAmount * (rate || 1),
          2
        ),
      },
      {
        icon: PackagePlus,
        label: `Per Add'l kg`,
        amount: toFixedWithoutTrailingZeros(
          feeSplit.continuedWeightCost.paidAmount * (rate || 1),
          2
        ),
      },
      {
        icon: BadgePercent,
        label: `Misc Fee`,
        amount: toFixedWithoutTrailingZeros(
          feeSplit.miscFee.paidAmount * (rate || 1),
          2
        ),
      },
    ],
  };
}

function AwaitBadge({
  feeSplit,
  userCurrency,
  getRate,
}: {
  feeSplit: ShippingRoute["feeSplit"];
  userCurrency: Currency;
  getRate: Promise<{ status: string; conversion_rate?: number }>;
}) {
  const conversion_rate = use(getRate).conversion_rate;
  const rates = getRateObject(feeSplit, userCurrency, conversion_rate);
  const originalRates = getRateObject(feeSplit, userCurrency);

  return (
    <>
      <TooltipTrigger className="flex">
        <p className="min-w-[5.4rem] text-center">
          {feeSplit.firstWeightKg +
            "kg " +
            rates.symbol +
            " " +
            rates.items[0].amount}
        </p>
        <Separator />
        <span className="min-w-[5.8rem] flex gap-1">
          <PackagePlus size="14" className="h-3.5 w-3.5 ml-1" />
          <p>kg</p>
          <p className="flex flex-1 justify-center">
            {rates.symbol + " " + rates.items[1].amount}
          </p>
        </span>
        <Separator />
        <p className="min-w-15 text-center">
          {rates.symbol + " " + rates.items[2].amount}
        </p>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-3 w-80 px-0 py-3">
        {[...(conversion_rate ? [rates] : []), originalRates].map(
          (rates, index, arr) => (
            <div key={index} className="flex flex-col gap-3">
              <span className="text-muted-foreground font-medium text-xs px-2.5">
                {`${
                  index === 0 && arr.length > 1 ? "Converted" : "Actual"
                } Price - ${rates.currency}`}
              </span>
              {rates.items.map((item, i) => (
                <div
                  key={index + "-" + i}
                  className="flex flex-1 px-1.5 items-center"
                >
                  <item.icon className="mr-3 h-4 text-muted-foreground" />
                  <span className="text-left text-sm leading-tight truncate">
                    {item.label}
                  </span>
                  <span className="ml-auto mr-1 flex h-4 min-w-4 items-center justify-center font-mono text-xs text-muted-foreground">
                    {rates.symbol} {item.amount}
                  </span>
                </div>
              ))}
              {index === 0 && arr.length > 1 && (
                <HorizontalSeparator orientation="horizontal" />
              )}
            </div>
          )
        )}
      </TooltipContent>
    </>
  );
}

function FeeSplitBadge({
  feeSplit,
  className,
  timeStamp = new Date().toISOString(),
}: React.ComponentProps<"span"> & {
  feeSplit: ShippingRoute["feeSplit"];
  timeStamp?: string;
}) {
  const { settings } = useSettings();
  return (
    <BadgeWrapper
      className={className}
      flag={CURRENCIES[feeSplit.firstWeightCost.paidCurrency].flag}
      fallback={
        <>
          <Skeleton className="h-4 w-[5.4rem]" /> {/* First weight cost */}
          <Separator />
          <Skeleton className="h-4 w-[5.3rem]" /> {/* Continued weight cost */}
          <Separator />
          <Skeleton className="h-4 w-15" /> {/* Misc fee */}
        </>
      }
    >
      <AwaitBadge
        feeSplit={feeSplit}
        userCurrency={settings.currency}
        getRate={getConversionRate(
          feeSplit.firstWeightCost.paidCurrency,
          settings.currency,
          timeStamp
        )}
      />
    </BadgeWrapper>
  );
}

export default FeeSplitBadge;
