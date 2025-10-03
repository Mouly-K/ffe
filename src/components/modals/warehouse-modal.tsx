import { type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { SearchSelector } from "@/components/search-selector";
import Flag from "@/components/flag";

import { COUNTRIES } from "@/types/country";
import type { Warehouse } from "@/types/shipping";

export default function WarehouseModal({
  form,
  open,
  editMode = false,
  setOpen,
  onSubmit,
}: {
  form: UseFormReturn<Warehouse>;
  open: boolean;
  editMode: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (row: Warehouse) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-fit sm:max-w-fit min-w-160">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Warehouse" : "Add Warehouse"}
          </DialogTitle>
          <DialogDescription>
            {editMode ? (
              <>
                Modify the warehouse details below and click Save to persist
                changes.
              </>
            ) : (
              <>
                Fill out the details to create a new warehouse. Click Add when
                finished.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Warehouse name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <SearchSelector
                        items={COUNTRIES}
                        selectedKey={field.value}
                        renderItem={(country, item) => (
                          <>
                            <Flag flag={item.flag} />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-medium">
                                {country}
                              </span>
                              <span className="text-muted-foreground truncate text-xs">
                                {item.currencyName}
                              </span>
                            </div>
                          </>
                        )}
                        onSelect={(country) => field.onChange(country)}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 border text-muted-foreground"
                        >
                          Based In
                          <Separator
                            orientation="vertical"
                            className="mx-2 h-9"
                          />
                          <Flag
                            flag={COUNTRIES[field.value].flag}
                            className="w-auto text-sm"
                          />
                          {field.value}
                        </Button>
                      </SearchSelector>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {editMode ? "Save Changes" : "Add Warehouse"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
