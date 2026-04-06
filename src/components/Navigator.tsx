import { NavLink } from "react-router-dom";
import { navList } from "../routes/Router";
import LogoutButton from "./buttons/LogoutButton";
import { useAuth } from "../contexts/type"; // Ensure this path is correct

export const Navigator = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-amber-600 flex gap-4 p-4 place-content-between text-white">
      <div className="flex gap-4 items-center">
        {/* Render standard routes */}
        {navList.map((element) => (
          <NavLink
            key={element.children.path}
            to={element.children.path}
            className={({ isActive }) =>
              isActive ? "font-bold underline" : "hover:opacity-80"
            }
          >
            {element.name}
          </NavLink>
        ))}

        {/* --- Admin Only Route --- */}
        {user?.role === "admin" && (
          <NavLink
            to="admin/dashboard"
            className={({ isActive }) =>
              `bg-blue-900 px-3 py-1 rounded-md transition-colors ${
                isActive ? "ring-2 ring-white font-bold" : "hover:bg-blue-700"
              }`
            }
          >
            Admin Dashboard
          </NavLink>
        )}
      </div>
      <div className="flex justify-center items-center">
        <p>{user?.email}</p>
      <LogoutButton />
      </div>
    </nav>
  );
};