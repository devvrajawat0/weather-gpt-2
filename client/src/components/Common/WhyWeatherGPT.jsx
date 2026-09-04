import React from 'react';
import { Sparkles, Brain, ShieldCheck, Zap, Github, Layers, CloudSun } from 'lucide-react';

const WhyWeatherGPT = () => {
  return (
    <section className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/40 my-10 shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} /> SIH 2026 Innovation Brief
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Why WeatherGPT?
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Standard weather apps display raw numbers like 85% humidity or 1012 hPa pressure. <strong>WeatherGPT</strong> transforms complex meteorological big data into plain, conversational, and actionable human recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Brain size={24} />
            </div>
            <h3 className="font-bold text-white text-lg">AI Decision Engine</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Answers questions like <em>"Should I carry an umbrella?"</em> or <em>"What should I wear?"</em> using deterministic data rules + LLM reasoning grounded in live forecast metrics.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-white text-lg">Zero Hallucination</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Unlike generic chatbot wrappers, WeatherGPT never invents numbers. AI responses are anchored strictly to real-time WeatherAPI metrics.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-white text-lg">6-Factor Insights</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Instant dynamic evaluation of Rain Risk, Outfit, Outdoor Workouts, UV Safety, EPA Air Quality, and Travel Visibility conditions.
            </p>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <CloudSun size={16} className="text-cyan-400" />
            <span>Powered by <strong>WeatherAPI.com</strong> &amp; <strong>Google Gemini AI</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/devvrajawat0/weathergpt" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github size={16} />
              <span>GitHub Repository</span>
            </a>
            <span>•</span>
            <span className="text-cyan-300 font-semibold">SIH26068 • Ministry of Earth Sciences</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeatherGPT;
