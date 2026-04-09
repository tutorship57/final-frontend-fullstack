import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import BoardSpace from "../pages/BoardSpace";
import { type JSX } from "react";
import RegisterPage from "../components/RegisterPage";
import { DashboardPage } from "../pages/admin/DashboardPage";

export interface ChildrenPath {
  index?: boolean;
  path: string;
  element: JSX.Element;
}
export const pathList: ChildrenPath[] = [
  {
    index: true,
    path: "/", // This is the default "home" route
    element: <Home />,
  },
  {
    path: "board/:boardID",
    element: <BoardSpace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardPage />,
  },
];
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        // HIDE Home from Admin: Redirect to admin/overview if role is admin
        element: (
          <ProtectedRoute allowedRoles={["user", "company"]}>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/overview", // New Overview Page
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Home /> 
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/dashboard", // Activity Log
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export const navList = [
  { name: "Main", path: "/", roles: ["user", "company"] },
  { name: "Overview", path: "/admin/overview", roles: ["admin"] },
  { name: "Activity Log", path: "/admin/dashboard", roles: ["admin"] },
];
