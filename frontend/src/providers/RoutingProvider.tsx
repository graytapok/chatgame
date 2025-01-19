import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";

import AppRoutes from "src/pages";

export const pagesRouter = createBrowserRouter(
  createRoutesFromElements(<Route path="/*" element={<AppRoutes />} />)
);

export const RoutingProvider = () => <RouterProvider router={pagesRouter} />;
