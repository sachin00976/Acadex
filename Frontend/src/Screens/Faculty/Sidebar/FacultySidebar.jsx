import React from 'react'
import FacultySidebarLinks from '../../../data/FacultySidebarLinks'

import { useDispatch } from 'react-redux'
import FacultySidebarLink from './FacultySidebarLink'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const FacultySidebar = () => {
  const faculty_sidebarLinks = FacultySidebarLinks();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const userRole = pathSegments[1];

  return (
    <div className="text-black bg-richblack-500">
      <div className="hidden lg:flex h-[calc(100vh-3.5rem)] min-w-[222px] flex-col border-r border-richblack-700 bg-richblack-800 py-6 px-4 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-richblack-600 scrollbar-track-richblack-700">

        <div className="flex flex-col gap-6">
          {
            faculty_sidebarLinks.map((link) => {
              if (link.type != userRole) return null;
              return (
                <FacultySidebarLink key={link.id} link={link} />
              )
            })
          }
        </div>

      </div>
    </div>
  )
}

export default FacultySidebar
