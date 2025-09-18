import type { Warehouse } from "@/interfaces/shipping";
import { Badge } from "./ui/badge";
import Flag from "./flag";
import { COUNTRIES } from "@/interfaces/country";

export default function WarehouseBadge({
  warehouse,
}: {
  warehouse: Warehouse;
}) {
  return (
    <Badge
      className="h-4 flex justify-between items-center rounded-full px-2 py-3 font-mono tabular-nums text-muted-foreground"
      variant="outline"
    >
      <Flag
        flag={COUNTRIES[warehouse.countryName].flag}
        className="h-4 text-sm"
      />
      <span>
        {warehouse.name === warehouse.countryName
          ? warehouse.name
          : `${warehouse.name}, ${warehouse.countryName}`}
      </span>
    </Badge>
  );
}
