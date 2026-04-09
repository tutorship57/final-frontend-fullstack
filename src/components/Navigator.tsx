import { NavLink } from "react-router-dom";
import { navList } from "../routes/Router";
import LogoutButton from "./buttons/LogoutButton";
import { useAuth } from "../contexts/type";

export const Navigator = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-amber-600 flex gap-4 p-4 place-content-between text-white shadow-md">
      <div className="flex gap-4 items-center">
        {/* Logic: Only show links if the current user's role is allowed */}
        {navList.filter(nav => nav.roles.includes(user?.role || "")).map((nav) => (
          <NavLink
            key={nav.path}
            to={nav.path}
            className={({ isActive }) => isActive ? "font-bold underline" : "hover:opacity-80"}
          >
            {nav.name}
          </NavLink>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        {/* --- User Profile Section --- */}
        <div className="flex flex-col items-end leading-tight">
          <p className="text-sm font-medium">{user?.email}</p>
          <span className="text-[10px] uppercase tracking-wider bg-black/20 px-1.5 py-0.5 rounded mt-1 font-bold">
            {user?.role}
          </span>
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
};