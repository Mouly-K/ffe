import { useState, startTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Warehouse as WarehouseIcon } from "lucide-react";

import { useSettings } from "@/components/settings-provider";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";

import ShipperCard from "@/components/shipper-card";
import { SiteHeader } from "@/components/site-header";
import AppContainer from "@/components/app-container";
import ShipperModal from "@/components/modals/shipper-modal";

import { ShipperSchema, WarehouseSchema } from "@/types/shipping";
import type { Shipper, Warehouse } from "@/types/shipping";

import SHIPPERS from "@/data/shippers.json";
import warehousesData from "@/data/warehouses.json";
import { generateShipper, generateWarehouse, indexBy } from "@/utils";
import WarehouseModal from "@/components/modals/warehouse-modal";
import { CURRENCIES } from "@/types/currency";
import { SearchSelector } from "@/components/search-selector";
import Flag from "@/components/flag";
import { COUNTRIES } from "@/types/country";

function Shippers() {
  const {
    settings: { currency },
  } = useSettings();

  const [searchQuery, setSearchQuery] = useState("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>(
    warehousesData as Warehouse[]
  );
  const [shippers, setShippers] = useState<Shipper[]>(SHIPPERS as Shipper[]);

  const filteredShippers = shippers.filter((shipper) =>
    shipper.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const [shipperModalOpen, setShipperModalOpen] = useState(false);
  const [shipperModalEditMode, setShipperModalEditMode] = useState(false);
  const shipperForm = useForm<Shipper>({
    resolver: zodResolver(ShipperSchema),
    defaultValues: generateShipper(
      "",
      currency,
      warehousesData[0] as Warehouse
    ),
  });

  const onShipperModalSubmit: SubmitHandler<Shipper> = (value) => {
    shipperForm.reset();
    setShipperModalOpen(false);
    console.log("Successful submission: ", value);
    if (shipperModalEditMode) {
      setShippers((shippers) =>
        shippers.map((shipper) => (shipper.id === value.id ? value : shipper))
      );
    } else {
      setShippers((shippers) => [...shippers, value]);
    }
  };

  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [warehouseModalEditMode, setWarehouseModalEditMode] = useState(false);
  const warehouseForm = useForm<Warehouse>({
    resolver: zodResolver(WarehouseSchema),
    defaultValues: generateWarehouse("", CURRENCIES[currency].name),
  });

  const onWarehouseModalSubmit: SubmitHandler<Warehouse> = (value) => {
    warehouseForm.reset();
    setWarehouseModalOpen(false);
    console.log("Successful submission: ", value);
    if (warehouseModalEditMode) {
      setWarehouses((warehouses) =>
        warehouses.map((warehouse) =>
          warehouse.id === value.id ? value : warehouse
        )
      );
    } else {
      setWarehouses((warehouses) => [...warehouses, value]);
    }
  };

  return (
    <>
      <SiteHeader>
        <h1 className="text-base font-medium">Shippers</h1>
        <div className="ml-auto flex items-center gap-2">
          <SearchInput
            placeholderKey="shippers"
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            debounce={250}
            className="h-8"
          />
          <SearchSelector
            label="Warehouses"
            items={indexBy(warehouses, "id")}
            align="end"
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
            onAdd={() => {
              warehouseForm.reset(
                generateWarehouse("", CURRENCIES[currency].name)
              );
              setWarehouseModalEditMode(false);
              setWarehouseModalOpen(true);
            }}
            onSelect={(warehouseId) => {
              warehouseForm.reset(warehouses.find((w) => w.id === warehouseId));
              setWarehouseModalEditMode(true);
              setWarehouseModalOpen(true);
            }}
          >
            <Button variant="outline" size="sm" className="h-8">
              <WarehouseIcon />
              Warehouses
            </Button>
          </SearchSelector>
          <Button
            variant="default"
            size="sm"
            className="h-8"
            onClick={() => {
              setShipperModalEditMode(false);
              setShipperModalOpen(true);
            }}
          >
            <PlusCircle />
            Add Shipper
          </Button>
        </div>
      </SiteHeader>
      <AppContainer>
        <ShipperModal
          form={shipperForm}
          open={shipperModalOpen}
          setOpen={setShipperModalOpen}
          editMode={shipperModalEditMode}
          onSubmit={onShipperModalSubmit}
        />
        <WarehouseModal
          form={warehouseForm}
          open={warehouseModalOpen}
          setOpen={setWarehouseModalOpen}
          editMode={warehouseModalEditMode}
          onSubmit={onWarehouseModalSubmit}
        />
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {filteredShippers.map((shipper, index) => (
            <ShipperCard
              key={shipper.id}
              shipper={shipper}
              setShipper={(shipper: Shipper) =>
                startTransition(() =>
                  setShippers((shippers) => {
                    shippers[index] = { ...shipper };
                    return [...shippers];
                  })
                )
              }
            />
          ))}
        </div>
      </AppContainer>
    </>
  );
}

export default Shippers;
