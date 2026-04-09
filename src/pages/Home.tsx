import { useEffect, useState } from 'react'
import WorkSpace from '../components/WorkSpace'

import BoardList from '../components/BoardList'
import { apiFetch } from '../components/utils/api';
import { useAuth } from '../contexts/type';

const Home = () => {
  const [activeId, setActiveId] = useState<string>("");
  const { user } = useAuth();
  return (
   <div className='flex h-screen w-full bg-gray-900 overflow-hidden'>
      <WorkSpace activeWorkSpace={activeId} setActiveWorkspace={setActiveId} />

      <div className="flex-1 overflow-y-auto p-6">
        {activeId ? (
          user?.role === "admin" ? (
            // ADMIN: Fetch and show all workspaces for the selected Company ID
            <AdminWorkspaceList companyId={activeId} />
          ) : (
            // USER: Show boards for the selected Workspace
            <BoardList activeWorkspaceId={activeId} />
          )
        ) : (
          <div className="text-white text-center mt-20">
            {user?.role === 'admin' ? "Select a Company to view their Workspaces" : "Select a Workspace"}
          </div>
        )}
      </div>
    </div>
  ) 
}
const AdminWorkspaceList = ({ companyId }: { companyId: string }) => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  useEffect(() => {
    // Admin calls the same endpoint but passes the Company's ID
    apiFetch(`/users/${companyId}/workspace`)
      .then((res) => res.json())
      .then((data) => setWorkspaces(data));
  }, [companyId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspaces.map(ws => (
        <div key={ws.id} className="p-4 bg-gray-800 border border-gray-700 rounded-xl text-white">
          <h3 className="font-bold">{ws.name}</h3>
          <p className="text-xs text-gray-400 mt-2">Owner ID: {companyId}</p>
        </div>
      ))}
    </div>
  );
};
export default Home