import React from 'react'
import AdminSidebarLinks from '../../../data/AdminSidebarLinks'

import { useDispatch } from 'react-redux'
import AdminSidebarLink from './AdminSidebarLink'
import { useNavigate, useLocation } from 'react-router-dom'

const AdminSidebar = () => {
  const admin_sidebarLinks = AdminSidebarLinks();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const userRole = pathSegments[1];

  return (
    <div className="text-black bg-richblack-500">
      <div className="hidden lg:flex h-[100vh] min-w-[222px] flex-col border-r border-richblack-700 bg-richblack-800 py-6 px-4 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-richblack-600 scrollbar-track-richblack-700">
        <div className="flex flex-col gap-6">
          {
            admin_sidebarLinks.map((link) => {
              if (link.type !== userRole) return null;
              return (
                <AdminSidebarLink key={link.id} link={link} />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar
