import { NavLink } from "react-router";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { useSettings } from "./settings-provider";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavRuns } from "@/components/nav-runs";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { SearchSelector } from "@/components/search-selector";

import { sidebarRoutes } from "@/routes";
import { CURRENCIES } from "@/interfaces/currency";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { settings, setSettings } = useSettings();

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
        <SidebarMenu>
          <SidebarMenuItem>
            <SearchSelector
              items={CURRENCIES}
              selectedKey={settings.currency}
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
              onSelect={(currency) =>
                setSettings((oldSettings) => ({
                  ...oldSettings,
                  currency,
                }))
              }
              label="Choose a currency"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
