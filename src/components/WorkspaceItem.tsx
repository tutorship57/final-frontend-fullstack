import React from "react";

interface WorkSpaceItemProps {
  name: string;
  isActive?: boolean;
  onClick: () => void;
  isCreate?: boolean; // If true, applies specific styling for the "Create" button
}

const WorkSpaceItem = ({ name, isActive, onClick, isCreate = false }: WorkSpaceItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
        ${isCreate 
          ? "bg-amber-600/10 text-amber-500 border border-dashed border-amber-600/30 hover:bg-amber-600 hover:text-white" 
          : isActive 
            ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20" 
            : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-100"
        }
      `}
    >
      {/* Icon/Avatar Placeholder */}
      <div className={`
        w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs uppercase
        ${isActive ? "bg-white/20" : "bg-gray-700 group-hover:bg-gray-600"}
      `}>
        {isCreate ? "+" : name.substring(0, 2)}
      </div>

      <span className="text-sm font-semibold truncate">
        {name}
      </span>

      {isActive && !isCreate && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      )}
    </button>
  );
};

export default WorkSpaceItem;