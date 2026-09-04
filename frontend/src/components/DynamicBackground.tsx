import React from 'react';

interface Props {
  category?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'stormy';
  isDay?: boolean;
}

export const DynamicBackground: React.FC<Props> = ({ category = 'sunny', isDay = true }) => {
  let bgClass = "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900";
  let overlayGlow = "from-cyan-500/10 via-blue-500/5 to-purple-500/10";

  if (!isDay) {
    bgClass = "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950";
    overlayGlow = "from-indigo-500/10 via-purple-500/5 to-slate-900/20";
  } else if (category === 'sunny') {
    bgClass = "bg-gradient-to-br from-amber-900/40 via-sky-900/60 to-slate-900";
    overlayGlow = "from-amber-500/20 via-sky-500/10 to-orange-500/10";
  } else if (category === 'rainy') {
    bgClass = "bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950";
    overlayGlow = "from-blue-600/20 via-cyan-500/10 to-slate-900/30";
  } else if (category === 'stormy') {
    bgClass = "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950";
    overlayGlow = "from-purple-600/25 via-indigo-500/15 to-blue-900/20";
  } else if (category === 'cloudy' || category === 'foggy') {
    bgClass = "bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900";
    overlayGlow = "from-slate-400/10 via-sky-900/10 to-gray-500/10";
  } else if (category === 'snowy') {
    bgClass = "bg-gradient-to-br from-cyan-950 via-slate-900 to-sky-900";
    overlayGlow = "from-cyan-300/15 via-blue-400/10 to-indigo-900/20";
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-all duration-1000">
      <div className={`absolute inset-0 ${bgClass}`} />
      <div className={`absolute inset-0 bg-gradient-to-tr ${overlayGlow} animate-pulse-slow`} />
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px]" />
    </div>
  );
};
