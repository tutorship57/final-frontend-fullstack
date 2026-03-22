import React from 'react'
import WorkSpace from '../components/WorkSpace'

import BoardList from '../components/BoardList'

const Home = () => {
  return (
    // flex-row puts Sidebar and Board next to each other
    <div className='flex h-screen w-full bg-gray-900 overflow-hidden'>
      {/* Sidebar Component */}
      <WorkSpace />

      {/* Main Content Area (Board) */}
      <div className="flex-1 overflow-y-auto p-6">
        <BoardList />
      </div>
    </div>
  ) 
}

export default Home