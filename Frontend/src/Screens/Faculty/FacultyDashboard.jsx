import React from 'react'
import {Outlet} from "react-router-dom"
import FacultySidebar from './Sidebar/FacultySidebar'
import Navbar from '../../components/Navbar'


const FacultyDashboard = () => {
  return (
    <>
    <Navbar/>
    <div className='relative flex bg-richblack-400'>
      <FacultySidebar/>
        <div className=' flex-1 overflow-auto bg-richblack-900'>
            <div className='py-10'>
                <Outlet/>
            </div>
        </div>
    </div>
    </>
  )
}

export default FacultyDashboard