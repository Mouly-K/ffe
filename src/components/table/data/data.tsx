import { EVALUATION_TYPE } from "@/interfaces/shipping";
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

export const evaluationTypes = [
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

export const statuses = [
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

export const priorities = [
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
