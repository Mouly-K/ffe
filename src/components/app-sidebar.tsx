import { useState } from "react";
import { NavLink } from "react-router";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavRuns } from "@/components/nav-runs";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavCurrencySelector } from "@/components/nav-currencyselector";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { CURRENCY, type Currency } from "@/interfaces/currency";
import { sidebarRoutes } from "@/routes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userCurrency, setUserCurrency] = useState<Currency>(CURRENCY.CNY);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <NavLink to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">FFEstimator</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarRoutes.navMain} />
        <NavRuns items={sidebarRoutes.navRuns} />
        <NavSecondary items={sidebarRoutes.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavCurrencySelector
          selectedCurrency={userCurrency}
          onCurrencyChange={(newCurrency) => setUserCurrency(newCurrency)}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
