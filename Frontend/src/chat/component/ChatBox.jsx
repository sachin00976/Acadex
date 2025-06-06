import React from 'react';
import MyChat from './myChat.jsx';
import SingleChat from './SingleChat.jsx';
import { useState } from 'react';

function ChatBox() {
  const [fetchAgain,setFetchAgain]=useState(false)
  return (
    <div className="flex h-screen bg-gray-100 p-4 gap-4">
      {/* MyChat - 40% width */}
      <div className="w-2/5 h-full overflow-hidden p-2 bg-white rounded-xl shadow">
        <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </div>

      {/* SingleChat - 60% width */}
      <div className="w-3/5 h-full overflow-hidden p-2 bg-white rounded-xl shadow">
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </div>
    </div>
  );
}

export { ChatBox };
