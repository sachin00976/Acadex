import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSelectedChat } from '../../features/authSlice.js';
import toast from 'react-hot-toast';
import axios from 'axios';
import AddGroupMember from './AddGroupMember.jsx';


function GroupSideBar({ setOpenGroupSidebar,setFetchAgain,setMessage }) {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.auth.selectedChat);
  const [openAddMember, setOpenAddMember] = useState(false);
  const loggedUser=useSelector((state)=>state.auth.user)
  

  const leaveHandler=async()=>{
    try {
      const config={
        method:"put",
        data:{
          chatId:selectedChat._id
        }
      }
      const response=await axios("/api/v1/chat/leaveGroup",config)
      toast.success("Successfully left the group")
      dispatch(userSelectedChat({selectedChat:null}))
      setOpenGroupSidebar(false)
      setFetchAgain((prev)=>!prev)
      setMessage(null)
      
    } catch (error) {
      console.log("error while leaving the group",error.message)
      toast.error("Failed to leave the group")
    }
  }
  const removeHandler = async (user) => {
    if (!user) return;
    try {
      const config = {
        method: 'put',
        data: {
          chatId: selectedChat._id,
          memberToRemove: {
            user: user._id,
            userModel: user.role,
          },
        },
      };
      const response = await axios('/api/v1/chat/removeMemeber', config);
      console.log(selectedChat)
      await dispatch(userSelectedChat({ selectedChat: response.data.data }));
      toast.success('Member removed successfully');
      setFetchAgain((prev)=>!prev)

    } catch (error) {
      console.error('Error while removing member:', error.message);
      toast.error('Failed to remove member');
    }
  };

  if (!selectedChat?.isGroupChat) return null;

  const admin = selectedChat.admin;

  return (
    <>
      <div className="w-full h-full border-r border-gray-200 bg-gray-50 p-6 min-h-screen relative overflow-y-auto">

        {/* Slide-over to add member */}
        <div
          className={`absolute top-0 right-0 h-full w-full  bg-white shadow-lg z-50 transition-transform duration-300 transform ${
            openAddMember ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <AddGroupMember setOpenAddMember={setOpenAddMember} setFetchAgain={setFetchAgain} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Group Members</h2>
          <button
            onClick={() => setOpenGroupSidebar(false)}
            className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Close <span className="ml-2 text-lg font-bold">×</span>
          </button>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          {loggedUser._id===admin._id && <button
            onClick={() => setOpenAddMember(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Add Member
          </button>}
          <button
            onClick={()=>leaveHandler()}
            className="px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Leave Group
          </button>
        </div>

        {/* Admin Card */}
        <div
          key={admin._id}
          className="flex gap-4 p-4 mb-4 mt-2 bg-white rounded-xl shadow hover:shadow-md transition-all"
        >
          <img
            src={admin.profile?.url || '/default-avatar.png'}
            alt={`${admin.firstName} ${admin.lastName}`}
            className="w-20 h-20 rounded-full object-cover border border-gray-300"
          />
          <div className="flex flex-col justify-between text-gray-700">
            <p className="text-lg font-bold text-gray-900">
              {admin.firstName} {admin.middleName || ''} {admin.lastName}
            </p>
            <p className="text-indigo-600 font-medium">Role: {admin.role}</p>
            <p className="text-sm truncate">Email: {admin.email}</p>
            <p className="text-xs text-gray-500">ID: {admin.employeeId}</p>
            <span className="text-green-600 font-bold mt-1">Admin</span>
          </div>
        </div>

        {/* Other Members */}
        {selectedChat.users.map(({ user }) => {
          if (user._id === admin._id) return null;
          console.log(selectedChat.users)
          return (
          <div
            key={user._id}
            className="flex gap-4 items-center p-4 mb-4 bg-white rounded-xl shadow hover:shadow-md transition-all"
          >
            <img
              src={user.profile?.url || '/default-avatar.png'}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />
            <div className="flex-1 text-gray-700">
              <p className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.middleName || ''} {user.lastName}
              </p>
              <p className="text-indigo-600 font-medium">Role: {user.role}</p>
              <p className="text-sm truncate">Email: {user.email}</p>
              <p className="text-xs text-gray-500">ID: {user.employeeId}</p>
              <span className="text-black font-bold">Member</span>
            </div>
            
             {admin._id==loggedUser._id && <button
              onClick={() => removeHandler(user)}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
              title="Remove Member"
            >
              ✕
            </button>}
            
          </div>
          );
        })}

        
      </div>
    </>
  );
}

export { GroupSideBar };
