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
  chats:null
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
    }
  },
});

export const { userLoggedIn, userLoggedOut,userChat,userSelectedChat } = authSlice.actions;

export default authSlice.reducer;
