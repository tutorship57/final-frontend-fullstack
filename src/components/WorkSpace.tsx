import React, { useEffect, useState } from "react";
import WorkSpaceItem from "./buttons/WorkSpaceItem";
import { useAuth } from "../contexts/type";
import { apiFetch } from "./utils/api";
interface WorkspaceProps{
  activeWorkSpace: string
  setActiveWorkspace: (activeId:string)=> void
}
const WorkSpace = ({activeWorkSpace, setActiveWorkspace}:WorkspaceProps)=> {
  
  const [workspaces, setWorkspaces] = useState<{ id: string; name: string }[]>([
    {
      id: "",
      name: "",
    },
  ]);
  const { user, loading } = useAuth();
  useEffect(() => {

    if (user?.userId) {
      console.log("Fetching workspaces for user:", user);
      apiFetch(`/users/${user.userId}/workspace`,  {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          // Check if data is an array before setting state
          if (Array.isArray(data)) {
            setWorkspaces(data);
          } else {
            console.error("Backend did not return an array:", data);
            setWorkspaces([]);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setWorkspaces([]);
        });
    }
    console.log(user)
  }, [user]);

  //Create workspace
  //BACKEND: need to add this user to workspace_member
  const createNewWorkspace = async () => {
    const name = prompt("Enter workspace name:");
    if (!name || !user?.userId) return;

    try {
      const response = await apiFetch(
        `/users/${user.userId}/workspace`,
        {
          method: "POST",
          headers: {  
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: name,
            // owner_id is already added by your NestJS controller, but it's fine to leave here too
            owner_id: user.userId,
          }),
        },
      );

      if (response.ok) {
        const newWs = await response.json();
        setWorkspaces((prev) => [...prev, newWs]);
        setActiveWorkspace(newWs.id);
      }else{
        const errorData = await response.json();
        console.log("Workspace: ",errorData)
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };
  if (loading) return <div>Loading...</div>;

  return (
    <aside className="w-64 h-full bg-gray-800 border-r border-gray-700 shadow-2xl flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-bold text-lg text-center tracking-wide">
          WORKSPACES
        </h2>
      </div>
      <nav className="flex-1 p-2 space-y-1 mt-4">
        {/* Use the state 'workspaces' instead of 'workspaces1' */}
        {workspaces.map((ws) => (
          <WorkSpaceItem
            key={ws.id}
            name={ws.name}
            isActive={activeWorkSpace === ws.id}
            onClick={() => setActiveWorkspace(ws.id)}
            isCreate={false}
          />
        ))}
        <WorkSpaceItem
          name={"+ Create New"}
          onClick={createNewWorkspace}
          isCreate={true}
        />
      </nav>
    </aside>
  );
};

export default WorkSpace;
