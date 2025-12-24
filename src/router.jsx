import { createBrowserRouter, Navigate, Route } from "react-router-dom";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import Signup from "./views/Signup";
import DefaultLayout from "./components/DefaultLayout";
import Dashboard from "./views/Dashboard";
import Users from "./views/users";
import NotFound from "./views/NotFound";
import CreateInvoice from "./views/CreateInvoice";
import ShowInvoice from "./views/ShowInvoice";
import Invoices from "./views/Invoices";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/new-invoice" replace />,
      },
      { path: "/users", element: <Users /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/new-invoice", element: <CreateInvoice /> },
      { path: "/invoice/:id", element: <ShowInvoice /> },
      { path: "/invoices", element: <Invoices /> },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
