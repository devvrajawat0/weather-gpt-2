import React from 'react';
import { ForecastResponse, LocationItem } from '../types';
import { WeatherCard } from '../components/WeatherCard';
import { HourlyForecast } from '../components/HourlyForecast';
import { DailyForecast } from '../components/DailyForecast';
import { AqiWidget } from '../components/AqiWidget';
import { WeatherMap } from '../components/WeatherMap';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { AlertTriangle, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  data: ForecastResponse | null;
  isLoading: boolean;
  error: Error | null;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  isLoading,
  error,
  onOpenChatWithPrompt
}) => {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6 animate-pulse">
        <div className="h-64 bg-slate-800/60 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-slate-800/60 rounded-3xl" />
          <div className="h-48 bg-slate-800/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center glass-panel rounded-3xl my-8">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">Unable to Load Weather Data</h2>
        <p className="text-slate-400 text-sm">{error?.message || 'Check your internet connection or backend server status.'}</p>
      </div>
    );
  }

  const { location, weather, alerts } = data;
  const severeAlerts = alerts.filter(a => a.severity !== 'green');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Severe Weather Alert Banner if present */}
      {severeAlerts.length > 0 && (
        <div className="glass-card bg-rose-900/30 border border-rose-500/40 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-200">
                {severeAlerts[0].title} — {location.name}
              </div>
              <div className="text-xs text-rose-300/80">
                {severeAlerts[0].headline}
              </div>
            </div>
          </div>
          <button
            onClick={() => onOpenChatWithPrompt(`What precautions should I take for ${severeAlerts[0].title} in ${location.name}?`)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ask AI Safety Tips
          </button>
        </div>
      )}

      {/* Hero Weather Card */}
      <WeatherCard
        location={location}
        current={weather.current}
        maxTemp={weather.daily[0]?.maxTemp}
        minTemp={weather.daily[0]?.minTemp}
      />

      {/* 24-Hour Forecast Ribbon */}
      <HourlyForecast hourly={weather.hourly} />

      {/* Grid: 7-Day Forecast & AQI / Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day Forecast */}
        <div className="lg:col-span-2 space-y-6">
          <DailyForecast daily={weather.daily} />
        </div>

        {/* Right Col: AQI & Map */}
        <div className="space-y-6">
          <AqiWidget aqi={weather.aqi} />
          <WeatherMap
            location={location}
            currentTemp={weather.current.temp}
            condition={weather.current.condition}
          />
        </div>
      </div>

      {/* Quick AI Prompts Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-700/60">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" /> WeatherGPT AI Assistants Prompts for {location.name}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenChatWithPrompt(`Will it rain in ${location.name} tomorrow?`)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-slate-700 text-xs font-medium text-slate-200 transition"
          >
            🌧️ "Will it rain in {location.name} tomorrow?"
          </button>
          <button
            onClick={() => onOpenChatWithPrompt(`What should I wear in ${location.name} today based on temperature and weather?`)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-slate-700 text-xs font-medium text-slate-200 transition"
          >
            👕 "What should I wear in {location.name} today?"
          </button>
          <button
            onClick={() => onOpenChatWithPrompt(`Compare weather between ${location.name} and Tokyo`)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-slate-700 text-xs font-medium text-slate-200 transition"
          >
            ⚖️ "Compare weather in {location.name} and Tokyo"
          </button>
          <button
            onClick={() => onOpenChatWithPrompt(`Provide agricultural weather advice for farmers in ${location.name}`)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-slate-700 text-xs font-medium text-slate-200 transition"
          >
            🌾 "Farming advice for {location.name}"
          </button>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
