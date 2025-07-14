import React, { useState, useEffect } from 'react';
import { FiLogOut, FiBell } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { userLoggedOut, setNotifications, userSelectedChat } from '../features/authSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // HIGHLIGHT START: notifications is directly read from Redux state
    const { notifications, isAuthenticated, user: loggedUser } = useSelector((state) => state.auth);
    // HIGHLIGHT END

    const [showDropdown, setShowDropdown] = useState(false);

    const pathSegments = location.pathname.split("/");
    const userRole = pathSegments[1] ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1) : 'Dashboard';

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/v1/notifications');
            dispatch(setNotifications(response.data.data));
        } catch (error) {
            toast.error("Could not fetch notifications");
        }
    };

    const markChatNotificationsAsRead = async (chatId) => {
        try {
            await axios.put('/api/v1/notifications/read', { chatId });
            fetchNotifications(); // Refresh notifications after marking as read
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
        }
    };

    // HIGHLIGHT START: Initial fetch only when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
        }
    },);
    // HIGHLIGHT END
    // NOTE: This useEffect only runs on initial mount and when isAuthenticated changes.
    // If a new notification comes via WebSocket and updates Redux, this useEffect won't re-run.
    // However, the `notifications` array from useSelector *will* update, triggering a re-render.

    const handleNotificationClick = (notification) => {
        dispatch(userSelectedChat({ selectedChat: notification.chat }));

        let chatPath = '/';
        if (loggedUser && loggedUser.role) {
            switch (loggedUser.role.toLowerCase()) {
                case 'admin':
                    chatPath = `/admin/chat/${loggedUser._id}`;
                    break;
                case 'faculty':
                    chatPath = `/faculty/chat/${loggedUser._id}`;
                    break;
                case 'student':
                    chatPath = `/student/chat/${loggedUser.enrollment_no}`;
                    break;
                default:
                    chatPath = '/';
            }
        }

        navigate(chatPath);

        // Mark notifications related to this chat as read when clicked
        markChatNotificationsAsRead(notification.chat._id);

        setShowDropdown(false);
    };

    const handleLogout = () => {
        dispatch(userLoggedOut());
        navigate('/');
    };

    // HIGHLIGHT START: unreadCount correctly reflects the current Redux state of notifications
    const unreadCount = notifications.filter(n => !n.isRead).length;
    // HIGHLIGHT END

    return (
        <div className="shadow-md px-6 py-4">
            <div className="max-w-6xl flex justify-between items-center mx-auto">
                <p className="font-semibold text-2xl flex justify-center items-center cursor-pointer"
                   onClick={() => navigate(`/${loggedUser?.role?.toLowerCase()}/profile/${loggedUser?._id || loggedUser?.enrollment_no}`)}>
                    <span className='mr-2'><RxDashboard /></span>
                    {userRole} Dashboard
                </p>
                <div className="flex items-center space-x-4 relative">
                    {/* Notification Bell Icon */}
                    <div className="relative cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                        <FiBell className="text-gray-700 text-xl" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>

                    {/* Notification Dropdown */}
                    {showDropdown && (
                        <div className="absolute top-10 right-0 w-80 bg-white rounded-md shadow-lg border z-10">
                            <div className="p-3 border-b">
                                <h3 className="font-semibold text-lg">Notifications</h3>
                            </div>
                            <ul className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <li key={notif._id} // Using notif._id as key
                                            className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b ${!notif.isRead ? 'bg-blue-50' : ''}`}
                                            onClick={() => handleNotificationClick(notif)}>
                                            <p className="font-bold">{`New message in ${notif.chat.isGroupChat ? notif.chat.chatName : notif.sender.firstName}`}</p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">{notif.sender.firstName}: </span>
                                                {/* HIGHLIGHT START: Ensure notif.message.content is accessed */}
                                                {notif.message?.content?.length > 30 ? notif.message.content.substring(0, 27) + "..." : notif.message?.content}
                                                {/* HIGHLIGHT END */}
                                            </p>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-3 text-center text-gray-500">
                                        No new notifications
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    <button className="flex justify-center items-center text-red-500 px-3 py-2 font-semibold rounded-sm" onClick={handleLogout}>
                        Logout <span className='ml-2'><FiLogOut /></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;