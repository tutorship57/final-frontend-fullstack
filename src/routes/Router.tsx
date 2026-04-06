import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import BoardSpace from "../pages/BoardSpace";
import { use, type JSX } from "react";
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
export const navList: { name: string; children: ChildrenPath }[] = [
  {
    name: "Main",
    children: pathList[0],
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
        element: <Home />,
      },
      {
        path: "board/:boardID",
        element: <BoardSpace />,
      },
      // Admin only route
      {
        path: "admin/dashboard",
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
