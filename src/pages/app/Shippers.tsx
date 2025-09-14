import { useEffect, useState } from "react";
import { useSettings } from "@/components/settings-provider";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { EditImage } from "@/components/edit-image";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { SearchSelector } from "@/components/search-selector";

import type { Shipper, Warehouse } from "@/interfaces/shipping";
import { CURRENCIES } from "@/interfaces/currency";
import { COUNTRIES } from "@/interfaces/country";

import tasks from "@/components/table/data/tasks.json";
import warehouses from "@/data/warehouses.json";
import SHIPPERS from "@/data/shippers.json";

import {
  indexBy,
  toFixedWithoutTrailingZeros,
  getConversionRate,
} from "@/utils";

const WAREHOUSES: {
  [id: string]: Omit<Warehouse, "id">;
} = indexBy(warehouses as Warehouse[], "id");

function Shippers() {
  const [shippers, setShippers] = useState<Shipper[]>(SHIPPERS as Shipper[]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {shippers.map((shipper, index) => (
        <ShipperCard
          key={shipper.id}
          shipper={shippers[0]}
          setShipper={(shipper: Shipper) =>
            setShippers((shippers) => {
              shippers[index] = { ...shipper };
              return [...shippers];
            })
          }
        />
      ))}
    </div>
  );
}

function ShipperCard({
  shipper,
  setShipper,
}: {
  shipper: Shipper;
  setShipper: (shipper: Shipper) => void;
}) {
  const { settings } = useSettings();
  const [conversionRate, setConversionRate] = useState<number | undefined>();

  useEffect(() => {
    const updateConversionRate = async () => {
      setConversionRate(
        (await getConversionRate(shipper.defaultCurrency, settings.currency))
          .conversion_rate
      );
    };
    updateConversionRate();
  }, [shipper.defaultCurrency, settings.currency]);

  return (
    <div className="flex-1 outline-none relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
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
                    <div className="h-8 w-8 rounded-lg text-xl flex justify-center items-center font-[BabelStoneFlags]">
                      {item.flag}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{key}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {item.currencyName}
                      </span>
                    </div>
                  </>
                )}
                onSelect={(defaultCurrency) =>
                  setShipper({
                    ...shipper,
                    defaultCurrency,
                  })
                }
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border text-muted-foreground"
                >
                  Default Currency
                  <Separator orientation="vertical" className="mx-2 h-8" />
                  <div className="h-8 flex justify-center items-center font-[BabelStoneFlags]">
                    {CURRENCIES[shipper.defaultCurrency].flag}
                  </div>
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
              {shipper.basedIn && (
                <SearchSelector
                  items={WAREHOUSES}
                  selectedKey={shipper.basedIn.id}
                  renderItem={(_, item) => (
                    <>
                      <div className="h-8 w-8 rounded-lg text-xl flex justify-center items-center font-[BabelStoneFlags]">
                        {COUNTRIES[item.countryName].flag}
                      </div>
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
                    setShipper({
                      ...shipper,
                      basedIn: {
                        id: warehouseId,
                        ...WAREHOUSES[warehouseId],
                      },
                    })
                  }
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border text-muted-foreground"
                  >
                    Based In
                    <Separator orientation="vertical" className="mx-2 h-8" />
                    <div className="h-8 flex justify-center items-center font-[BabelStoneFlags]">
                      {COUNTRIES[shipper.basedIn?.countryName].flag}
                    </div>
                    {shipper.basedIn.name === shipper.basedIn.countryName
                      ? shipper.basedIn.name
                      : `${shipper.basedIn.name}, ${shipper.basedIn.countryName}`}
                  </Button>
                </SearchSelector>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <EditImage image={shipper?.image || ""} />
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </div>
  );
}

export default Shippers;
