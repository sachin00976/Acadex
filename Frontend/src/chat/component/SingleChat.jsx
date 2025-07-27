import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";
import Lottie from "react-lottie";

import { userSelectedChat, setNotifications, addNotification } from '../../features/authSlice.js'; // HIGHLIGHT: Import addNotification
import { getOtherUser } from '../chatLogic/getUser.js';
import { ScrollableChat } from './ScrollableChat.jsx';
import { GroupSideBar } from './GroupSideBar.jsx';
import { EditGroup } from './EditGroup.jsx';
import animationData from "../../animations/typing.json";

const ENDPOINT = "http://localhost:8000";
let socket;
let selectedChatCompare; // This variable will be removed in favor of direct state access in useEffect dependencies.

function SingleChat({ fetchAgain, setFetchAgain }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [openGroupSidebar, setOpenGroupSidebar] = useState(false);
    const [openEditGroup, setOpenEditGroup] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);

    const dispatch = useDispatch();
    const { selectedChat, user: loggedUser, notifications } = useSelector((state) => state.auth); // HIGHLIGHT: Destructure notifications

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    // Socket setup and cleanup
    useEffect(() => {
        if (loggedUser) {
            socket = io(ENDPOINT);
            socket.emit("setup", loggedUser);
            socket.on("connected", () => setSocketConnected(true));
            socket.on("typing", () => setIsTyping(true));
            socket.on("stop typing", () => setIsTyping(false));
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, [loggedUser]);

    // Handle incoming messages from socket
    useEffect(() => {
        if (!socket) return;

        const messageReceivedHandler = (newMessageReceived) => {
            // HIGHLIGHT START
            // Check if the received message is for the currently selected chat
            if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
                // If not, add it to the Redux notification state
                dispatch(addNotification(newMessageReceived));
                // setFetchAgain(!fetchAgain); // This might not be strictly necessary here if ChatList is reacting to Redux chat state changes
            } else {
                // If it is for the current chat, just display the message
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
                // Immediately mark notifications for this chat as read since the user is viewing it
                markAsRead(newMessageReceived.chat._id);
            }
            // HIGHLIGHT END
        };

        socket.on("message recieved", messageReceivedHandler);

        return () => {
            if (socket) {
                socket.off("message recieved", messageReceivedHandler);
            }
        };
    }, [selectedChat, dispatch, notifications]); // HIGHLIGHT: Add selectedChat and notifications to dependencies

    // Fetch messages for the selected chat
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat || selectedChat===null) return;
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/v1/message/allMessage/${selectedChat._id}`);
                setMessages(data.data);
                if (socket) {
                    socket.emit("join chat", selectedChat._id);
                }
                // HIGHLIGHT START
                // Mark notifications as read when a chat is explicitly opened/selected
                await markAsRead(selectedChat._id);
                // HIGHLIGHT END
            } catch (error) {
                toast.error("Failed to load messages");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        // HIGHLIGHT START
        // selectedChatCompare = selectedChat; // This global variable is no longer needed
        // HIGHLIGHT END
        setNewMessage("");
    }, [selectedChat]);


    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/v1/notifications');
            dispatch(setNotifications(data.data));
        } catch (error) {
            console.error("Could not fetch notifications", error);
        }
    };

    const markAsRead = async (chatId) => {
        if (!chatId) return;
        try {
            await axios.put('/api/v1/notifications/read', { chatId });
            fetchNotifications(); // Refetch to update the notification count/list in Redux
        } catch (error) {
            console.error("Could not mark notifications as read", error);
        }
    };

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            if (socket) {
                socket.emit("stop typing", selectedChat._id);
            }
            try {
                const { data } = await axios.post('/api/v1/message/sendMessage', {
                    chatId: selectedChat._id,
                    content: newMessage,
                });
                setNewMessage("");
                socket.emit("newMessage", data.data);
                setMessages((prevMessages) => [...prevMessages, data.data]);
            } catch (error) {
                toast.error("Failed to send message");
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected || !selectedChat) return;
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        const lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    if (!selectedChat || selectedChat===null) {
        return (
            <div className="flex items-center justify-center h-full text-center">
                <p className="text-2xl md:text-3xl font-semibold text-gray-600">Click on a user to start chatting</p>
            </div>
        );
    }

    const chatPartner = !selectedChat.isGroupChat
        ? getOtherUser(selectedChat, loggedUser) // getOtherUser should return the full user object, not user.user
        : null;

    return (
        <div className="relative flex flex-col h-full w-full bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b bg-gray-100">
                <button className="md:hidden text-gray-600" onClick={() => dispatch(userSelectedChat(null))}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                    {chatPartner
                        ? `${chatPartner.firstName ?? ''} ${chatPartner.middleName ?? ''} ${chatPartner.lastName ?? ''}`.trim()
                        : selectedChat.chatName}
                </h2>
                {!chatPartner && (
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setOpenEditGroup(true)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onClick={() => setOpenGroupSidebar((prev) => !prev)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>
                    </div>
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
                            <ScrollableChat messages={messages} />
                        </div>
                    )}
                </div>
                {!chatPartner && (
                    <div className={`flex-shrink-0 h-full bg-white border-l transition-all duration-300 ${openGroupSidebar ? 'w-2/5' : 'w-0'}`}>
                        {openGroupSidebar && (
                            <GroupSideBar
                                setOpenGroupSidebar={setOpenGroupSidebar}
                                setFetchAgain={setFetchAgain}
                                setMessage={setMessages}
                            />
                        )}
                    </div>
                )}
            </div>
            {/* Message Input */}
            {isTyping && (
                <div>
                    <Lottie options={defaultOptions} width={50} style={{ marginBottom: 15, marginLeft: 0 }} />
                </div>
            )}
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
            {/* Edit Group Modal */}
            {openEditGroup && <EditGroup setOpenEditGroup={setOpenEditGroup} />}
        </div>
    );
}

export default SingleChat;