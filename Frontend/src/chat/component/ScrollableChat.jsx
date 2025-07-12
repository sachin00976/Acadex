import { isSameUserMessage } from "../chatLogic/IsSameUser.js";
import { IsLoggedInUser } from "../chatLogic/isLoggedInUser.js";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function ScrollableChat({ messages,setMessage }) {
  
  const user = useSelector((state) => state.auth.user);

  const deleteHandler = async (msgId) => {
    try {
      const config={
        data:{
          messageId:msgId
        }
      }
      const res=await axios.delete("/api/v1/message/deleteMessage",config)
      console.log("deleted res:",res)
      const updatedMessages = messages.map((msg) =>
      msg._id === msgId ? { ...msg, content: "deleted" } : msg
      );
    setMessage(updatedMessages);
    } catch (error) {
      console.log("error while deleting the message",error.message)
      toast.error("Failed to delete the Message")
      
    }
    
  };

  return (
    <div className="h-full p-4 bg-gray-50 rounded-xl shadow-inner space-y-3">
      <ScrollableFeed className="h-full px-4 space-y-3">
        {messages.map((msg, i) => {
          const isUser = IsLoggedInUser(msg, user);
          const isDeleted = msg.content === "deleted";

          return (
            <div
              key={msg._id}
              className={`flex items-end space-x-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {isSameUserMessage(messages, i)  && (
                <img
                  src={msg.sender.profile.url}
                  alt={`${msg.sender.firstName} ${msg.sender.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              <div className="relative group max-w-xs">
                <div
                  className={`p-3 rounded-lg shadow border transition-all duration-200 ${
                    isDeleted
                      ? "bg-gray-200 text-gray-500 italic text-center border-gray-300"
                      : isUser
                      ? "bg-blue-500 text-white border-blue-400"
                      : "bg-white text-gray-800 border-gray-200"
                  }`}
                >
                  <span className="text-sm block">{msg.content}</span>
                </div>

                
                {!isDeleted && msg.sender._id===user._id && (
                  <button
                onClick={() => deleteHandler(msg._id)}
                className="absolute top-1/2 -translate-y-1/2 -left-12 text-xs text-red-600 bg-white border border-red-300 rounded px-2 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
              >
                Delete
              </button>

                )}
              </div>
            </div>
          );
        })}
      </ScrollableFeed>
    </div>
  );
}

export { ScrollableChat };
