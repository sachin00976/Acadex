import { createSlice } from "@reduxjs/toolkit";

// Check if user exists in localStorage
const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  selectedChat:null,
  chats:null
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.selectedChat=null;
      state.chats=null
      localStorage.removeItem("user");
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
