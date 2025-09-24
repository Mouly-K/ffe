"use client";

import { type Table } from "@tanstack/react-table";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, PackagePlus, Plus, X } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SearchSelector } from "@/components/search-selector";
import SearchInput from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import Flag from "@/components/flag";

import {
  EVALUATION_TYPE,
  ShippingRouteSchema,
  WAREHOUSES,
  type Shipper,
  type ShippingRoute,
  type Warehouse,
} from "@/types/shipping";
import { generateShippingRoute } from "@/utils";

import { DataTableViewOptions } from "../data-table-view-options";
import { DataTableFacetedFilter } from "../data-table-faceted-filter";
import { evaluationTypes, warehouses } from "../data/data";

import { COUNTRIES } from "@/types/country";
import warehousesData from "@/data/warehouses.json";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  metaData: Omit<Shipper, "shippingRoutes">;
}

export function DataTableToolbar<TData>({
  table,
  metaData,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const form = useForm<ShippingRoute>({
    resolver: zodResolver(ShippingRouteSchema),
    defaultValues: generateShippingRoute(
      metaData.id,
      metaData.defaultCurrency,
      metaData.basedIn || (warehousesData[0] as Warehouse)
    ),
  });

  const onSubmit: SubmitHandler<ShippingRoute> = (value) => {
    console.log(value);
  };

  function WarehouseSelector({
    name,
    label,
    warehouse,
    onSelect,
  }: {
    name: string;
    label: string;
    warehouse: Warehouse;
    onSelect: (warehouse: Warehouse) => void;
  }) {
    return (
      <SearchSelector
        items={WAREHOUSES}
        selectedKey={warehouse.id}
        renderItem={(_, item) => (
          <>
            <Flag flag={COUNTRIES[item.countryName].flag} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{item.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {item.countryName}
              </span>
            </div>
          </>
        )}
        onSelect={(warehouseId) =>
          onSelect({
            id: warehouseId,
            ...WAREHOUSES[warehouseId],
          })
        }
      >
        <Button
          name={name}
          variant="outline"
          size="sm"
          className="h-8 border text-muted-foreground"
        >
          {label}
          <Separator orientation="vertical" className="mx-2 h-8" />
          <Flag
            flag={COUNTRIES[warehouse.countryName].flag}
            className="w-auto text-sm"
          />
          {warehouse.name === warehouse.countryName
            ? warehouse.name
            : `${warehouse.name}, ${warehouse.countryName}`}
        </Button>
      </SearchSelector>
    );
  }

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
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" size="sm" className="h-8 lg:flex ml-2">
            <Plus />
            Add Route
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-fit sm:max-w-fit">
          <DialogHeader>
            <DialogTitle>Add Route</DialogTitle>
            <DialogDescription>
              You can fill out this form to add a shipping route. Click add when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 grid gap-4"
            >
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1 grid gap-3">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Shipping route name..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem className="grid gap-3">
                    <FormLabel>Evaluation Type</FormLabel>
                    <FormField
                      control={form.control}
                      name="evaluationType"
                      render={({ field }) => (
                        <>
                          <FormControl>
                            <Badge
                              className="dark:bg-input/30 border-input h-9 rounded-md border bg-transparent px-0 py-0 text-base shadow-xs md:text-sm"
                              variant="outline"
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-[120px] justify-between"
                                  >
                                    {field.value}
                                    <ChevronsUpDown className="opacity-50" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  className="w-44"
                                  align="start"
                                >
                                  <DropdownMenuRadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <DropdownMenuRadioItem
                                      value={EVALUATION_TYPE.ACTUAL}
                                    >
                                      {EVALUATION_TYPE.ACTUAL}
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem
                                      value={EVALUATION_TYPE.VOLUMETRIC}
                                    >
                                      {EVALUATION_TYPE.VOLUMETRIC}
                                    </DropdownMenuRadioItem>
                                  </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              {field.value === EVALUATION_TYPE.VOLUMETRIC && (
                                <>
                                  <Separator orientation="vertical" />
                                  <FormField
                                    control={form.control}
                                    name="volumetricDivisor"
                                    render={({ field }) => (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Input
                                            value={field.value || ""}
                                            onChange={(e) =>
                                              field.onChange(+e.target.value)
                                            }
                                            type="number"
                                            placeholder="Divisor..."
                                            className="font-mono tabular-nums w-26 dark:bg-transparent border-none focus-visible:border-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent className="flex flex-col items-center gap-1">
                                          <p>
                                            Volumetric Divisor: Used for
                                            calculating the volumetric weight as
                                            follows
                                          </p>
                                          <Badge
                                            variant="outline"
                                            className="text-xs font-mono"
                                          >
                                            (L*B*H)/Divisor
                                          </Badge>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  />
                                </>
                              )}
                            </Badge>
                          </FormControl>
                          <FormMessage />
                        </>
                      )}
                    />
                  </FormItem>
                </div>
                <FormItem className="grid gap-3">
                  <FormLabel>Route</FormLabel>
                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="originWarehouse"
                      render={({ field }) => (
                        <>
                          <FormControl>
                            <WarehouseSelector
                              name={field.name}
                              label="Origin Warehouse"
                              warehouse={field.value}
                              onSelect={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destinationWarehouse"
                      render={({ field }) => (
                        <>
                          <FormControl>
                            <WarehouseSelector
                              name={field.name}
                              label="Destination Warehouse"
                              warehouse={field.value}
                              onSelect={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </>
                      )}
                    />
                  </div>
                </FormItem>
                <FormField
                  control={form.control}
                  name="feeSplit"
                  render={({ field }) => (
                    <FormItem className="flex-1 grid gap-3">
                      <FormLabel>Fee Split</FormLabel>
                      <FormControl>
                        <Badge
                          variant="outline"
                          className="h-4 flex justify-between items-center rounded-full px-2 py-3 font-mono tabular-nums text-muted-foreground"
                        >
                          <p className="min-w-[5.4rem] text-center">
                            {field.value.firstWeightKg +
                              "kg " +
                              field.value.firstWeightCost.paidCurrency +
                              " " +
                              field.value.firstWeightCost.paidAmount}
                          </p>
                          <div className="bg-border w-0.5 mx-1 h-4"></div>
                          <span className="min-w-[5.8rem] flex gap-1">
                            <PackagePlus
                              size="14"
                              className="h-3.5 w-3.5 ml-1"
                            />
                            <p>kg</p>
                            <p className="flex flex-1 justify-center">
                              {field.value.firstWeightCost.paidCurrency +
                                " " +
                                field.value.continuedWeightCost.paidAmount}
                            </p>
                          </span>
                          <div className="bg-border w-0.5 mx-1 h-4"></div>
                          <p className="min-w-15 text-center">
                            {field.value.firstWeightCost.paidCurrency +
                              " " +
                              field.value.miscFee.paidAmount}
                          </p>
                        </Badge>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
