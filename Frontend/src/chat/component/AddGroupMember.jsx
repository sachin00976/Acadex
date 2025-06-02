
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userSelectedChat } from "../../features/authSlice.js";
import { useState } from "react";

function AddGroupMember({ setOpenAddMember,setFetchAgain }) {
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [memberArray, setMemberArray] = useState([]);
  const dispatch = useDispatch();
  const selectedChat=useSelector((state)=>state.auth.selectedChat)
  
    const addMemberHandler=async()=>{
        if(memberArray.length===0)
        {
            toast.error("Add atleast one member to add into group")
            return
        }
        const membersToAdd=memberArray.map((user)=>{
            return {
                user:user._id,
                userModel:user.role
            }
        })
        try {
            const config={
                method:"put",
                data:{
                    chatId:selectedChat._id,
                    membersToAdd:membersToAdd
                }
            }
            const response=await axios("/api/v1/chat/addMember",config)
          dispatch(userSelectedChat({selectedChat:response.data.data}));
          setFetchAgain((prev)=>!prev)
           console.log("add member:",selectedChat)
            toast.success("member added successfully")
            
            

        } catch (error) {
            console.log("Failed to add Member",error.message)
            toast.error("Failed to add member")
        }
        finally{
          
            setOpenAddMember(false)
            setMemberArray([])
            setResults(null)
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
      setEmail("")
      setEmployeeId("")
    }
  };

  const addMember = (user) => {
    
    if (memberArray.some(member => member.user === user._id)) {
      toast.error("Member already added");
      return;
    }
    
    setMemberArray((prev) => [
        user,
      ...prev,
      
    ]);
    toast.success("Member added");
  };

  const removeMember = (userId) => {
    setMemberArray((prev) => prev.filter((member) => member._id !== userId));
  };

  return (
    <div className="w-full border-r border-gray-300 bg-gray-50 h-full p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Add Member</h3>
        
         
      
        <button
          onClick={() => { setOpenAddMember(false); 
            setMemberArray([]);
            setResults(null)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
        >
          Close <span className="ml-1">×</span>
        </button>
      </div>

              {memberArray.length > 0 && (
                <div className="mb-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Selected Members <span className="text-gray-600">({memberArray.length})</span>
          </h4>

          {memberArray.length > 0 && (
            <button
              onClick={addMemberHandler}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm"
            >
              Add
            </button>
          )}
        </div>



          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {memberArray.length>0 && memberArray.map((member) => (
              <div key={member._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={member.profile.url}
                    alt={member.first+member?.middleName+member.lastName}
                    className="w-10 h-10 object-cover rounded-full border border-gray-300"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{member.first+member?.middleName+member.lastName}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500">ID: {member.employeeId}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeMember(member._id)}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove member"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
        
        
      {/* Search Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      </div>

      {/* Search Results */}
      <div className="mt-6 h-full overflow-y-auto">
        {loading && (!results || results.length === 0) && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {!loading && results && results.length === 0 && (
          <p className="text-center text-gray-400">No users found.</p>
        )}

        {results?.map((user) => (
          <div
            key={user._id}
            onClick={() => addMember(user)}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <img
              src={user.profile?.url || '/default-avatar.png'}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-12 h-12 object-cover rounded-full border border-gray-300"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {user.firstName} {user.middleName || ''} {user.lastName}
              </p>
              <p className="text-indigo-600 text-sm">Role: {user.role}</p>
              <p className="text-gray-600 text-sm truncate">Email: {user.email}</p>
              <p className="text-gray-500 text-xs">ID: {user.employeeId}</p>
            </div>
            {memberArray.some(member => member._id === user._id) && (
              <span className="text-green-500 text-sm font-medium">Added</span>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default AddGroupMember;