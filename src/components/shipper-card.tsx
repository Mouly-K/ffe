import { startTransition, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useSettings } from "@/components/settings-provider";

import { EditImage } from "@/components/edit-image";
import Flag from "@/components/flag";

import { columns } from "@/components/table/shipping-routes/columns";
import { DataTable } from "@/components/table/data-table";
import { SearchSelector } from "@/components/search-selector";

import { DataTableToolbar } from "./table/shipping-routes/data-table-toolbar";
import DataTableModal from "./table/shipping-routes/data-table-modal";
import { DataTableRowActions } from "./table/data-table-row-actions";

import { WAREHOUSES, ShippingRouteSchema } from "@/types/shipping";
import type { Shipper, Warehouse, ShippingRoute } from "@/types/shipping";
import { CURRENCIES } from "@/types/currency";
import { COUNTRIES } from "@/types/country";

import {
  toFixedWithoutTrailingZeros,
  getConversionRate,
  generateShippingRoute,
} from "@/utils";
import warehousesData from "@/data/warehouses.json";

import { ROW_ACTIONS, type RowAction } from "./table/data/data";

function ShipperCard({
  shipper,
  setShipper,
}: {
  shipper: Shipper;
  setShipper: (shipper: Shipper) => void;
}) {
  const { settings } = useSettings();
  const [conversionRate, setConversionRate] = useState<number | undefined>();

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const form = useForm<ShippingRoute>({
    resolver: zodResolver(ShippingRouteSchema),
    defaultValues: generateShippingRoute(
      shipper.id,
      shipper.defaultCurrency,
      shipper.basedIn || (warehousesData[0] as Warehouse)
    ),
  });

  useEffect(() => {
    const updateConversionRate = async () => {
      setConversionRate(
        (await getConversionRate(shipper.defaultCurrency, settings.currency))
          .conversion_rate
      );
    };
    updateConversionRate();
  }, [shipper.defaultCurrency, settings.currency]);

  const onSubmit: SubmitHandler<ShippingRoute> = (value) => {
    form.reset();
    setModalOpen(false);
    console.log("Successful submission: ", value);
    if (editMode) {
      setShipper({
        ...shipper,
        shippingRoutes: shipper.shippingRoutes.map((route) =>
          route.id === value.id ? value : route
        ),
      });
    } else {
      setShipper({
        ...shipper,
        shippingRoutes: [...shipper.shippingRoutes, value],
      });
    }
  };

  const actionHandler = (action: RowAction, route: ShippingRoute) => {
    if (action === ROW_ACTIONS.EDIT) {
      form.reset(route);
      setEditMode(true);
      setModalOpen(true);
    } else if (action === ROW_ACTIONS.DELETE) {
      setShipper({
        ...shipper,
        shippingRoutes: shipper.shippingRoutes.filter((r) => r.id !== route.id),
      });
    } else if (action === ROW_ACTIONS.COPY) {
      const newRoute = {
        ...route,
        id: crypto.randomUUID(),
        name: route.name + " (Copy)",
      };
      setShipper({
        ...shipper,
        shippingRoutes: [...shipper.shippingRoutes, newRoute],
      });
    }
  };

  return (
    <div className="flex-1 outline-none relative flex flex-col gap-4 px-4 lg:px-6">
      <div className="h-full flex flex-1 flex-col space-y-8 p-8 overflow-hidden bg-background bg-clip-padding border xl:rounded-xl">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {shipper.name}
            </h2>
            <div className="flex gap-2">
              <SearchSelector
                items={CURRENCIES}
                selectedKey={shipper.defaultCurrency}
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
                onSelect={(defaultCurrency) =>
                  startTransition(() =>
                    setShipper({
                      ...shipper,
                      defaultCurrency,
                    })
                  )
                }
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border text-muted-foreground"
                >
                  Default Currency
                  <Separator orientation="vertical" className="mx-2 h-8" />
                  <Flag
                    flag={CURRENCIES[shipper.defaultCurrency].flag}
                    className="w-auto text-sm"
                  />
                  <p>{CURRENCIES[shipper.defaultCurrency].currencyName}</p>
                  {shipper.defaultCurrency !== settings.currency && (
                    <p>
                      {conversionRate &&
                        CURRENCIES[shipper.defaultCurrency].currencySymbol +
                          " 1 " +
                          shipper.defaultCurrency +
                          " = " +
                          CURRENCIES[settings.currency].currencySymbol +
                          " " +
                          toFixedWithoutTrailingZeros(conversionRate, 3) +
                          " " +
                          settings.currency}
                    </p>
                  )}
                </Button>
              </SearchSelector>
              <SearchSelector
                items={WAREHOUSES}
                selectedKey={shipper.basedIn.id}
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
                  startTransition(() =>
                    setShipper({
                      ...shipper,
                      basedIn: {
                        id: warehouseId,
                        ...WAREHOUSES[warehouseId],
                      },
                    })
                  )
                }
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border text-muted-foreground"
                >
                  Based In
                  <Separator orientation="vertical" className="mx-2 h-8" />
                  <Flag
                    flag={COUNTRIES[shipper.basedIn?.countryName].flag}
                    className="w-auto text-sm"
                  />
                  {shipper.basedIn.name === shipper.basedIn.countryName
                    ? shipper.basedIn.name
                    : `${shipper.basedIn.name}, ${shipper.basedIn.countryName}`}
                </Button>
              </SearchSelector>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <EditImage image={shipper?.image || ""} />
          </div>
        </div>
        <DataTableModal
          form={form}
          open={modalOpen}
          editMode={editMode}
          setOpen={setModalOpen}
          onSubmit={onSubmit}
        />
        <DataTable
          columns={[
            ...columns,
            {
              id: "actions",
              cell: ({ row }) => (
                <DataTableRowActions row={row} actionFn={actionHandler} />
              ),
              enableSorting: false,
              enableHiding: false,
            },
          ]}
          data={shipper.shippingRoutes}
          renderToolbar={(table) => (
            <DataTableToolbar
              table={table}
              onAddRoute={() => {
                form.reset(
                  generateShippingRoute(
                    shipper.id,
                    shipper.defaultCurrency,
                    shipper.basedIn || (warehousesData[0] as Warehouse)
                  )
                );
                setEditMode(false);
                setModalOpen(true);
              }}
            />
          )}
          // columnVisibility={{
          //   name: false,
          //   evaluationType: true,
          //   volumetricDivisor: false,
          //   feeSplit: true,
          //   price: false,
          // }}
        />
      </div>
    </div>
  );
}

export default ShipperCard;
