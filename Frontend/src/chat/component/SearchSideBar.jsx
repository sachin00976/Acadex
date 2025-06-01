import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch,useSelector } from "react-redux";
import { userSelectedChat } from "../../features/authSlice.js";


function SearchSideBar({searchBarOpen,setSearchBarOpen,setFetchAgain}) {
  console.log("executed search bar:",searchBarOpen)
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch()
  const accessChat=async (user)=>{
    if(!user) return 
    try {
      const config={
        method:"post",
        data:{
          userId:user._id,
        role:user.role
        }
      }
      const response=await axios("/api/v1/chat/accessChat",config)
      dispatch(userSelectedChat({selectedChat:response.data.data}))
      setFetchAgain((state)=>!state)
      setSearchBarOpen(false)
    } catch (error) {
      console.log("error while accessing chat from search bar",error.message)
      toast.error("Failed to access chat!")
    }
  }
  const handleSearch = async () => {
    if (!employeeId && !email) {
      toast.error("Please enter Employee ID or Email");
      return;
    }

    try {
      setLoading(true);
      const params = {};
      if (employeeId.trim()) params.employeeId = employeeId.trim();
      if (email.trim()) params.email = email.trim();

      const { data } = await axios.get("/api/v1/search/searchUser", { params });
      setResults(data?.data || []);
      toast.success(data.message);
    } catch (error) {
      console.error("Search failed:", error.message);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100%] border-r border-gray-300 bg-gray-50 min-h-screen p-5 items-center">
      
          <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Search Users</h3>
        <button 
          onClick={() => setSearchBarOpen(!searchBarOpen)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
        >
          Close <span className="ml-1">×</span>
        </button>
      </div>

      
    
      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        className={`w-full py-2 rounded-md text-white font-semibold transition-colors ${
          loading
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      <div className="mt-6 max-h-[60vh] overflow-y-auto">
        {loading && results?.length === 0 && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {!loading && results && results?.length === 0 && (
          <p className="text-center text-gray-400">No users found.</p>
        )}

    {results?.map((user) => (
  <div
    key={user._id}
    onClick={()=>accessChat(user)}
    className="flex items-center gap-4 border p-4 rounded-lg shadow-sm mb-3 bg-white hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-300"
  >
    <div className="w-[40%] ">
      <img
        src={user.profile.url}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-32 h-16 object-cover rounded-md border border-gray-300"
      />
    </div>
    <div className="text-sm text-gray-700 w-[60%]">
      <p className="font-semibold text-gray-900">
        {user.firstName}{user.middleName?user.middleName:""} {user.lastName}
      </p>
      <p className="text-indigo-600 font-medium">Role: {user.role}</p>
      <p className="truncate max-w-xs">Email: {user.email}</p>
      <p className="text-gray-500 text-xs">ID: {user.employeeId}</p>
    </div>
  </div>
))}

      </div>
    </div>
  );
}

export default SearchSideBar;
