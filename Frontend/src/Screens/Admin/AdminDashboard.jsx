import React from 'react'
import {Outlet} from "react-router-dom"
import AdminSidebar from './Sidebar/AdminSidebar'
import Navbar from '../../components/Navbar'


const AdminDashboard = () => {
  return (
    <>
    <Navbar/>
    <div className='relative flex bg-richblack-400'>
      <AdminSidebar/>
        <div className=' flex-1 overflow-auto bg-richblack-900'>
            <div className='py-10'>
                <Outlet/>
            </div>
        </div>
    </div>
    </>
  )
}

export default AdminDashboard