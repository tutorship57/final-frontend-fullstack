  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import BoardCard from "./cards/BoardCard";
  import ButtonWithIcon from "./buttons/ButtonWithIcon";
  import { useAuth } from "../contexts/type";
  import { apiFetch } from "./utils/api";
  import type { Board } from "../types";
  import RoleManager from "./RoleManager";
  import CreateBoard from "./CreateBoard";

  interface BoardListProps {
    activeWorkspaceId: string;
  }

  const BoardList = ({ activeWorkspaceId }: BoardListProps) => {
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
    const [boardList, setBoardList] = useState<Board[]>([]);
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    useEffect(() => {
      // 1. Make sure we have BOTH the user and the workspace ID before fetching!
      if (user?.userId && activeWorkspaceId) {
        apiFetch(`/users/${user.userId}/workspace/${activeWorkspaceId}/boards`, {
          method: "GET",
          credentials: "include",
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
          })
          .then((data) => {
            if (Array.isArray(data)) {
              // 2. Log the data directly from the fetch to see the true results!
              console.log("Fetched boards with tasks:", data);
              setBoardList(data);
            } else {
              console.error("Backend did not return an array:", data);
              
              setBoardList([]);
            }
          })
          .catch((err) => console.error(err));
      }
      
    }, [user?.userId, activeWorkspaceId]);

    const handleBoardClick = (id: string) => {
      navigate(`/board/${id}`);
    };
    const handleCreateNew = () => {
      setIsCreateBoardModalOpen(true)
    };
    const addMember = () => {
      
    };
    const manageRole = () => {
      alert("Button clicked!");
      setIsMemberModalOpen(true);
      console.log("HERE")
    };
    if (loading) return <div>Loading...</div>;
    return (
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Boards</h1>
            <p className="text-gray-400">Manage your projects and tasks</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 z-10">
              
              <ButtonWithIcon
                onClick={addMember} 
                text="Add Member"
                icon="+"
              />
            
              <ButtonWithIcon onClick={manageRole} text="Manage role" icon="+" />
              <ButtonWithIcon
                onClick={handleCreateNew}
                text="New Board"
                icon="+"
              />
            </div>
            {/* <div className='flex itext-white items-center text-white gap-2.5'>
              <span>Members</span>
              <div className='border rounded-4xl w-8 h-8'></div>
              <div className='border rounded-4xl w-8 h-8'></div>
              <div className='border rounded-4xl w-8 h-8'></div>
              ...
            </div> */}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boardList.map((board) => (
            <BoardCard
              key={board.id} // <-- Also removed the `index+` here. board.id is perfectly unique!
              {...board}
              onClick={handleBoardClick} // <-- Look how clean this is!
            />
          ))}

          {/* Empty State remains here as a static helper */}
          <div className="border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-5 hover:border-gray-500 cursor-pointer transition-colors min-h-[160px]" onClick={handleCreateNew}>
            <span className="text-gray-500 text-sm font-medium">
              Create from Template
            </span>
          </div>
        </div>
        {isMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
              
              {/* Close Button */}
              <button 
                onClick={() => setIsMemberModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>

              {/* The RoleManager Component! */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Workspace Members & Roles</h2>
                <RoleManager workspaceId={activeWorkspaceId} />
              </div>

            </div>
          </div>
        )}
        {/* Create Board */}
        {isCreateBoardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
              
              {/* Close Button */}
              <button 
                onClick={() => setIsCreateBoardModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>

              {/* The RoleManager Component! */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Workspace Members & Roles</h2>
                <CreateBoard workspaceId={activeWorkspaceId} onBoardCreated={() => setIsCreateBoardModalOpen(false)}/>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  };

  export default BoardList;
