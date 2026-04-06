import React, { useEffect, useState } from "react";
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

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Logic: User can see manager if they own the workspace OR have the specific permission
  const isOwner = user?.userId === ownerId;
  const canSeeRoleManager = isOwner || userPermissions.includes("Manage-Role");
  const canSeeInviteManager =
    isOwner || userPermissions.includes("Manage-Member");
  const fetchRoles = () => {
    if (user?.userId && activeWorkspaceId) {
      apiFetch(`/users/${user.userId}/workspace/${activeWorkspaceId}/roles`)
        .then((res) => res.json())
        .then((data) => setWorkspaceRoles(data))
        .catch((err) => console.error("Error fetching roles:", err));
    }
  };
  useEffect(() => {
    if (user?.userId && activeWorkspaceId) {
      const baseUrl = `/users/${user.userId}/workspace/${activeWorkspaceId}`;

      // 1. Fetch User Permissions for this Workspace
      apiFetch(`${baseUrl}/permissions`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUserPermissions(data.map((p: any) => p.name));
          }
        })
        .catch((err) => console.error("Error fetching permissions:", err));

      // 2. Fetch Boards
      apiFetch(`${baseUrl}/boards`)
        .then((res) => res.json())
        .then((data) => setBoardList(Array.isArray(data) ? data : []));

      // 3. Fetch Roles (for the Invite Modal)
      fetchRoles();

      // 4. Fetch Workspace Details (to get owner_id)
      apiFetch(baseUrl)
        .then((res) => res.json())
        .then((data) => {
          setOwnerId(data.owner_id);
        });
    }
  }, [user?.userId, activeWorkspaceId]);

  const handleMemberAdded = () => {
    setIsInviteMemberModalOpen(false);
    fetchRoles();
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Boards</h1>
          <p className="text-gray-400">Manage your projects and tasks</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 z-10">
            {/* Standard buttons visible to everyone */}
            {canSeeInviteManager && (
              <ButtonWithIcon
                onClick={() => setIsInviteMemberModalOpen(true)}
                text="Add Member"
                icon="+"
              />
            )}

            {/* 🛡️ PERMISSION CHECK: Only show Manage Role if authorized or owner */}
            {canSeeRoleManager && (
              <ButtonWithIcon
                onClick={() => setIsMemberModalOpen(true)}
                text="Manage role"
                icon="+"
              />
            )}

            <ButtonWithIcon
              onClick={() => setIsCreateBoardModalOpen(true)}
              text="New Board"
              icon="+"
            />
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
        <div
          className="border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-5 hover:border-gray-500 cursor-pointer transition-colors min-h-40"
          onClick={() => setIsCreateBoardModalOpen(true)}
        >
          <span className="text-gray-500 text-sm font-medium">
            Create New Board
          </span>
        </div>
      </div>

      {/* Invite Member Modal */}
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

      {/* Role Management Modal - Wrapped in Permission check for extra safety */}
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
              onRoleCreated={fetchRoles}
            />
          </div>
        </div>
      )}

      {/* Create Board Modal */}
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
              onBoardCreated={() => setIsCreateBoardModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;
