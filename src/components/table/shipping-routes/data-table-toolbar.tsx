"use client";

import { type ReactNode } from "react";
import { type Table } from "@tanstack/react-table";
import {
  useForm,
  type ControllerRenderProps,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronsUpDown,
  CircleDollarSign,
  DollarSign,
  PackagePlus,
  Plus,
  Split,
  X,
} from "lucide-react";

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

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SearchSelector } from "@/components/search-selector";
import SearchInput from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Flag from "@/components/flag";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { evaluationTypes, warehouses } from "@/components/table/data/data";

import {
  EVALUATION_TYPE,
  ShippingRouteSchema,
  WAREHOUSES,
  type Shipper,
  type ShippingRoute,
  type Warehouse,
} from "@/types/shipping";
import { COUNTRIES } from "@/types/country";
import { CURRENCIES, type Currency } from "@/types/currency";

import warehousesData from "@/data/warehouses.json";

import { generateShippingRoute } from "@/utils";

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
          className="h-9 px-3 border text-muted-foreground"
        >
          {label}
          <Separator orientation="vertical" className="mx-2 h-9" />
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

  function CurrencySelector({
    name,
    currency,
    onSelect,
  }: {
    name: string;
    currency: Currency;
    onSelect: (currency: Currency) => void;
  }) {
    return (
      <SearchSelector
        items={CURRENCIES}
        selectedKey={currency}
        renderItem={(key, item) => (
          <>
            <Flag flag={item.flag} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{key}</span>
              <span className="text-muted-foreground truncate text-xs">
                {item.currencyName}
              </span>
            </div>
          </>
        )}
        onSelect={onSelect}
      >
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                name={name}
                variant="ghost"
                size="sm"
                className="flex items-center gap-3"
              >
                <Flag
                  flag={CURRENCIES[currency].flag}
                  className="w-auto text-sm"
                />
                {currency}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{CURRENCIES[currency].currencyName}</TooltipContent>
          </Tooltip>
        </div>
      </SearchSelector>
    );
  }

  function AmountInput({
    field,
    currency,
    tooltip,
    renderIcon,
  }: {
    field: ControllerRenderProps<
      ShippingRoute,
      | "feeSplit.firstWeightAmount"
      | "feeSplit.continuedWeightAmount"
      | "feeSplit.miscAmount"
    >;
    currency: Currency;
    tooltip: string;
    renderIcon?: () => ReactNode;
  }) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <FormItem className="flex items-center">
            {renderIcon && renderIcon()}
            <p>{CURRENCIES[currency].currencySymbol}</p>
            <FormControl>
              <Input
                type="number"
                name={field.name}
                placeholder="Amount..."
                className="font-mono tabular-nums w-21 min-w-21 dark:bg-transparent border-none focus-visible:border-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-xs"
                value={field.value || ""}
                onChange={(e) => {
                  e.target.style.width = e.target.value.length + 3 + "ch";
                  field.onChange(+e.target.value);
                }}
              />
            </FormControl>
          </FormItem>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col items-center gap-1">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Helper to get the first error message from feeSplit
  function getFeeSplitError(errors: any) {
    console.log(errors?.feeSplit);
    if (!errors?.feeSplit) return null;
    const feeSplitFields = [
      "firstWeightKg",
      "firstWeightAmount",
      "continuedWeightAmount",
      "miscAmount",
    ];
    for (const field of feeSplitFields) {
      const error = errors.feeSplit[field];
      if (error) {
        // If it's a nested object (e.g., LocalPrice), get its first error
        if (typeof error === "object" && error !== null) {
          const nestedKey = Object.keys(error)[0];
          return error[nestedKey]?.message || error.message;
        }
        return error.message;
      }
    }
    return null;
  }

  const feeSplitError = getFeeSplitError(form.formState.errors);

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
                      <FormItem className="flex-1 flex flex-col h-fit gap-3">
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
                  <div className="flex flex-col h-fit gap-3">
                    <FormField
                      control={form.control}
                      name="volumetricDivisor"
                      render={({ field: dField }) => (
                        <FormItem className="gap-3">
                          <FormLabel>Evaluation Type</FormLabel>
                          <FormField
                            control={form.control}
                            name="evaluationType"
                            render={({ field, formState }) => (
                              <FormItem
                                className="inline-flex items-center justify-center font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground dark:bg-input/30 border-input h-9 rounded-md border bg-transparent px-0 py-0 text-base shadow-xs md:text-sm"
                                aria-invalid={
                                  !!formState.errors.volumetricDivisor?.message
                                }
                              >
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="ghost"
                                        className="w-[120px] justify-between"
                                      >
                                        {field.value}
                                        <ChevronsUpDown className="opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className="w-44"
                                    align="start"
                                  >
                                    <DropdownMenuRadioGroup
                                      value={field.value}
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        dField.onChange(dField.value);
                                      }}
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
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <FormControl>
                                          <Input
                                            value={dField.value || ""}
                                            onChange={(e) =>
                                              dField.onChange(+e.target.value)
                                            }
                                            type="number"
                                            placeholder="Divisor..."
                                            className="font-mono tabular-nums w-26 dark:bg-transparent border-none focus-visible:border-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                        </FormControl>
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
                                  </>
                                )}
                              </FormItem>
                            )}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col h-fit gap-3">
                  <p className="flex items-center gap-2 text-sm leading-none font-medium select-none">
                    Route
                  </p>
                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="originWarehouse"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <WarehouseSelector
                              name={field.name}
                              label="Origin Warehouse"
                              warehouse={field.value}
                              onSelect={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="destinationWarehouse"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <WarehouseSelector
                              name={field.name}
                              label="Destination Warehouse"
                              warehouse={field.value}
                              onSelect={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="flex gap-4">
                    <Label>Fee Split</Label>
                    <ToggleGroup
                      type="single"
                      value={"bold"}
                      onValueChange={() => {}}
                    >
                      <ToggleGroupItem
                        value="bold"
                        aria-label="Toggle bold"
                        className="h-6"
                      >
                        <Split className="size-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="italic"
                        aria-label="Toggle italic"
                        className="h-6"
                      >
                        <DollarSign className="size-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <Badge
                    variant="outline"
                    className="dark:bg-input/30 border-input h-9 rounded-md border bg-transparent px-0 py-0 text-base shadow-xs md:text-sm flex w-full justify-between items-center font-mono tabular-nums text-muted-foreground"
                  >
                    <FormField
                      control={form.control}
                      name="feeSplit.paidCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CurrencySelector
                              name={field.name}
                              currency={field.value}
                              onSelect={(currency) => {
                                field.onChange(currency);
                                form.trigger("feeSplit.paidCurrency");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator orientation="vertical" />
                    <FormField
                      control={form.control}
                      name="feeSplit.firstWeightKg"
                      render={({ field }) => (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <Input
                                  type="number"
                                  name={field.name}
                                  placeholder="1st..."
                                  className="font-mono tabular-nums w-16 min-w-16 dark:bg-transparent border-none focus-visible:border-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-xs"
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    e.target.style.width =
                                      e.target.value.length + 3 + "ch";
                                    field.onChange(+e.target.value);
                                  }}
                                />
                              </FormControl>
                              <p className="text-xs mr-3">kg</p>
                            </FormItem>
                          </TooltipTrigger>
                          <TooltipContent className="flex flex-col items-center gap-1">
                            The first chargeable weight of the route in kgs
                          </TooltipContent>
                        </Tooltip>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="feeSplit.firstWeightAmount"
                      render={({ field }) => (
                        <AmountInput
                          field={field}
                          currency={form.getValues("feeSplit.paidCurrency")}
                          tooltip="Amount to be paid for the first chargeable weight"
                        />
                      )}
                    />
                    <Separator orientation="vertical" />
                    <FormField
                      control={form.control}
                      name="feeSplit.continuedWeightAmount"
                      render={({ field }) => (
                        <AmountInput
                          field={field}
                          currency={form.getValues("feeSplit.paidCurrency")}
                          tooltip="Amount to be paid for each additional kg"
                          renderIcon={() => (
                            <>
                              <PackagePlus
                                size="14"
                                className="h-3.5 w-3.5 m-1"
                              />
                              <p className="text-xs mr-3">kg</p>
                            </>
                          )}
                        />
                      )}
                    />
                    <Separator orientation="vertical" />
                    <FormField
                      control={form.control}
                      name="feeSplit.miscAmount"
                      render={({ field }) => (
                        <AmountInput
                          field={field}
                          currency={form.getValues("feeSplit.paidCurrency")}
                          tooltip="Any miscellaneous fees"
                          renderIcon={() => (
                            <CircleDollarSign
                              size="14"
                              className="h-3.5 w-3.5 m-1"
                            />
                          )}
                        />
                      )}
                    />
                  </Badge>
                  {feeSplitError && (
                    <p className="text-destructive text-sm">{feeSplitError}</p>
                  )}
                </div>
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
