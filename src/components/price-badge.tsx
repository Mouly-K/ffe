import { Suspense, use } from "react";
import { useSettings } from "./settings-provider";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Flag from "@/components/flag";

import type { CountryFlag } from "@/types/country";
import { CURRENCIES, type Currency } from "@/types/currency";
import type { ShippingRoute } from "@/types/shipping";

import { cn } from "@/lib/utils";
import { getConversionRate, toFixedWithoutTrailingZeros } from "@/utils";

export function Separator() {
  return <div className="bg-border w-0.5 mx-1 h-4"></div>;
}

export function BadgeWrapper({
  flag,
  className,
  fallback,
  children,
}: React.ComponentProps<"span"> & {
  flag: CountryFlag;
  fallback: React.ReactNode;
}) {
  return (
    <Badge
      className={cn(
        "h-4 flex justify-between items-center rounded-full px-2 py-3 font-mono tabular-nums text-muted-foreground",
        className
      )}
      variant="outline"
    >
      <Flag flag={flag} className="h-4 text-sm" />
      <Separator />
      <Suspense fallback={fallback}>
        <Tooltip>{children}</Tooltip>
      </Suspense>
    </Badge>
  );
}

function AwaitBadge({
  price,
  userCurrency,
  getRate,
}: React.ComponentProps<"span"> & {
  price: ShippingRoute["price"];
  userCurrency: Currency;
  getRate: Promise<{ status: string; conversion_rate?: number }>;
}) {
  if (!price) return;
  const rate = use(getRate);
  const currencySymbol = rate.conversion_rate
    ? CURRENCIES[userCurrency].currencySymbol
    : CURRENCIES[price.paidCurrency].currencySymbol;

  const amount = toFixedWithoutTrailingZeros(
    rate.conversion_rate!
      ? price.paidAmount * rate.conversion_rate!
      : price.paidAmount,
    2
  );

  return (
    <>
      <TooltipTrigger>
        <p className="min-w-15 text-center">{currencySymbol + " " + amount}</p>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-3 min-w-60 px-0 py-2">
        {rate && (
          <div className="flex flex-1 px-1.5 items-center">
            <span className="text-xs px-1">
              Converted Price - {userCurrency}
            </span>
            <span className="ml-auto mr-1 flex h-4 min-w-4 items-center justify-center font-mono text-xs text-muted-foreground">
              {currencySymbol} {amount}
            </span>
          </div>
        )}
        <div className="flex flex-1 px-1.5 items-center">
          <span className="text-xs px-1">
            Actual Price - {price.paidCurrency}
          </span>
          <span className="ml-auto mr-1 flex h-4 min-w-4 items-center justify-center font-mono text-xs text-muted-foreground">
            {CURRENCIES[price.paidCurrency].currencySymbol} {price.paidAmount}
          </span>
        </div>
      </TooltipContent>
    </>
  );
}

function PriceBadge({
  price,
  className,
  timeStamp = new Date().toUTCString(),
}: React.ComponentProps<"span"> & {
  price: ShippingRoute["price"];
  timeStamp?: string;
}) {
  if (!price) return;
  const { settings } = useSettings();

  return (
    <BadgeWrapper
      className={className}
      flag={CURRENCIES[price.paidCurrency].flag}
      fallback={<Skeleton className="h-4 w-15" />}
    >
      <AwaitBadge
        className={className}
        price={price}
        userCurrency={settings.currency}
        getRate={getConversionRate(
          price.paidCurrency,
          settings.currency,
          timeStamp
        )}
      />
    </BadgeWrapper>
  );
}

export default PriceBadge;
