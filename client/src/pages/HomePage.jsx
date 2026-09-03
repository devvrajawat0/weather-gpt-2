import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, LayoutDashboard, ArrowRight, Search, CloudLightning, ShieldAlert, Zap } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/dashboard?city=${encodeURIComponent(searchCity.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-full flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 flex flex-col items-center justify-center w-full">
        <motion.div 
          className="text-center w-full max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="relative animate-float">
              <CloudLightning size={80} className="text-cyan-400" />
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              WeatherGPT
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-10 font-light">
            Your AI-Powered Weather Companion. Ask questions, explore data, and stay safe with real-time alerts.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => navigate('/chat')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full font-bold text-lg shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              Start Chatting <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
            >
              View Dashboard
            </button>
          </motion.div>

          {/* Quick Search */}
          <motion.form variants={itemVariants} onSubmit={handleSearch} className="max-w-md mx-auto w-full relative mb-20 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent backdrop-blur-md shadow-xl transition-all"
              placeholder="Enter city name for quick weather..."
            />
            <button type="submit" className="absolute inset-y-2 right-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
              Search
            </button>
          </motion.form>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:bg-white/15 transition-colors cursor-default">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30 text-blue-400">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">🤖 AI Chat</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ask about weather in natural language. "Will it rain in Mumbai tomorrow?" Our AI understands context and provides detailed insights.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:bg-white/15 transition-colors cursor-default">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/30 text-cyan-400">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">📊 Smart Dashboard</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explore real-time weather data, interactive maps, and highly accurate 5-day forecasts with intuitive visual charts.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:bg-white/15 transition-colors cursor-default">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4 border border-red-500/30 text-red-400">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">🚨 Disaster Alerts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stay safe with timely warnings for extreme weather events. Critical alerts prioritized to help you make informed decisions.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="mt-20 w-full py-8 border-y border-white/10 flex flex-wrap justify-center gap-8 text-center text-sm font-medium text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2"><Zap size={16} className="text-yellow-400" /> AI Powered</div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700 my-auto hidden sm:block"></div>
          <div>500+ Cities</div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700 my-auto hidden sm:block"></div>
          <div>Real-time Data</div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700 my-auto hidden sm:block"></div>
          <div>Free to Use</div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
