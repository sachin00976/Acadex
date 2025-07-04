import React from 'react'

import { useDispatch } from 'react-redux'
import { NavLink,matchPath,useLocation } from 'react-router-dom'



const FacultySidebarLink = ({link}) => {


    const location  = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route)=>{
        return matchPath({path:route},location.pathname)
    }

  return (
    <NavLink to={link.path} className={ `py-2 px-4 relative md:px-8 md:py-2 text-sm font-medium transition-all duration-300 ${matchRoute(link.path) ? "bg-blue-400" :"bg-opacity-0"}`}>

        <div className='flex item-center  gap-x-2 flex-col md:flex-row'>

            <span className='hidden md:block text-xl'>{link.name}</span>
            <span className={`absolute bottom-0 left-0 md:top-0 h-[0.2rem] w-full md:h-full md:w-[0.2rem] bg-yellow-500 opacity-0 transition-all duration-300
                  ${matchRoute(link.path) ? "opacity-100": "opacity-0"}`}>
            </span>
        </div>

    </NavLink>
  )
}

export default FacultySidebarLink