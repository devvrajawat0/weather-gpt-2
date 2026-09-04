import React, { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Sparkles, MessageSquare, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatWindow = ({ weatherData, unit = 'C' }) => {
  const { messages, isLoading, sendMessage } = useChat(weatherData, unit);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedPrompts = [
    "☔ Should I carry an umbrella today?",
    "👕 What should I wear today?",
    "🏃 Can I go for a run this evening?",
    "☀️ Is it a good day to go outside?",
    "📅 What will the weather be tomorrow?",
    "🚗 Is the weather safe for driving?",
    "🌬️ How is the air quality today?",
    "🌡️ Will it be hot today?"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              WeatherGPT AI Assistant
              <Sparkles size={14} className="text-cyan-400" />
            </h3>
            <p className="text-xs text-gray-400">
              {weatherData ? `Grounded in live data for ${weatherData.city}` : 'Ask anything about current & forecast weather'}
            </p>
          </div>
        </div>

        {weatherData && (
          <span className="text-xs px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
            Live: {weatherData.city} ({weatherData.temp_c}°C)
          </span>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 min-h-[350px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
            >
              <MessageSquare className="text-cyan-400" size={32} />
            </motion.div>

            <h3 className="text-2xl font-black text-white mb-2">Conversational WeatherGPT</h3>
            <p className="text-gray-300 text-sm mb-6 max-w-md">
              Ask natural questions about clothing, outdoor plans, rain risk, or travel safety. I analyze real-time meteorological metrics to give instant recommendations!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt.replace(/^[^\w]+/, '').trim())}
                  className="p-3 text-xs text-left bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 rounded-xl text-gray-200 hover:text-white transition-all shadow-sm flex items-center gap-2"
                >
                  <Sparkles size={12} className="text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{prompt}</span>
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
                <div className="bg-slate-800/90 border border-white/10 p-4 rounded-2xl rounded-tl-sm shadow-xl max-w-[80%] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cyan-300">
                    <span>Analyzing live weather data...</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Field */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/10">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;
