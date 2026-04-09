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
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState(false);
  const [allMembers, setAllMembers] = useState<any[]>([]);
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

    setIsDataLoading(true);

    const baseUrl = `/users/${user.userId}/workspace/${activeWorkspaceId}`;

    // ADDED: .then((res) => res.ok ? res.json() : []) to handle 403s gracefully
    Promise.all([
      apiFetch(`${baseUrl}/permissions`).then((res) => res.ok ? res.json() : []),
      apiFetch(`${baseUrl}/boards`).then((res) => res.ok ? res.json() : []),
      apiFetch(baseUrl).then((res) => res.ok ? res.json() : {}),
      apiFetch(`${baseUrl}/roles`).then((res) => res.ok ? res.json() : []),
    ])
      .then(([permissions, boards, details, roles]) => {
        setUserPermissions(
          Array.isArray(permissions) ? permissions.map((p: any) => p.name) : [],
        );
        setBoardList(Array.isArray(boards) ? boards : []);
        setOwnerId(details.owner_id);
        
        // Ensure roles is always an array, even if the backend blocked it (403)
        setWorkspaceRoles(Array.isArray(roles) ? roles : []); 

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

  const fetchMembers = async () => {
    try {
      const res = await apiFetch(`/users/${user?.userId}/workspace/${activeWorkspaceId}/members`);
      if (res.ok) {
        const data = await res.json();
        setAllMembers(data);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };
  const handleOpenMembersModal = () => {
    fetchMembers();
    setIsViewMembersModalOpen(true);
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
            <ButtonWithIcon
              onClick={handleOpenMembersModal}
              text="View Members"
              icon="👥"
            />
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
        {canSeeBoardCreate && (
          
        <button
          className="border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center p-5 hover:border-gray-500 cursor-pointer transition-colors min-h-40"
          onClick={() => setIsCreateBoardModalOpen(true)}
        >
          <span className="text-white">Create New Board</span>
        </button>
          )}
      </div>

      {/* Modals */}
      {isViewMembersModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
      <button
        onClick={() => setIsViewMembersModalOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">Workspace Members</h2>
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* --- FILTER ADDED HERE --- */}
        {allMembers
          .filter((member: any) => member.user?.id !== ownerId) 
          .map((member: any) => (
            <div 
              key={member.id} 
              className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {member.user?.name?.charAt(0) || member.user?.email?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {member.user?.name || "Pending User"}
                  </p>
                  <p className="text-gray-400 text-xs">{member.user?.email}</p>
                </div>
              </div>

              <div className="flex gap-1 flex-wrap justify-end">
                {member.roles?.map((role: any) => (
                  <span 
                    key={role.id} 
                    className="px-2 py-1 bg-blue-900/40 text-blue-400 text-[10px] rounded uppercase border border-blue-800"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
        {/* Optional: Show a message if no one else is in the workspace */}
        {allMembers.filter((m: any) => m.user?.id !== ownerId).length === 0 && (
          <div className="text-center py-10 text-gray-500 italic">
            No other members in this workspace yet.
          </div>
        )}
      </div>
    </div>
  </div>
)}
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
