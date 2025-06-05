import React from 'react';
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { userLoggedOut } from '../features/authSlice.js';

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
      //console.log(pathSegments);
  const userRole = pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1);


  const route = router.state?.type?.toLowerCase();
  console.log(route);

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
  );
};

export default Navbar;
