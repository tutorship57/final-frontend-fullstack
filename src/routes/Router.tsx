import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import BoardSpace from "../pages/BoardSpace";
import type { JSX } from "react";
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
    path: "/admin/dashboard",
    element: <DashboardPage/>
  }

];
export const navList: { name: string; children: ChildrenPath }[] = [
  {
    name: "Main",
    children: pathList[0]
  },
  {
    name: "Login",
    children: pathList[2]
  },

];
export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />, // You MUST add this so the app knows where /login is
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ), // This wraps your pages (header/footer)
    children: [...pathList],
  },
]);
