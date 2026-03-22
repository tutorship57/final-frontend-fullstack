import React from 'react';
import {useDraggable} from '@dnd-kit/react';


export interface TaskProps {
  title: string;
  label?: string;
  labelColor?: string;
  id: number
}

const TaskCard = ({ id,title, label, labelColor = "bg-blue-500" }: TaskProps) => {
   const {ref} = useDraggable({
    id: id,
  });
  
  return (

      <div ref={ref}  className="bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-600 hover:border-gray-400 cursor-grab active:cursor-grabbing transition-all">
        {label && (   
          <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold uppercase ${labelColor}`}>
            {label}
          </span>
        )}
        <p className="text-gray-200 mt-2 text-sm">{title}</p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="w-5 h-5 rounded-full bg-gray-500" /> 
          <span className="text-gray-500 text-xs">Mar 18</span>
        </div>
      </div>
      
  );
};

export default TaskCard;