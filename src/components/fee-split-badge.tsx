import { use } from "react";
import { PackagePlus } from "lucide-react";
import { useSettings } from "@/components/settings-provider";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator, BadgeWrapper } from "@/components/price-badge";

import { CURRENCIES, type Currency } from "@/interfaces/currency";
import type { ShippingRoute } from "@/interfaces/shipping";

import { getConversionRate, toFixedWithoutTrailingZeros } from "@/utils";

function AwaitBadge({
  feeSplit,
  currency,
  getRate,
}: {
  feeSplit: ShippingRoute["feeSplit"];
  currency: Currency;
  getRate: Promise<{ status: string; conversion_rate?: number }>;
}) {
  const rate = use(getRate);
  const currencySymbol = rate.conversion_rate
    ? CURRENCIES[currency].currencySymbol
    : feeSplit.firstWeightCost.paidCurrency;

  const firstWeightCost = toFixedWithoutTrailingZeros(
    rate.conversion_rate!
      ? feeSplit.firstWeightCost.paidAmount * rate.conversion_rate!
      : feeSplit.firstWeightCost.paidAmount,
    2
  );

  const continuedWeightCost = toFixedWithoutTrailingZeros(
    rate.conversion_rate!
      ? feeSplit.continuedWeightCost.paidAmount * rate.conversion_rate!
      : feeSplit.continuedWeightCost.paidAmount,
    2
  );

  const miscFee = toFixedWithoutTrailingZeros(
    rate.conversion_rate!
      ? feeSplit.miscFee.paidAmount * rate.conversion_rate!
      : feeSplit.miscFee.paidAmount,
    2
  );

  return (
    <>
      <p className="min-w-[5.4rem] text-center">
        {feeSplit.firstWeightKg +
          "kg " +
          currencySymbol +
          " " +
          firstWeightCost}
      </p>
      <Separator />
      <span className="min-w-[5.8rem] flex gap-1">
        <PackagePlus size="14" className="h-3.5 w-3.5" />
        <p>kg</p>
        <p className="flex flex-1 justify-center">
          {currencySymbol + " " + continuedWeightCost}
        </p>
      </span>
      <Separator />
      <p className="min-w-15 text-center">{currencySymbol + " " + miscFee}</p>
    </>
  );
}

function FeeSplitBadge({
  feeSplit,
  className,
}: React.ComponentProps<"span"> & {
  feeSplit: ShippingRoute["feeSplit"];
}) {
  const { settings } = useSettings();
  return (
    <Tooltip>
      <TooltipTrigger>
        <BadgeWrapper
          className={className}
          flag={CURRENCIES[feeSplit.firstWeightCost.paidCurrency].flag}
          fallback={
            <>
              <Skeleton className="h-4 w-[5.4rem]" /> {/* First weight cost */}
              <Separator />
              <Skeleton className="h-4 w-[5.3rem]" />{" "}
              {/* Continued weight cost */}
              <Separator />
              <Skeleton className="h-4 w-15" /> {/* Misc fee */}
            </>
          }
        >
          <AwaitBadge
            feeSplit={feeSplit}
            currency={settings.currency}
            getRate={getConversionRate(
              feeSplit.firstWeightCost.paidCurrency,
              settings.currency
            )}
          />
        </BadgeWrapper>
      </TooltipTrigger>
      <TooltipContent>Hover</TooltipContent>
    </Tooltip>
  );
}

export default FeeSplitBadge;
