import { EVALUATION_TYPE, type Warehouse } from "@/types/shipping";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Package,
  Timer,
  Weight,
} from "lucide-react";

import warehousesData from "@/data/warehouses.json";
import { COUNTRIES, type CountryFlag } from "@/types/country";

export type FilterOption = {
  label: string;
  value: string | Record<string, string>;
  icon?: React.ComponentType<{ className?: string }>;
  flag?: CountryFlag;
};

export const evaluationTypes: FilterOption[] = [
  {
    value: EVALUATION_TYPE.VOLUMETRIC,
    label: EVALUATION_TYPE.VOLUMETRIC,
    icon: Package,
  },
  {
    value: EVALUATION_TYPE.ACTUAL,
    label: EVALUATION_TYPE.ACTUAL,
    icon: Weight,
  },
];

export const warehouses: FilterOption[] = (warehousesData as Warehouse[]).map(
  (warehouse) => ({
    label: warehouse.name,
    value: warehouse,
    flag: COUNTRIES[warehouse.countryName].flag,
  })
);

export const statuses: FilterOption[] = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleOff,
  },
];

export const priorities: FilterOption[] = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
