import { useMemo } from 'react';

interface BoardProps {
  id: string;
  title: string;
  background_url?: string; // Kept in interface, but using random color as requested
  onClick: (id: string) => void;
}

const BoardCard = ({ id, title, onClick }: BoardProps) => {
  // Generate a random accent color once per component mount
  const randomAccent = useMemo(() => {
    const colors = [
      'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 
      'bg-rose-500', 'bg-violet-500', 'bg-cyan-500', 
      'bg-orange-500', 'bg-fuchsia-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <button
      type="button"
      className="group relative flex flex-col w-full text-left cursor-pointer bg-gray-800 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 hover:shadow-2xl transition-all duration-300 active:scale-95"
      onClick={() => onClick(id)}
    >
      {/* Random Color Strip */}
      <div className={`h-2.5 w-full ${randomAccent} opacity-80 group-hover:opacity-100 transition-opacity`} />

      <div className="p-6 flex flex-col justify-between h-full min-h-[120px]">
        <div>
          <h3 className="text-xl font-bold text-gray-100 group-hover:text-white leading-tight transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="mt-2 h-1 w-8 bg-gray-700 group-hover:w-12 group-hover:bg-gray-500 transition-all duration-500" />
        </div>
        
        {/* Subtle detail to fill space without clutter */}
        <div className="mt-4 flex items-center justify-end">
           <svg 
            className="w-5 h-5 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-1 transition-all" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default BoardCard;