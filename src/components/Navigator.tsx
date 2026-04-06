import { NavLink } from "react-router-dom";
import { navList } from "../routes/Router";

export const Navigator = () => {
  return (
    <nav className="bg-amber-600 flex gap-4 p-4">
      {navList.map((element) => (
        <NavLink
          to={element.children.path}
          className={({ isActive }) => (isActive ? "font-bold underline" : "")}
        >
          {element.name}
        </NavLink>
      ))}
    </nav>
  );
};
