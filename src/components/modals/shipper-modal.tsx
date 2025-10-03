import { type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";

import Flag from "@/components/flag";
import { SearchSelector } from "@/components/search-selector";

import { CURRENCIES } from "@/types/currency";
import { WAREHOUSES } from "@/types/shipping";
import type { Shipper } from "@/types/shipping";
import { Separator } from "../ui/separator";
import { COUNTRIES } from "@/types/country";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../ui/dropzone";
import { useState } from "react";

export default function ShipperModal({
  form,
  open,
  editMode,
  setOpen,
  onSubmit,
}: {
  form: UseFormReturn<Shipper>;
  open: boolean;
  editMode: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (row: Shipper) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-fit sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Shipper" : "Add Shipper"}</DialogTitle>
          <DialogDescription>
            {editMode ? (
              <>
                Update the shipper details below and click Save to persist
                changes.
              </>
            ) : (
              <>
                Create a new shipper by filling out the form below, then click
                Add.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 grid gap-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col h-fit gap-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Shipper name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Currency</FormLabel>
                    <FormControl>
                      <SearchSelector
                        items={CURRENCIES}
                        selectedKey={field.value}
                        renderItem={(key, item) => (
                          <>
                            <Flag flag={item.flag} />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-medium">
                                {key}
                              </span>
                              <span className="text-muted-foreground truncate text-xs">
                                {item.currencyName}
                              </span>
                            </div>
                          </>
                        )}
                        onSelect={(defaultCurrency) =>
                          field.onChange(defaultCurrency)
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 border text-muted-foreground"
                        >
                          Default Currency
                          <Separator
                            orientation="vertical"
                            className="mx-2 h-9"
                          />
                          <Flag
                            flag={CURRENCIES[field.value].flag}
                            className="w-auto text-sm"
                          />
                          <p>{CURRENCIES[field.value].currencyName}</p>
                        </Button>
                      </SearchSelector>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Based In</FormLabel>
                    <FormControl>
                      <SearchSelector
                        items={WAREHOUSES}
                        selectedKey={field.value.id}
                        renderItem={(_, item) => (
                          <>
                            <Flag flag={COUNTRIES[item.countryName].flag} />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-medium">
                                {item.name}
                              </span>
                              <span className="text-muted-foreground truncate text-xs">
                                {item.countryName}
                              </span>
                            </div>
                          </>
                        )}
                        onSelect={(warehouseId) =>
                          field.onChange({
                            id: warehouseId,
                            ...WAREHOUSES[warehouseId],
                          })
                        }
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
                            flag={COUNTRIES[field.value.countryName].flag}
                            className="w-auto text-sm"
                          />
                          {field.value.name === field.value.countryName
                            ? field.value.name
                            : `${field.value.name}, ${field.value.countryName}`}
                        </Button>
                      </SearchSelector>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                // placeholders for now
                const [files, setFiles] = useState<File[] | undefined>();
                const [filePreview, setFilePreview] = useState<
                  string | undefined
                >();
                const handleDrop = (files: File[]) => {
                  console.log(files);
                  setFiles(files);
                  if (files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      if (typeof e.target?.result === "string") {
                        setFilePreview(e.target?.result);
                      }
                    };
                    reader.readAsDataURL(files[0]);
                  }
                };

                return (
                  <FormItem>
                    <FormLabel>Shipper Image</FormLabel>
                    <FormControl>
                      <Dropzone
                        accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                        onDrop={handleDrop}
                        onError={console.error}
                        src={files}
                      >
                        <DropzoneEmptyState />
                        <DropzoneContent>
                          {filePreview && (
                            <div className="h-40 w-40">
                              <img
                                alt="Preview"
                                className="h-full w-full object-cover"
                                src={filePreview}
                              />
                            </div>
                          )}
                        </DropzoneContent>
                      </Dropzone>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {editMode ? "Save Changes" : "Add Shipper"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
