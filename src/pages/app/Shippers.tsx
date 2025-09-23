import { useState, startTransition } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";

import ShipperCard from "@/components/shipper-card";
import { SiteHeader } from "@/components/site-header";
import AppContainer from "@/components/app-container";

import type { Shipper } from "@/types/shipping";

import SHIPPERS from "@/data/shippers.json";

function Shippers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shippers, setShippers] = useState<Shipper[]>(SHIPPERS as Shipper[]);

  const filteredShippers = shippers.filter((shipper) =>
    shipper.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

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
          <Button variant="outline" size="sm" className="h-8">
            <PlusCircle />
            Add Warehouse
          </Button>
          <Button variant="default" size="sm" className="h-8">
            <PlusCircle />
            Add Shipper
          </Button>
        </div>
      </SiteHeader>
      <AppContainer>
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
