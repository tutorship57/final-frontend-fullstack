import React, { useState } from 'react'
import WorkSpaceItem from './buttons/WorkSpaceItem';


const WorkSpace = () => {
  const [activeId, setActiveId] = useState<number | null>(1);
  const createNewWorkspace = () =>{

  }
  const workspaces = [
    { id: 1, name: "Marketing Team" },
    { id: 2, name: "Dev Project A" },
    { id: 3, name: "Personal Tasks" }
  ];

  return (
    <aside className='w-64 h-full bg-gray-800 border-r border-gray-700 shadow-2xl flex flex-col'>
      <div className='p-4 border-b border-gray-700'>
        <h2 className='text-white font-bold text-lg text-center tracking-wide'>WORKSPACES</h2>
      </div>

      <nav className='flex-1 p-2 space-y-1 mt-4'>
        {workspaces.map((ws) => (
          <WorkSpaceItem 
            key={ws.id}
            name={ws.name}
            isActive={activeId === ws.id}
            onClick={() => setActiveId(ws.id)} 
            isCreate={false}          />
        ))}
         <WorkSpaceItem name={"+ Create New"} onClick={createNewWorkspace} isCreate={true} />
      </nav>
       
     
    </aside>
  )
}

export default WorkSpace;