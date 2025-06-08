import React, { useState } from 'react';
import MyChat from './myChat.jsx';
import SingleChat from './SingleChat.jsx';
import { useSelector } from 'react-redux';

function ChatBox() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const selectedChat = useSelector((state) => state.auth.selectedChat);

  return (
    <div className="flex h-screen bg-gray-100 p-4 gap-4">
      
      <div
        className={`
          h-full overflow-hidden p-2 bg-white rounded-xl shadow
          ${selectedChat ? 'hidden md:block w-2/5' : 'block w-full md:w-2/5'}
        `}
      >
        <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>

      {/* SingleChat */}
      <div
        className={`
          h-full overflow-hidden p-2 bg-white rounded-xl shadow
          ${selectedChat ? 'block w-full md:w-3/5' : 'hidden md:block w-3/5'}
        `}
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
}

export { ChatBox };
