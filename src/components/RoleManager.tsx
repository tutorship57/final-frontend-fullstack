import React, { useState, useEffect } from "react";
import { apiFetch } from "./utils/api";
import { useAuth } from "../contexts/type";
//TODO: TEST assing role invite member read code
interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Role {
  id: string;
  name: string;
}

interface RoleManagerProps {
  workspaceId: string;
}

const RoleManager = ({ workspaceId }: RoleManagerProps) => {
  // --- State ---
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Create Role State
  const [newRoleName, setNewRoleName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Assign Role State
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
    const {user, loading} = useAuth()
  // --- Fetch Initial Data ---
  useEffect(() => {
    // Fetch available roles and workspace members when component loads
    const loadData = async () => {
      try {
        // Replace these endpoints with your actual backend routes!
       const [rolesRes, membersRes] = await Promise.all([
        apiFetch(`/users/${user?.userId}/workspace/${workspaceId}/roles`), 
        apiFetch(`/users/${user?.userId}/workspace/${workspaceId}/members`) 
      ]);

        if (rolesRes.ok) setRoles(await rolesRes.json());
        if (membersRes.ok) setMembers(await membersRes.json());
        console.log(membersRes)
      } catch (error) {
        console.error("Failed to load roles or members", error);
      }
    };

    if (workspaceId) loadData();
  }, [workspaceId]);

  // --- Handlers ---
  const handleCreateRole = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    if(!user?.userId) return;
    setIsCreating(true);
    try {
     const res = await apiFetch(`/users/${user.userId}/workspace/${workspaceId}/roles`, {
  method: 'POST',
  body: JSON.stringify({ name: newRoleName }),
});

      if (res.ok) {
        const newRole = await res.json();
        setRoles([...roles, newRole]);
        setNewRoleName(""); // Clear input
        alert("Role created successfully!");
      } else {
        alert("Failed to create role");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssignRole = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMember || !selectedRole) return;
    if(!user?.userId) return;
    setIsAssigning(true);
    try {
     const res = await apiFetch(`/user/${user?.userId}/workspace/${workspaceId}/member/${selectedMember}/role`, {
  method: 'PATCH',
  body: JSON.stringify({ roleId: selectedRole }), 
});

      if (res.ok) {
        // Update the member's role locally so the UI updates instantly
        const updatedRole =
          roles.find((r) => r.id === selectedRole)?.name || "";
        setMembers(
          members.map((m) =>
            m.id === selectedMember ? { ...m, role: updatedRole } : m,
          ),
        );

        setSelectedMember("");
        setSelectedRole("");
        alert("Role assigned successfully!");
      } else {
        alert("Failed to assign role");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* --- CREATE ROLE SECTION --- */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Create New Role</h2>
        <form onSubmit={handleCreateRole} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Role Name
            </label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Project Manager, Editor..."
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create Role"}
          </button>
        </form>
      </div>

      {/* --- ASSIGN ROLE SECTION --- */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          Assign Role to Member
        </h2>
        <form
          onSubmit={handleAssignRole}
          className="flex flex-col sm:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select Member
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
              required
            >
              <option value="" disabled>
                Choose a member...
              </option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email}) - Current:{" "}
                  {member.role || "None"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
              required
            >
              <option value="" disabled>
                Choose a role...
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isAssigning}
            className="bg-blue-600 hover:bg-blue-500 w-full sm:w-auto text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {isAssigning ? "Assigning..." : "Assign Role"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleManager;
