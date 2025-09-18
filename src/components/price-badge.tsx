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

import type { CountryFlag } from "@/interfaces/country";
import { CURRENCIES, type Currency } from "@/interfaces/currency";
import type { ShippingRoute } from "@/interfaces/shipping";

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
      <Suspense fallback={fallback}>{children}</Suspense>
    </Badge>
  );
}

function AwaitBadge({
  price,
  currency,
  getRate,
}: {
  price: ShippingRoute["price"];
  currency: Currency;
  getRate: Promise<{ status: string; conversion_rate?: number }>;
}) {
  const rate = use(getRate);
  const currencySymbol = rate.conversion_rate
    ? CURRENCIES[currency].currencySymbol
    : price!.paidCurrency;

  const amount = toFixedWithoutTrailingZeros(
    rate.conversion_rate!
      ? price!.paidAmount * rate.conversion_rate!
      : price!.paidAmount,
    2
  );

  return (
    <p className="min-w-15 text-center">{currencySymbol + " " + amount}</p>
  );
}

function PriceBadge({
  price,
  className,
}: React.ComponentProps<"span"> & {
  price: ShippingRoute["price"];
}) {
  if (!price) return;
  const { settings } = useSettings();

  return (
    <Tooltip>
      <TooltipTrigger>
        <BadgeWrapper
          className={className}
          flag={CURRENCIES[price.paidCurrency].flag}
          fallback={<Skeleton className="h-4 w-15" />}
        >
          <AwaitBadge
            price={price}
            currency={settings.currency}
            getRate={getConversionRate(price.paidCurrency, settings.currency)}
          />
        </BadgeWrapper>
      </TooltipTrigger>
      <TooltipContent>Hover</TooltipContent>
    </Tooltip>
  );
}

export default PriceBadge;
