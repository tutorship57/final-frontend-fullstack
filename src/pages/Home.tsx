import { useState } from 'react'
import WorkSpace from '../components/WorkSpace'

import BoardList from '../components/BoardList'

const Home = () => {
  const [activeWorksapceId, setActiveWorkspaceId] = useState<string>("")

  return (
    // flex-row puts Sidebar and Board next to each other
    <div className='flex h-screen w-full bg-gray-900 overflow-hidden'>
      {/* Sidebar Component */}
      <WorkSpace activeWorkSpace={activeWorksapceId} setActiveWorkspace={setActiveWorkspaceId}/>

      {/* Main Content Area (Board) */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeWorksapceId ? (
          <BoardList activeWorkspaceId={activeWorksapceId} />
        ) : (
          <div className="text-white text-center mt-20">
            Please select a workspace to view boards.
          </div>
        )}
      </div>
    </div>
  ) 
}

export default Home