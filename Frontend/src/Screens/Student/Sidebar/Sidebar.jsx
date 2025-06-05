import React from 'react'
// import { student_sidebarLinks } from '../../../data/dashboard_link'
import Student_link from '../../../data/Sudent_link'
import { useDispatch,useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


const Sidebar = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split("/");
    //console.log(pathSegments);
    const userRole = pathSegments[1]; 
    const student_sidebarLinks = Student_link();

    
  return (
    <div className=' text-black bg-richblack-500'>
      <div className='hidden min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 lg:flex h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>

          <div className='flex flex-col gap-7'>
              {
                student_sidebarLinks.map((link)=>{
                    // console.log("link.type:", link.type, "| userRole:", userRole);
                  if(link.type!=userRole) return null;
                  return (
                    <SidebarLink key={link.id} link={link}/>
                  )
                })
              }
          </div>

          
      </div>


    </div>
  )
}

export default Sidebar
