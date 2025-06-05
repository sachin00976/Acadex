import React from 'react'
import { faculty_sidebarLinks} from '../../../data/dashboard_link'

import { useDispatch} from 'react-redux'
import FacultySidebarLink from './FacultySidebarLink'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


const FacultySidebar = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split("/");
    //console.log(pathSegments);
    const userRole = pathSegments[1]; 


    
  return (
    <div className=' text-black bg-richblack-500'>
      <div className='hidden min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 lg:flex h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>

          <div className='flex flex-col gap-7'>
              {
                faculty_sidebarLinks.map((link)=>{
                    // console.log("link.type:", link.type, "| userRole:", userRole);
                  if(link.type!=userRole) return null;
                  return (
                    <FacultySidebarLink key={link.id} link={link}/>
                  )
                })
              }
          </div>

          
      </div>


    </div>
  )
}

export default FacultySidebar
