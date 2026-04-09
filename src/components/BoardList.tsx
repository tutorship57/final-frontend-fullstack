import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardCard from "./cards/BoardCard";
import ButtonWithIcon from "./buttons/ButtonWithIcon";
import { useAuth } from "../contexts/type";
import { apiFetch } from "./utils/api";
import type { Board } from "../types";
import RoleManager from "./RoleManager";
import CreateBoard from "./CreateBoard";
import InviteMember from "./InviteMember";

interface BoardListProps {
  activeWorkspaceId: string;
}

const BoardList = ({ activeWorkspaceId }: BoardListProps) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  const [boardList, setBoardList] = useState<Board[]>([]);
  const [workspaceRoles, setWorkspaceRoles] = useState([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  // 1. Added loading state to track the async batch
  const [isDataLoading, setIsDataLoading] = useState(true);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Logic: User can see manager if they own the workspace OR have the specific permission
  const isOwner = user?.userId === ownerId;
  const canSeeRoleManager = isOwner || userPermissions.includes("Manage-Role");
  const canSeeInviteManager =
    isOwner || userPermissions.includes("Manage-Member");
  const canSeeBoardCreate = isOwner || userPermissions.includes("Create Board");

  // Re-usable function for refreshing roles specifically (e.g. after adding a member)
  const fetchRolesOnly = () => {
    if (user?.userId && activeWorkspaceId) {
      apiFetch(`/users/${user.userId}/workspace/${activeWorkspaceId}/roles`)
        .then((res) => res.json())
        .then((data) => setWorkspaceRoles(data))
        .catch((err) => console.error("Error fetching roles:", err));
    }
  };

  useEffect(() => {
    if (!user?.userId || !activeWorkspaceId) return;

    // Start loading
    setIsDataLoading(true);

    const baseUrl = `/users/${user.userId}/workspace/${activeWorkspaceId}`;

    // 2. Integrated Promise.all to fetch everything simultaneously
    Promise.all([
      apiFetch(`${baseUrl}/permissions`).then((res) => res.json()),
      apiFetch(`${baseUrl}/boards`).then((res) => res.json()),
      apiFetch(baseUrl).then((res) => res.json()),
      apiFetch(`${baseUrl}/roles`).then((res) => res.json()),
    ])
      .then(([permissions, boards, details, roles]) => {
        // Update all states at once - React 18+ batches these into 1 render
        setUserPermissions(
          Array.isArray(permissions) ? permissions.map((p: any) => p.name) : [],
        );
        setBoardList(Array.isArray(boards) ? boards : []);
        setOwnerId(details.owner_id);
        setWorkspaceRoles(roles);

        setIsDataLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching workspace data:", err);
        setIsDataLoading(false);
      });
  }, [user?.userId, activeWorkspaceId]);

  const handleMemberAdded = () => {
    setIsInviteMemberModalOpen(false);
    fetchRolesOnly(); // Refresh roles list if needed
  };

  // Check both Auth loading and Data loading
  if (authLoading || isDataLoading) {
    return <div className="text-white p-10">Loading Workspace...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Boards</h1>
          <p className="text-gray-400">Manage your projects and tasks</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 z-10">
            {canSeeInviteManager && (
              <ButtonWithIcon
                onClick={() => setIsInviteMemberModalOpen(true)}
                text="Add Member"
                icon="+"
              />
            )}

            {canSeeRoleManager && (
              <ButtonWithIcon
                onClick={() => setIsMemberModalOpen(true)}
                text="Manage role"
                icon="+"
              />
            )}
              {canSeeBoardCreate && (
            <ButtonWithIcon
              onClick={() => setIsCreateBoardModalOpen(true)}
              text="New Board"
              icon="+"
            />
          )}
          </div>

        </div>
      </header>

      {/* Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boardList.map((board) => (
          <BoardCard
            key={board.id}
            {...board}
            onClick={(id) => navigate(`/board/${id}`)}
          />
        ))}
        <button
          className="border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-5 hover:border-gray-500 cursor-pointer transition-colors min-h-40"
          onClick={() => setIsCreateBoardModalOpen(true)}
        >
          <span>Create New Board</span>
        </button>
      </div>

      {/* Modals */}
      {isInviteMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <button
              onClick={() => setIsInviteMemberModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">
              Invite to Workspace
            </h2>
            <InviteMember
              workspaceId={activeWorkspaceId}
              workspaceOwnerId={ownerId || ""}
              roles={workspaceRoles}
              onMemberAdded={handleMemberAdded}
            />
          </div>
        </div>
      )}

      {isMemberModalOpen && canSeeRoleManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <button
              onClick={() => setIsMemberModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <RoleManager
              workspaceId={activeWorkspaceId}
              onRoleCreated={fetchRolesOnly}
            />
          </div>
        </div>
      )}

      {isCreateBoardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <button
              onClick={() => setIsCreateBoardModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <CreateBoard
              workspaceId={activeWorkspaceId}
              onBoardCreated={() => {
                // Refresh board list after creation
                apiFetch(
                  `/users/${user?.userId}/workspace/${activeWorkspaceId}/boards`,
                )
                  .then((res) => res.json())
                  .then((data) =>
                    setBoardList(Array.isArray(data) ? data : []),
                  );
                setIsCreateBoardModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;
