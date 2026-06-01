import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Clips from "./pages/Clips";
import ClipReview from "./pages/ClipReview";
import Exports from "./pages/Exports";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      {
        Component: AuthLayout,
        children: [
          { path: "dashboard", Component: Dashboard },
          { path: "projects", Component: Projects },
          { path: "projects/:id", Component: ProjectDetail },
          { path: "clips", Component: Clips },
          { path: "clips/:id", Component: ClipReview },
          { path: "exports", Component: Exports },
          { path: "templates", Component: Templates },
          { path: "settings", Component: Settings },
          { path: "billing", Component: Billing },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
