import React, { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { CloudRain, Sun, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatWindow = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedPrompts = [
    "What's the weather like in Mumbai right now?",
    "Will it rain in Delhi tomorrow?",
    "Show me the 5-day forecast for Bangalore",
    "Are there any weather alerts for Chennai?"
  ];

  return (
    <div className="flex flex-col h-full bg-black/20">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,211,238,0.2)]"
            >
              <Sun className="text-yellow-400 h-10 w-10 animate-[spin_10s_linear_infinite]" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">How can I help with the weather?</h3>
            <p className="text-gray-400 mb-8">
              Ask me for current conditions, forecasts, or alerts for any city in the world.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt)}
                  className="p-3 text-sm text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors truncate"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 border border-white/5 p-4 rounded-2xl rounded-tl-sm shadow-md max-w-[80%] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div className="flex space-x-1.5 ml-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 backdrop-blur-md border-t border-white/10">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;
