import React from 'react';
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { useDispatch, useSelector,} from 'react-redux';
import { userLoggedOut } from '../features/authSlice.js';
import { FiBell } from "react-icons/fi";
import { markAllRead } from '../features/authSlice.js';
import { useState } from 'react';
const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  //console.log(pathSegments);
  const userRole = pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1);


  const route = router.state?.type?.toLowerCase();
  // console.log(route);
  const [showDropdown, setShowDropdown] = useState(false);
  const { unreadCount, notifications } = useSelector((state) => state.auth);
  const handleLogout = () => {
    // Dispatch the logout action to clear state
    dispatch(userLoggedOut()); // Clears auth state + localStorage

    // Redirect to home/login
    navigate('/');
  };
  return (
    <div className="shadow-md px-6 py-4">
      <div className="max-w-6xl flex justify-between items-center mx-auto">
        <p
          className="font-semibold text-2xl flex justify-center items-center cursor-pointer"
          onClick={() => navigate(`/${route}`)}
        >
          <span className='mr-2'>
            <RxDashboard />
          </span>
          {userRole}  Dashboard
        </p>
        <div className="flex items-center space-x-4 relative">
          {/* 🔔 Notification Bell Icon */}
          <div
            className="relative cursor-pointer"
            onClick={() => {
              setShowDropdown(!showDropdown);
              if(showDropdown) dispatch(markAllRead());
            }}
          >
            <FiBell className="text-gray-700 text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {showDropdown && (
            <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md w-64 p-2 z-50">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No new notifications</p>
              ) : (
                notifications.map((notif, index) => (
                  <div key={index} className="p-2 border-b text-sm text-gray-700">
                    <strong>{notif.senderName}</strong>: {notif.messagePreview}
                  </div>
                ))
              )}
            </div>
          )}

          <button
            className="flex justify-center items-center text-red-500 px-3 py-2 font-semibold rounded-sm"
            onClick={handleLogout}
          >
            Logout
            <span className='ml-2'>
              <FiLogOut />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
