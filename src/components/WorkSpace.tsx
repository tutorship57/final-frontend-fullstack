import { useEffect, useState } from "react";
import WorkSpaceItem from "./buttons/WorkSpaceItem";
import { useAuth } from "../contexts/type";
import { apiFetch } from "./utils/api";
interface WorkspaceProps{
  activeWorkSpace: string
  setActiveWorkspace: (activeId:string)=> void
}
const WorkSpace = ({activeWorkSpace, setActiveWorkspace}:WorkspaceProps)=> {
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [, setWorkspaces] = useState<{ id: string; name: string }[]>([
    {
      id: "",
      name: "",
    },
  ]);
  const { user, loading } = useAuth();
 useEffect(() => {
    if (!user) return;

    // Admin fetches Companies; Users fetch their own Workspaces
    const endpoint = user.role === 'admin' 
      ? `/user?role=company` // Backend needs to support filtering users by role
      : `/users/${user.userId}/workspace`; 

    apiFetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.email || item.name, // Show company email as the label
        }));
        setItems(formatted);
      });
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
        alert("Failed to create workspace")
        console.log("Workspace: ",errorData)
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };
  if (loading) return <div>Loading...</div>;

  return (
    <aside className="w-64 h-full bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 text-white font-bold text-center">
        {user?.role === 'admin' ? "COMPANIES" : "WORKSPACES"}
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => (
          <WorkSpaceItem
            key={item.id}
            name={item.name}
            isActive={activeWorkSpace === item.id}
            onClick={() => setActiveWorkspace(item.id)} isCreate={false}/>
        ))}
        {user?.role === "company" && (
          <WorkSpaceItem
            name="+ Create Workspace"
            onClick={createNewWorkspace}
            isCreate={true}
          />
        )}
      </nav>
    </aside>
  );
};

export default WorkSpace;
