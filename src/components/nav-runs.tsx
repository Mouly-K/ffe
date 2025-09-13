"use client";
import { useState } from "react";
import { NavLink } from "react-router";

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "./ui/scroll-area";
import type { SidebarRoute } from "@/routes";

export function NavRuns({ items }: { items: SidebarRoute[] }) {
  const { isMobile } = useSidebar();
  const [renderRouteNum, setRenderRouteNum] = useState(10);

  function updateRouteNum() {
    if (renderRouteNum === items.length) return;
    setRenderRouteNum((num) => Math.min(items.length, num + 10));
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden pr-0">
      <SidebarGroupLabel>Runs</SidebarGroupLabel>
      <SidebarMenu>
        <ScrollArea className="max-h-120 pr-2">
          {items.slice(0, renderRouteNum).map((item) => (
            <SidebarMenuItem key={item.name}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <SidebarMenuButton tooltip={item.name} isActive={isActive}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent rounded-sm"
                  >
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <IconFolder />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconShare3 />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <IconTrash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70"
              onClick={updateRouteNum}
            >
              <IconDots className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </ScrollArea>
      </SidebarMenu>
    </SidebarGroup>
  );
}
