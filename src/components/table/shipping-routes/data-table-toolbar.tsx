"use client";

import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";

import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import DataTableAddRoute from "@/components/table/shipping-routes/data-table-add-route";

import { evaluationTypes, warehouses } from "@/components/table/data/data";
import type { Shipper, ShippingRoute } from "@/types/shipping";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onRowAdd: (row: ShippingRoute) => void;
  metaData: Omit<Shipper, "shippingRoutes">;
}

export function DataTableToolbar<TData>({
  table,
  onRowAdd,
  metaData,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <SearchInput
          placeholder="Filter items..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(value) => table.getColumn("name")?.setFilterValue(value)}
          debounce={250}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("evaluationType") && (
          <DataTableFacetedFilter
            column={table.getColumn("evaluationType")}
            title="Evaluation Type"
            options={evaluationTypes}
          />
        )}
        {table.getColumn("route") && (
          <DataTableFacetedFilter
            column={table.getColumn("route")}
            title="Warehouse"
            options={warehouses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      <DataTableAddRoute metaData={metaData} onAdd={onRowAdd} />
    </div>
  );
}
