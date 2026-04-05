// Define the interface for a single board's data
interface BoardProps {
  id: string;
  title: string;
  taskCount: number;
  background_url?: string;
  onClick: (id: string) => void;
}

const BoardCard = ({
  id,
  title,
  background_url,
  taskCount,
  onClick,
}: BoardProps) => {
  return (
    <div
      className="group cursor-pointer bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-amber-600/50 hover:shadow-xl hover:shadow-amber-900/20 transition-all duration-300"
      onClick={() => onClick(id)}
    >
      <div
        className="h-2 bg-cover bg-center"
        style={{ backgroundImage: `url(${background_url})` }}
      />

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-amber-500 transition-colors">
          {title}
        </h3>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {/* Use a div here instead of a p tag */}
          <div className="text-sm text-gray-400 mt-1">{title}</div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full border-2 border-gray-800 bg-gray-600" />
            <div className="w-7 h-7 rounded-full border-2 border-gray-800 bg-gray-500" />
            <div className="w-7 h-7 rounded-full border-2 border-gray-800 bg-gray-400" />
          </div>
          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Open
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
