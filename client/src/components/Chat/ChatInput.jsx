import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex items-center bg-black/30 border border-white/10 rounded-2xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all shadow-inner">
        <button 
          type="button" 
          className="p-3 text-gray-400 hover:text-cyan-400 transition-colors ml-1"
          disabled={disabled}
        >
          <Mic size={20} />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask about weather anywhere (e.g., 'Will it rain in Delhi today?')"
          className="flex-1 py-4 px-2 bg-transparent text-white placeholder-gray-500 focus:outline-none disabled:opacity-50 text-sm md:text-base"
        />
        
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-2 mr-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={18} className={input.trim() && !disabled ? "ml-0.5" : ""} />
        </button>
      </div>
      <div className="text-center mt-2 text-[10px] text-gray-500">
        AI responses can make mistakes. Verify critical weather information.
      </div>
    </form>
  );
};

export default ChatInput;
