import React, { useState, useEffect } from "react";
import { apiFetch } from "./utils/api";
import { useAuth } from "../contexts/type";


interface Role {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  name: string;
}

interface RoleManagerProps {
  workspaceId: string;
  onRoleCreated?: () => void;
}

const RoleManager = ({ workspaceId, onRoleCreated }: RoleManagerProps) => {
  const { user } = useAuth();

  // --- State ---
  const [members, setMembers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Create Role State
  const [newRoleName, setNewRoleName] = useState("");
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Assign Role State
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // --- Fetch Initial Data ---
  useEffect(() => {
    const loadData = async () => {
      if (!user?.userId || !workspaceId) return;
      try {
        const [rolesRes, membersRes, permissionRes] = await Promise.all([
          apiFetch(`/users/${user.userId}/workspace/${workspaceId}/roles`),
          apiFetch(`/users/${user.userId}/workspace/${workspaceId}/members`),
          apiFetch(`/permissions`),
        ]);

        if (rolesRes.ok) setRoles(await rolesRes.json());
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData);
          console.log("Member Data: ", membersData);
        }
        if (permissionRes.ok)
          setAvailablePermissions(await permissionRes.json());
      } catch (error) {
        console.error("Failed to load roles, members, or permissions", error);
      }
    };

    loadData();
  }, [workspaceId, user?.userId]);

  // --- Handlers ---
  const handleCreateRole = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRoleName.trim() || !user?.userId) return;
    setIsCreating(true);
    try {
      const res = await apiFetch(
        `/users/${user.userId}/workspace/${workspaceId}/roles`,
        {
          method: "POST",
          body: JSON.stringify({
            name: newRoleName,
            workspace_id: workspaceId, // FIXED: Added workspace_id to the body
            permissions: selectedPermissions,
          }),
        },
      );

      if (res.ok) {
        const newRole = await res.json();
        setRoles([...roles, newRole]);
        if (onRoleCreated) onRoleCreated();
        setNewRoleName("");
        setSelectedPermissions([]);
        alert("Role created successfully!");
      } else {
        // If it's still 400, this alert will show you the specific validation error
        const errorData = await res.json();
        console.error("Validation Error:", errorData);
        alert(`Failed to create role: ${errorData.message || "Bad Request"}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssignRole = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMember || !selectedRole || !user?.userId) return;

    setIsAssigning(true);
    try {
      // FIXED URL: Ensure it matches @Patch('workspace/:workspaceId/member/:member_id/role')
      // Note: Changed /user/ to /users/ and /roles to /role
      const res = await apiFetch(
        `/users/${user.userId}/workspace/${workspaceId}/member/${selectedMember}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ roleId: selectedRole }),
        },
      );

      if (res.ok) {
        const updatedRoleName =
          roles.find((r) => r.id === selectedRole)?.name || "";
        setMembers(
          members.map((m) =>
            m.id === selectedMember ? { ...m, role: updatedRoleName } : m,
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
  const handleTest = () => {
    console.log("Members: ", members);
    console.log("Roles: ", roles);
    console.log("Available Permissions: ", availablePermissions);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* --- CREATE ROLE SECTION --- */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Create New Role</h2>
        <form onSubmit={handleCreateRole} className="space-y-4">
          <div className="flex gap-4 items-end">
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
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 h-[42px]"
            >
              {isCreating ? "Creating..." : "Create Role"}
            </button>
          </div>

          {/* --- PERMISSION CHECKBOXES --- */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Assign Permissions to this Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-900 p-4 rounded-lg border border-gray-600 max-h-40 overflow-y-auto">
              {availablePermissions.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([
                          ...selectedPermissions,
                          perm.id,
                        ]);
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter((id) => id !== perm.id),
                        );
                      }
                    }}
                    className="rounded border-gray-700 text-amber-600 focus:ring-amber-500 bg-gray-800"
                  />
                  <span className="text-sm">{perm.name}</span>
                </label>
              ))}
              {availablePermissions.length === 0 && (
                <span className="text-gray-500 text-sm italic">
                  No permissions found.
                </span>
              )}
            </div>
          </div>
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
                  {member.user?.name} ({member.user?.email}) — Current:{" "}
                  {/* Map through the roles array to get names, then join them with a comma */}
                  {member.roles && member.roles.length > 0
                    ? member.roles.map((r: any) => r.name).join(", ")
                    : "No Roles"}
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
          <button onClick={handleTest}>tests</button>
        </form>
      </div>
    </div>
  );
};

export default RoleManager;
