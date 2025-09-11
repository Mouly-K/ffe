import { createBrowserRouter } from "react-router";
import Home from "./pages/home/Home";
import Welcome from "./pages/home/welcome/Welcome";
import Shippers from "./pages/home/shippers/Shippers";
import Runs from "./pages/home/runs/Runs";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      {
        index: true,
        Component: Welcome,
      },
      {
        path: "/shippers",
        Component: Shippers,
      },
      {
        path: "/runs",
        Component: Runs,
      },
      {
        path: "/runs/:runId",
        Component: Runs,
      },
    ],
  },
]);

export default router;
