import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/react';

export interface ListProps {
  title: string;
  tasks: { id: number; title: string; label?: string; labelColor?: string }[];
  id: number
}

const ListCard = ({ id, title, tasks }: ListProps) => {
     const {ref} = useDroppable({
    id,
  });

  return (
    <div className="bg-gray-800/50 min-w-[300px] max-w-[300px] rounded-xl flex flex-col max-h-full border border-gray-700">
      {/* List Header */}
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-gray-100 font-bold">{title}</h3>
        <span className="bg-gray-700 text-gray-400 text-xs px-2 py-1 rounded-md">{tasks.length}</span>
      </div>

      {/* Tasks Scrollable Area */}
      <div ref={ref} className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {tasks.map((task) => (
          <TaskCard key={task.id} title={task.title} label={task.label} labelColor={task.labelColor} id={task.id} />
        ))}
      </div>

      {/* List Footer */}
      <div className="p-3">
        <button className="w-full text-left p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-200 rounded-lg transition-colors text-sm font-medium">
          + Add a card
        </button>
      </div>
    </div>
  );
};

export default ListCard;