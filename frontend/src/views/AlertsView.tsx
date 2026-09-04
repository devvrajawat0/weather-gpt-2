import React, { useState, useEffect } from 'react';
import { SevereAlert } from '../types';
import { fetchAlerts } from '../services/api';
import { AlertTriangle, ShieldAlert, CheckCircle2, Filter, Info, PhoneCall } from 'lucide-react';

interface AlertsViewProps {
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onOpenChatWithPrompt }) => {
  const [alerts, setAlerts] = useState<SevereAlert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      setIsLoading(true);
      try {
        const res = await fetchAlerts();
        setAlerts(res.alerts);
      } catch (err) {
        console.error("Failed to load alerts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'all') return true;
    return a.severity === severityFilter;
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'red':
        return {
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/60',
          badge: 'bg-rose-500 text-white',
          icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
          title: 'text-rose-200'
        };
      case 'orange':
        return {
          bg: 'bg-orange-950/40',
          border: 'border-orange-500/60',
          badge: 'bg-orange-500 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
          title: 'text-orange-200'
        };
      case 'yellow':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/60',
          badge: 'bg-amber-500 text-slate-950',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          title: 'text-amber-200'
        };
      default:
        return {
          bg: 'bg-emerald-950/30',
          border: 'border-emerald-500/40',
          badge: 'bg-emerald-500 text-white',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
          title: 'text-emerald-200'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" /> Official IMD Bulletin & Alert Watch
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Severe Weather & Disasters Panel
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Live color-coded warnings (Red / Orange / Yellow / Green) covering Heatwaves, Heavy Rainfall, Cyclonic Winds, Thunderstorms, and Air Pollution across Indian States.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start md:self-center">
          {['all', 'red', 'orange', 'yellow', 'green'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                severityFilter === sev
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Safety Helplines Strip */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <PhoneCall className="w-4 h-4 text-rose-400" /> Emergency Disaster Helplines (India):
        </div>
        <div className="flex flex-wrap gap-4 text-slate-400">
          <span>NDRF Emergency: <strong className="text-white">1078</strong></span>
          <span>IMD Control Room: <strong className="text-white">1800-180-1717</strong></span>
          <span>National Emergency: <strong className="text-white">112</strong></span>
        </div>
      </div>

      {/* Alert Cards Feed */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-40 bg-slate-800/60 rounded-3xl" />
          <div className="h-40 bg-slate-800/60 rounded-3xl" />
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="glass-panel p-8 text-center rounded-3xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No active warnings for this filter</h3>
          <p className="text-sm text-slate-400">Weather conditions in queried regions are within normal parameters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                className={`glass-panel rounded-3xl p-6 border ${style.border} ${style.bg} shadow-xl transition-all hover:scale-[1.005]`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-900/60 shadow-inner">
                      {style.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${style.badge}`}>
                          {alert.severity} Severity
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {alert.category} • {alert.location}
                        </span>
                      </div>
                      <h2 className={`text-lg font-extrabold ${style.title} mt-1`}>
                        {alert.title}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenChatWithPrompt(`What should I do during ${alert.title} in ${alert.location}?`)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                  >
                    Ask WeatherGPT AI Tips
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-sm text-slate-200 font-medium">
                    {alert.headline}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {alert.description}
                  </p>

                  {/* Safety Guidelines */}
                  {alert.instructions && alert.instructions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800/60">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-cyan-400" /> Mandatory Safety Precautions:
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                        {alert.instructions.map((inst, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-slate-900/40 p-2 rounded-xl border border-slate-800">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
