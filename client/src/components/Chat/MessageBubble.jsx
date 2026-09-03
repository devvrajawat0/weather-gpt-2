import React from 'react';
import ReactMarkdown from 'react-markdown';
import { formatTime } from '../../utils/helpers';
import WeatherCard from './WeatherCard';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
        }`}>
          {isUser ? '👤' : '🤖'}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className={`p-3 md:p-4 rounded-2xl shadow-sm relative ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-sm' 
              : 'bg-slate-800 border border-white/10 text-gray-100 rounded-tl-sm'
          }`}>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
          
          {/* Weather Widget if attached */}
          {!isUser && message.weatherData && (
            <div className="mt-2 w-full max-w-sm">
              <WeatherCard data={message.weatherData} />
            </div>
          )}

          <span className={`text-[10px] text-gray-500 ${isUser ? 'text-right' : 'text-left'} px-1 mt-1`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
