
interface WorkSpaceItemProps {
  name: string;
  isActive?: boolean;
  onClick: () => void;
  isCreate: boolean
}

const WorkSpaceItem = ({ name, isActive, onClick, isCreate }: WorkSpaceItemProps) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors duration-200 group flex items-center gap-3 
        ${isActive 
          ? 'bg-gray-700 text-white border-l-4 border-amber-600 rounded-l-none' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
      {/* Icon Placeholder */}
      {isCreate? null : <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110 
        ${isActive ? 'bg-amber-500' : 'bg-amber-600'}`}>
        {name.charAt(0)}
      </div>}
      

      <span className='font-medium truncate'>{name}</span>
    </button>
  );
};

export default WorkSpaceItem;