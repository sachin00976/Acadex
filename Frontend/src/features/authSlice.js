import { createSlice } from "@reduxjs/toolkit";

// Load stored data from localStorage (if any)
const storedUser = localStorage.getItem("user");
const storedRole = localStorage.getItem("role");
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  role: storedRole || null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  selectedChat:null,
  chats:null,
  notifications: [],
  unreadCount: 0
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      const { user, role, token } = action.payload;
      state.user = user;
      state.role = role;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      state.selectedChat=null;
      state.chats=null

      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    },
    userSelectedChat:(state,action)=>{
      state.selectedChat=action.payload.selectedChat
    },
    userChat:(state,action)=>{
      state.chats=action.payload.chats
    },
    updateUserChat: (state, action) => {
  const newChat = action.payload.chat;
  state.chats = state.chats.map((chat) =>
    chat._id === newChat._id ? newChat : chat
  );
  },
  addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    }

  },
});

export const { userLoggedIn, userLoggedOut,userChat,userSelectedChat,updateUserChat,addNotification,clearNotifications,markAllRead} = authSlice.actions;

export default authSlice.reducer;
