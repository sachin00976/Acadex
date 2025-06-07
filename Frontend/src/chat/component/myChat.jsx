import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { userSelectedChat, userChat } from '../../features/authSlice.js';
import { getOtherUser } from '../chatLogic/getUser.js';
import SearchSideBar from './searchSideBar.jsx';
import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import { CreateGroup } from './CreateGroup.jsx';
function MyChat({fetchAgain,setFetchAgain}) {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.auth.chats);
  const selectedChat = useSelector((state) => state.auth.selectedChat);
  const [loading, setLoading] = useState(false);
  const loggedUser = useSelector((state) => state.auth.user);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [openCreateGroup,setOpenCreateGroup]=useState(false);
  

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/chat/fetchChat`);
      dispatch(userChat({ chats: response.data.data }));
    } catch (error) {
      console.error("Error while fetching chat:", error.message);
      toast.error(error.response?.data?.message || "Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  const fetchChatsDebounced = useCallback(
  debounce(() => {
    fetchChats();
  }, 300),
  []
);

useEffect(() => {
  fetchChatsDebounced();
}, [fetchAgain]);

  return (
    <div className="relative flex h-full max-h-screen overflow-hidden">
      {/* Main Chat Container */}
      <div className={`flex flex-col h-full transition-all duration-300 ${searchBarOpen ? 'w-3/5' : 'w-full'} p-4 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setSearchBarOpen(!searchBarOpen)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Search User
          </button>
          <h3 className="text-2xl font-semibold text-center flex-1">My Chats</h3>
          <button 
            onClick={() => setOpenCreateGroup(!openCreateGroup)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Create Group
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : !chats || chats.length === 0 ? (
          <div className="text-center">
            <h3 className="text-gray-600">No chats yet</h3>
          </div>
        ) : (
          chats.map((chat) => {
            const user = getOtherUser(chat, loggedUser)?.user;

            return chat.isGroupChat ? (
              <div
                key={chat._id}
                className={`flex items-center gap-4 border p-4 rounded-xl shadow-sm mb-4 ${selectedChat && selectedChat?._id===chat._id? "bg-green-400":"bg-white"}  hover:shadow-md transition cursor-pointer`}
                onClick={() => {
                  dispatch(userSelectedChat({ selectedChat: chat }))
                  console.log("myChat",selectedChat)
                }}
              >
                <img
                  src={chat?.profile?.url|| '/default-group.png'}
                  alt={chat.chatName}
                  className="w-16 h-16 object-cover rounded-full border border-gray-300"
                />
             <div className="flex flex-col px-2 py-1  rounded-lg transition duration-200">
            <p className="font-semibold text-base text-gray-900 truncate">{chat.chatName}</p>
            <p className="text-sm  text-gray-600 truncate italic max-w-xs">{chat.latestMessage ? chat.latestMessage.content : ""}</p>
          </div>

              </div>
            ) : (
              <div
                key={user?._id}
                className={`flex items-center gap-4 border p-4 rounded-xl shadow-sm mb-4 ${selectedChat && selectedChat._id===chat._id? "bg-green-400":"bg-white"} hover:shadow-md transition cursor-pointer`}
                onClick={() => {
                  dispatch(userSelectedChat({ selectedChat: chat }))
                  console.log(selectedChat)
                }}
              >
                <img
                  src={user?.profile?.url || '/default-avatar.png'}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-16 h-16 object-cover rounded-full border border-gray-300"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-lg text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm  text-gray-600 truncate italic max-w-xs">{`${chat.latestMessage?(chat.latestMessage.content):("")}`}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Search Sidebar */}
      <div className={`absolute top-0 right-0 h-full w-[100%] bg-white shadow-lg transition-all duration-300 transform ${searchBarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <SearchSideBar  setFetchAgain={setFetchAgain} searchBarOpen={searchBarOpen} setSearchBarOpen={setSearchBarOpen} />
      </div>
      {/* create Group */}
      <div>
        {openCreateGroup && <CreateGroup setOpenCreateGroup={setOpenCreateGroup}/>}
      </div>
    </div>
  );
}

export default MyChat;