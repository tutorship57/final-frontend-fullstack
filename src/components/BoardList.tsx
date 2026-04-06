import { useNavigate } from 'react-router-dom';
import BoardCard from './cards/BoardCard';
import CreateBoardButton from './buttons/CreateBoardButton';

const BoardList = () => {
  const navigate = useNavigate();

  const boards = [
    { id: 1, title: "Sprint Planning", color: "bg-blue-500", tasks: 12 },
    { id: 2, title: "UI/UX Design", color: "bg-purple-500", tasks: 5 },
    { id: 3, title: "Marketing Campaign", color: "bg-green-500", tasks: 8 },
    { id: 4, title: "Product Roadmap", color: "bg-amber-500", tasks: 20 },
  ];

  const handleBoardClick = (id: number) => {
    navigate(`/board/${id}`);
  };
  const handleCreateNew = () => {
      console.log("Opening 'Create Board' Modal or Form...");
      // Future logic: setModalOpen(true)
    };
  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Boards</h1>
          <p className="text-gray-400">Manage your projects and tasks</p>
        </div>
        <CreateBoardButton onClick={handleCreateNew} />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board) => (
          <BoardCard 
            key={board.id} 
            {...board} // This spreads all properties (id, title, color, etc.) as props
            onClick={handleBoardClick} 
          />
        ))}

        {/* Empty State remains here as a static helper */}
        <div className="border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-5 hover:border-gray-500 cursor-pointer transition-colors min-h-[160px]">
          <span className="text-gray-500 text-sm font-medium">Create from Template</span>
        </div>
      </div>
    </div>
  );
};

export default BoardList;