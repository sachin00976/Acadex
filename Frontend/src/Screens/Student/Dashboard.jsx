import React from 'react'
import { useSelector } from 'react-redux'
import {Outlet} from "react-router-dom"
import Sidebar from './Sidebar/Sidebar'
import Navbar from '../../components/Navbar'


const Dashboard = () => {
  return (
    <>
    <Navbar/>
    <div className='relative flex bg-richblack-400'>
      <Sidebar/>
        <div className=' flex-1 overflow-auto bg-richblack-900'>
            <div className='py-10'>
                <Outlet/>
            </div>
        </div>
    </div>
    </>
  )
}

export default Dashboard