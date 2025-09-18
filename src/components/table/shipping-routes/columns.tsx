"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import FeeSplitBadge from "@/components/fee-split-badge";
import PriceBadge from "@/components/price-badge";
import WarehouseBadge from "@/components/warehouse-badge";

import {
  EVALUATION_TYPE,
  type EvaluationType,
  type ShippingRoute,
} from "@/interfaces/shipping";

import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";

import { evaluationTypes } from "../data/data";

export const columns: ColumnDef<ShippingRoute>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] mr-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] mr-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    id: "route",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Route" />
    ),
    cell: ({ row }) => {
      const origin = row.original.originWarehouse,
        destination = row.original.destinationWarehouse;

      if (!origin || !destination) {
        return null;
      }

      return (
        <button>
          <div className="flex items-center gap-2 w-100">
            <WarehouseBadge warehouse={origin} />
            <div className="outline flex-1 outline-dashed"></div>
            <WarehouseBadge warehouse={destination} />
          </div>
        </button>
      );
    },
    filterFn: (row, _, value) =>
      value.includes(row.original.originWarehouse.countryName) ||
      value.includes(row.original.originWarehouse.name) ||
      value.includes(row.original.destinationWarehouse.countryName) ||
      value.includes(row.original.destinationWarehouse.name),
    enableSorting: false,
  },
  {
    accessorKey: "evaluationType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Evaluation Type" />
    ),
    cell: ({ row }) => {
      const evaluationType = evaluationTypes.find(
        (evaluationType) =>
          evaluationType.value === row.getValue("evaluationType")
      );

      if (!evaluationType) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {evaluationType.icon && (
            <evaluationType.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{evaluationType.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    sortingFn: (rowA, rowB, columnId) => {
      const A = rowA.getValue(columnId) as EvaluationType;
      const B = rowB.getValue(columnId) as EvaluationType;
      return A === B ? 0 : A === EVALUATION_TYPE.VOLUMETRIC ? 0 : 1;
    },
  },
  {
    accessorKey: "volumetricDivisor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Volumetric Divisor" />
    ),
    cell: ({ row }) => {
      const volumetricDivisor = row.getValue("volumetricDivisor") as number;

      if (!volumetricDivisor) {
        return null;
      }

      return (
        <Badge
          className="h-6 w-12 rounded-full px-1.5 py-2.5 font-mono tabular-nums"
          variant="outline"
        >
          {volumetricDivisor}
        </Badge>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const A = rowA.getValue(columnId) as number;
      const B = rowB.getValue(columnId) as number;
      return A - B;
    },
  },
  {
    accessorKey: "feeSplit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee Split" />
    ),
    cell: ({ row }) => {
      const feeSplit = row.getValue("feeSplit") as ShippingRoute["feeSplit"];

      if (!feeSplit) {
        return null;
      }

      return <FeeSplitBadge feeSplit={feeSplit} />;
    },
    sortingFn: (rowA, rowB, id) => {
      const A = rowA.getValue(id) as ShippingRoute["feeSplit"];
      const B = rowB.getValue(id) as ShippingRoute["feeSplit"];

      const a =
          A.firstWeightKg * A.firstWeightCost.paidAmount +
          A.continuedWeightCost.paidAmount +
          A.miscFee.paidAmount,
        b =
          B.firstWeightKg * B.firstWeightCost.paidAmount +
          B.continuedWeightCost.paidAmount +
          B.miscFee.paidAmount;

      return a - b;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as ShippingRoute["price"];

      if (!price) {
        return null;
      }

      return <PriceBadge price={price} />;
    },
    sortingFn: (rowA, rowB, id) => {
      const A = rowA.getValue(id) as ShippingRoute["price"];
      const B = rowB.getValue(id) as ShippingRoute["price"];
      return !(A && B) ? 0 : A?.paidAmount - B?.paidAmount;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
