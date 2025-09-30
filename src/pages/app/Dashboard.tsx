import AppContainer from "@/components/app-container";
import { SiteHeader } from "@/components/site-header";
import { generateShippers } from "@/data/generate-data";
import { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    generateShippers();
  }, []);

  return (
    <>
      <SiteHeader>
        <h1 className="text-base font-medium">Dashboard</h1>
      </SiteHeader>
      <AppContainer>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
      </AppContainer>
    </>
  );
}

export default Dashboard;
