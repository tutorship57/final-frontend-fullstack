import  { useState } from "react";
import ListCard from "../components/cards/ListCard";
import { DragDropProvider } from "@dnd-kit/react";
import type { TaskProps } from "../components/cards/TaskCard";

interface Column {
  id: number;
  title: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  label: string;
  labelColor: string;
}

const BoardSpace = () => {
  // Mock data structure
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 1,
      title: "To Do",
      tasks: [
        {
          id: 101,
          title: "Design system update",
          label: "Design",
          labelColor: "bg-purple-500",
        },
        {
          id: 102,
          title: "Fix header navigation",
          label: "Bug",
          labelColor: "bg-red-500",
        },
      ],
    },
    {
      id: 2,
      title: "In Progress",
      tasks: [
        {
          id: 103,
          title: "Auth flow implementation",
          label: "Dev",
          labelColor: "bg-blue-500",
        },
      ],
    },
    {
      id: 3,
      title: "Done",
      tasks: [
        {
          id: 104,
          title: "Setup Project",
          label: "Dev",
          labelColor: "bg-green-500",
        },
      ],
    },
  ]);

  const handleDragEnd = (event: any) => {
    if (event.canceled) return;

    const activeId: number = event.operation.source.id;
    const overId: number = event.operation.target?.id;

    if (!overId) return;

    setColumns((prev) => {
      // Deep copy
      const newColumns = prev.map((col) => ({
        ...col,
        tasks: [...col.tasks],
      }));

      let taskToMove: TaskProps | null = null;

      // Find and remove task from old column
      newColumns.forEach((col) => {
        const index = col.tasks.findIndex((t) => t.id === activeId);
        if (index !== -1) {
          taskToMove = col.tasks.splice(index, 1)[0];
        }
      });

      // Add task to new column only if taskToMove was found
      const targetCol = newColumns.find((col) => col.id === overId);
      if (targetCol && taskToMove) {
        targetCol.tasks.push(taskToMove);
      }

      return newColumns;
    });
  };

  return (
    /* Added a deep slate background to match the dark theme */
    <div className="h-screen flex flex-col bg-[#0f172a] text-white ">
      
      {/* Board Sub-Header - Removed the heavy blur/gray and made it clean */}
      <div className="px-6 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Board 1
          </h1>
        </div>
        
        <div className="flex gap-3">
          <button className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5">
            Share
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5">
            Filter
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <DragDropProvider onDragEnd={(event) => handleDragEnd(event)}>
        <div className="flex-1 overflow-x-auto px-6 pb-6 flex gap-4 items-start">
          {columns.map((col: Column) => (
            <ListCard
              key={col.id}
              title={col.title}
              tasks={col.tasks}
              id={col.id}
            />
          ))}

          {/* New List Trigger - Changed from dashed border to a solid, subtle dark button */}
          <button className="min-w-[280px] bg-white/5 hover:bg-white/10 rounded-xl p-3.5 text-gray-300 flex items-center gap-2 transition-colors text-sm font-medium shadow-sm">
            <span className="text-lg leading-none">+</span> Add another list
          </button>
        </div>
      </DragDropProvider>
    </div>
  );
};

export default BoardSpace;