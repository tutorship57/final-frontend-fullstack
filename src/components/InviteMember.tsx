import React, { useState, useEffect } from "react";
import { apiFetch } from "./utils/api";
import { useAuth } from "../contexts/type";

interface InviteMemberProps {
  workspaceId: string;
  workspaceOwnerId: string;
  roles: { id: string; name: string }[];
  onMemberAdded: () => void; // Callback to refresh member list
}

const InviteMember = ({ workspaceId, workspaceOwnerId, roles, onMemberAdded }: InviteMemberProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      // Owners always have permission
      if (user?.userId === workspaceOwnerId) {
        setCanManage(true);
        return;
      }

      // Check permissions for normal members
      try {
        const res = await apiFetch(`/users/${user?.userId}/workspace/${workspaceId}/members`);
        if (res.ok) {
          const members = await res.json();
          const me = members.find((m: any) => m.user?.id === user?.userId);
          const hasPerm = me?.roles?.some((role: any) =>
            role.permissions?.some((p: any) => p.name === "Manage-Member")
          );
          setCanManage(!!hasPerm);
        }
      } catch (err) {
        console.error("Permission check failed", err);
      }
    };

    if (user?.userId) checkPermission();
  }, [workspaceId, user?.userId, workspaceOwnerId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedRole) return;

    setLoading(true);
    try {
      const res = await apiFetch(
        `/users/${user?.userId}/workspace/${workspaceId}/members/invite`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            roleIds: [selectedRole],
          }),
        }
      );

      if (res.ok) {
        alert("Member added successfully!");
        setEmail("");
        setSelectedRole("");
        onMemberAdded(); // Refresh the list in the parent component
      } else {
        const error = await res.json();
        alert(error.message || "Invitation failed");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Only render if the user has permission
  if (!canManage) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mt-6">
      <h3 className="text-white font-bold mb-4">Add Member</h3>
      <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="text-gray-400 text-sm block mb-1">User Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-amber-500"
            placeholder="user@example.com"
            required
          />
        </div>
        <div className="w-full md:w-48">
          <label className="text-gray-400 text-sm block mb-1">Assign Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-amber-500"
            required
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 transition-colors"
        >
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default InviteMember;