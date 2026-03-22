import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
  const { boardID } = useParams();

  // Mock data structure
  //TODO: GET LISTS join with TASKCARDS
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
  
  const handleDragEnd = (event: any) =>{
    if (event.canceled) return;

    const activeId:number = event.operation.source.id;
    const overId: number = event.operation.target?.id;

    if (!overId) return;

    setColumns((prev) => {
      //deep copy
      const newColumns = prev.map(col => ({
        ...col,
        tasks: [...col.tasks]
      }));

      let taskToMove: TaskProps | null = null;

      //Find and remove task from old column
      newColumns.forEach(col => {
        const index = col.tasks.findIndex(t => t.id === activeId);
        if (index !== -1) {
          taskToMove = col.tasks.splice(index, 1)[0];
        }
      });

//      Add task to new column only if taskToMove was found
      const targetCol = newColumns.find(col => col.id === overId);
      if (targetCol && taskToMove) {
        targetCol.tasks.push(taskToMove);
      }

      return newColumns;
    });
  }
  return (
    <div className="h-full flex flex-col">
      {/* Board Sub-Header */}
      <div className="p-6 flex justify-between items-center bg-gray-900/50 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white">Board #{boardID}</h1>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-white px-3 py-1">
            Share
          </button>
          <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm">
            Filter
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <DragDropProvider onDragEnd={(event) => handleDragEnd(event)}>
        <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
          {columns.map((col: Column) => (
            <ListCard
              key={col.id}
              title={col.title}
              tasks={col.tasks}
              id={col.id}
            ></ListCard>
          ))}

          {/* New List Trigger */}
          <button className="min-w-[300px] bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl p-4 text-gray-500 hover:border-gray-500 hover:text-gray-300 transition-all">
            + Add another list
          </button>
        </div>
      </DragDropProvider>
    </div>
  );
};

export default BoardSpace;
