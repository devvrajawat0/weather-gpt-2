import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Mocking for now, adjust based on actual backend response format
      const response = await sendChatMessage(text, sessionId).catch(() => ({
        reply: "Sorry, I couldn't connect to the server right now.",
        sessionId: sessionId || "temp-session"
      }));

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        weatherData: response.weatherData,
        timestamp: new Date().toISOString()
      };

      if (response.sessionId && !sessionId) {
        setSessionId(response.sessionId);
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Error communicating with AI service.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
    clearChat
  };
};
