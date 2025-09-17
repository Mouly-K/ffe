import { useEffect, useState, startTransition } from "react";
import { useOutletContext } from "react-router";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import ShipperCard from "@/components/shipper-card";

import type { Shipper } from "@/interfaces/shipping";

import SHIPPERS from "@/data/shippers.json";

function Shippers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shippers, setShippers] = useState<Shipper[]>(SHIPPERS as Shipper[]);
  const [_, setHeaderContent] =
    useOutletContext<
      [
        _: React.ReactElement,
        setHeaderContent: (
          old: React.ReactElement | undefined
        ) => React.ReactElement | undefined
      ]
    >();

  const filteredShippers = shippers.filter((shipper) =>
    shipper.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  useEffect(() => {
    setHeaderContent(
      <>
        <h1 className="text-base font-medium">Shippers</h1>
        <div className="ml-auto flex items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            debounce={250}
            clasName="h-8"
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
      </>
    );

    return () => {
      setHeaderContent(undefined);
    };
  }, [searchQuery]);

  return (
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
  );
}

export default Shippers;
