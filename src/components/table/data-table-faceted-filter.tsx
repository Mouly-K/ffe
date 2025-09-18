import { type Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import Flag from "@/components/flag";

import { cn } from "@/lib/utils";
import { isEqualSansId } from "@/utils";

import type { FilterOption } from "./data/data";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: FilterOption[];
  // Optional comparison function for checking if a value is selected
  isValueSelected?: (selectedValue: any, optionValue: any) => boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isValueSelected: customIsValueSelected,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const filterValue = column?.getFilterValue() as any[];
  const selectedValues = filterValue || [];

  // Helper function to check if a value is selected
  const isValueSelected = (optionValue: any) => {
    if (customIsValueSelected) {
      return selectedValues.some((sv) =>
        customIsValueSelected(sv, optionValue)
      );
    }
    if (typeof optionValue === "object" && optionValue !== null) {
      return selectedValues.some((sv) => isEqualSansId(sv, optionValue));
    }
    return selectedValues.includes(optionValue);
  };

  const getKey = (optionValue: any) => {
    return typeof optionValue === "object" && optionValue !== null
      ? optionValue.id
      : optionValue;
  };

  const renderItem = (option: FilterOption): React.ReactNode => {
    if (typeof option.value === "string") return <span>{option.label}</span>;
    const { id, ...item } = option.value;
    return (
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{option.label}</span>
        {Object.keys(item).map(
          (k) =>
            item[k] !== option.label && (
              <span key={k} className="text-muted-foreground truncate text-xs">
                {item[k]}
              </span>
            )
        )}
      </div>
    );
  };

  const getCount = (option: FilterOption): number | undefined => {
    if (!facets) return;
    if (typeof option.value === "string") return facets.get(option.value);

    for (let facet of Array.from(facets)) {
      if (isEqualSansId(facet[0], option.value)) return facet[1];
    }
  };

  const renderCount = (option: FilterOption): React.ReactNode => {
    const count = getCount(option);
    return (
      count && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
          {count}
        </span>
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => isValueSelected(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={getKey(option.value)}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((o) => getCount(o))
                .map((option) => {
                  const selected = isValueSelected(option.value);
                  return (
                    <CommandItem
                      key={getKey(option.value)}
                      onSelect={() => {
                        const newSelectedValues = selected
                          ? selectedValues.filter(
                              (v) =>
                                !customIsValueSelected?.(v, option.value) &&
                                v !== option.value
                            )
                          : [...selectedValues, option.value];
                        column?.setFilterValue(
                          newSelectedValues.length
                            ? newSelectedValues
                            : undefined
                        );
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      {option.flag && <Flag flag={option.flag} />}
                      {renderItem(option)}
                      {renderCount(option)}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
