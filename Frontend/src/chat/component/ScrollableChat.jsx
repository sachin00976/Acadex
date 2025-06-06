import { isSameUserMessage } from "../chatLogic/IsSameUser.js";
import { IsLoggedInUser } from "../chatLogic/isLoggedInUser.js";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";

function ScrollableChat({ messages }) {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className=" h-full p-4 bg-gray-50 rounded-xl shadow-inner space-y-3">
      <ScrollableFeed className="h-full px-4 space-y-3">
        {messages && messages.map((msg, i) => {
          const isUser = IsLoggedInUser(msg, user);

          return (
            <div
              key={msg._id}
              className={`flex items-end space-x-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              { isSameUserMessage(messages, i) && (
                <img
                  src={msg.sender.profile.url}
                  alt={`${msg.sender.firstName} ${msg.sender.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div
                className={`p-3 rounded-lg shadow border max-w-xs ${
                  isUser
                    ? "bg-blue-500 text-white border-blue-400"
                    : "bg-white text-gray-800 border-gray-200"
                }`}
              >
                <span className="text-sm">{msg.content}</span>
              </div>
            </div>
          );
        })}
      </ScrollableFeed>
    </div>
  );
}


export { ScrollableChat };
