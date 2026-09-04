import { useState, useCallback } from 'react';
import { askWeatherGPT } from '../services/chatService';

export const useChat = (weatherData = null, unit = 'C') => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const replyText = await askWeatherGPT(text, weatherData, unit, messages);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        weatherData: weatherData,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I had trouble answering that. Please verify your connection or try again!',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [weatherData, unit, messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
};
