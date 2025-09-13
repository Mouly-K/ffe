import { createBrowserRouter, type RouteObject } from "react-router";
import type { Icon } from "@tabler/icons-react";

import {
  IconDashboard,
  IconFileWord,
  IconListDetails,
  IconReport,
  IconSettings,
} from "@tabler/icons-react";

import App from "./pages/app/App";
import Dashboard from "./pages/app/Dashboard";
import Shippers from "./pages/app/Shippers";
import Runs from "./pages/app/Runs";
import Run from "./pages/app/Run";

const homePages: (RouteObject & {
  name: string;
  icon: Icon;
})[] = [
  {
    path: "/shippers",
    Component: Shippers,
    name: "Shippers",
    icon: IconListDetails,
  },
  {
    path: "/runs",
    Component: Runs,
    name: "Runs",
    icon: IconReport,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      ...homePages.map((route) => ({
        path: route.path,
        Component: route.Component,
      })),
      {
        path: "/runs/:runId",
        Component: Run,
      },
    ],
  },
]);

interface SidebarRoute {
  name: string;
  path: string;
  icon?: Icon;
  children?: SidebarRoute[];
}

const sidebarRoutes: { [key: string]: SidebarRoute[] } = {
  navMain: [
    {
      name: "Dashboard",
      path: "/",
      icon: IconDashboard,
    },
    ...homePages.map(
      (route) =>
        ({
          name: route.name,
          path: route.path,
          icon: route.icon,
        } as SidebarRoute)
    ),
  ],
  navRuns: Array.from({ length: 40 }, (_, i) => ({
    name: "Run " + (i + 1),
    path: "/runs/" + (i + 1),
    icon: IconFileWord,
  })),
  navSecondary: [
    {
      name: "Settings",
      path: "/",
      icon: IconSettings,
    },
  ],
};

export default router;
export { sidebarRoutes, type SidebarRoute };
