import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import AppContainer from "@/components/app-container";
import { SiteHeader } from "@/components/site-header";

function Run() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <SiteHeader>
        <h1 className="text-base font-medium">Run</h1>
        <div className="ml-auto flex items-center gap-2">
          <SearchInput
            placeholderKey="packages"
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            debounce={250}
            clasName="h-8"
          />
          <Button variant="default" size="sm" className="h-8">
            <PlusCircle />
            Add Package
          </Button>
        </div>
      </SiteHeader>
      <AppContainer>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
      </AppContainer>
    </>
  );
}

export default Run;
