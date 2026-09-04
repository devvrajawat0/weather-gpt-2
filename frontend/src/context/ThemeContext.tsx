import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  speechEnabled: boolean;
  toggleSpeech: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('weathergpt_theme');
    return saved ? saved === 'dark' : true;
  });

  const [speechEnabled, setSpeechEnabled] = useState<boolean>(() => {
    return localStorage.getItem('weathergpt_speech') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('weathergpt_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('weathergpt_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('weathergpt_speech', String(speechEnabled));
  }, [speechEnabled]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const toggleSpeech = () => setSpeechEnabled(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, speechEnabled, toggleSpeech }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
