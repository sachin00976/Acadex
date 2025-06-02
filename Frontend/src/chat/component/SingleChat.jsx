import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { userSelectedChat } from '../../features/authSlice.js';
import { getOtherUser } from '../chatLogic/getUser.js';
import { ScrollableChat } from './ScrollableChat.jsx';
import { GroupSideBar } from './GroupSideBar.jsx';
import {io} from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../../animations/typing.json"

const ENDPOINT="http://localhost:8000"
var socket,selectedChatCompare;


function SingleChat({fetchAgain,setFetchAgain}) {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  const [openGroupSidebar, setOpenGroupSidebar] = useState(false);
  const [socketConnected,setSocketConnected]=useState(false)
  const [istyping,setIsTyping]=useState(false)
  const [typing,setTyping]=useState(false)

  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.auth.selectedChat);
  const loggedUser = useSelector((state) => state.auth.user);


   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(()=>{
    socket=io(ENDPOINT)
    socket.emit("setup",loggedUser)
    socket.on("connected",()=>setSocketConnected(true))
    socket.on("typing",()=>setIsTyping(true))
    socket.on("stop typing",()=>setIsTyping(false))
  },[]);


 const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/message/allMessage/${selectedChat._id}`);
      setMessage(response.data.data);
      socket.emit("join chat",selectedChat._id)
    } catch (error) {
      console.error('Error while fetching message:', error.message);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key !== 'Enter' || !newMessage) return;
    try {
      const response = await axios.post('/api/v1/message/sendMessage', {
        chatId: selectedChat._id,
        content: newMessage
      });
      socket.emit("newMessage",response.data.data)
      setMessage([...message, response.data.data]);
      
    } catch (error) {
      console.error('Error while sending message:', error.message);
      toast.error("Failed to send message");
    } finally {
      setNewMessage('');
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return

    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id)
    }
    let lastTpyingTime=new Date().getTime();
    var timerLength=3000
    setTimeout(()=>{
      var timeNow=new Date().getTime();
      var timeDiff=timeNow-lastTpyingTime;
      if(timeDiff>= timerLength && typing)
      {
        socket.emit("stop typing",selectedChat._id);
        setTyping(false)
      }
    },timerLength)
  };

  useEffect(() => {
    fetchMessage();
    selectedChatCompare=selectedChat
    setIsTyping(false)
    setNewMessage("")
  }, [selectedChat]);

  useEffect(()=>{
    socket.on("message recieved",(newMessage)=>{
      if(!selectedChatCompare || (selectedChatCompare._id!==newMessage.chat._id))
        {
          // give notification
        }
        else
        {
          setMessage([...message,newMessage])
        } 
    })
  })

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <p className="text-2xl md:text-3xl font-semibold text-gray-600">Click on a user to start chatting</p>
      </div>
    );
  }

  const chatPartner = !selectedChat.isGroupChat
    ? getOtherUser(selectedChat, loggedUser).user
    : null;

  return (
  !selectedChat ? (
    <div className="flex items-center justify-center h-full w-full bg-white rounded-lg shadow-md text-gray-500 text-xl">
      No chat selected
    </div>
  ) : (
    <div className="relative flex flex-col h-full w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b bg-gray-100">
        <button className="md:hidden text-gray-600" onClick={() => dispatch(userSelectedChat(""))}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate">
          {chatPartner
            ? `${chatPartner.firstName} ${chatPartner.middleName ?? ""} ${chatPartner.lastName}`
            : selectedChat.chatName}
        </h2>
        {!chatPartner && (
          <button 
            onClick={() => setOpenGroupSidebar((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        )}
      </div>

      {/* Chat Content */}
      <div className="flex flex-1 min-h-0">
        <div className={`flex-1 overflow-hidden transition-all duration-300 ${openGroupSidebar ? 'w-3/5' : 'w-full'}`}>
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : (
            <div className="h-full">
              <ScrollableChat messages={message} loggedUser={loggedUser} />
            </div>
          )}
        </div>

        {/* Group Sidebar */}
        {!chatPartner && (
          <div className={`flex-shrink-0 h-full bg-white border-l transition-all duration-300 overflow-y-auto ${openGroupSidebar ? 'w-3/5' : 'w-0'}`}>
            {openGroupSidebar && (
              <GroupSideBar
                setOpenGroupSidebar={setOpenGroupSidebar}
                setFetchAgain={setFetchAgain}
                setMessage={setMessage}
              />
            )}
          </div>
        )}
      </div>

      {/* Message Input */}
      {istyping?(
              <div>
                  <Lottie
                    options={defaultOptions}
                     //height={50}
                    width={50}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              
      ):(<></>)}
      <div className="flex-shrink-0 p-3 border-t bg-white">
        <input
          type="text"
          placeholder="Type a message and hit Enter"
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={sendMessage}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  )
);

}

export default SingleChat;