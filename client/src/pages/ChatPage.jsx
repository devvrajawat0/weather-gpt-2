import React from 'react';
import ChatWindow from '../components/Chat/ChatWindow';

const ChatPage = () => {
  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      <div className="flex-1 max-w-5xl mx-auto w-full h-full glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Weather Assistant</h2>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
