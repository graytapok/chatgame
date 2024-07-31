import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import AppRoutes from "src/pages";

export const pagesRouter = createBrowserRouter(
  createRoutesFromElements(<Route path="/*" element={<AppRoutes />} />)
);

export const RoutingProvider = () => <RouterProvider router={pagesRouter} />;
