import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import { useEffect } from 'react';
import DashComments from '../components/DashComments';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import Warehouse from './Warehouse';
function Dashboard() {
   const location=useLocation();
   const [tab,setTab]=useState("");
   useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    const tabFromURL=urlParams.get('tab')
    if(tabFromURL){
      setTab(tabFromURL)
    }

   },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'comments' && <DashComments />}
      {tab=== 'dash'  && <DashboardComp/>}
      {tab=== 'orders'  && <Warehouse/>}
      
    </div>
  )
}

export default Dashboard