import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, Sparkles, Activity } from 'lucide-react';

export const NightReadiness: React.FC = () => {
  const [lastPingSec, setLastPingSec] = useState(2);
  const [brixJitter, setBrixJitter] = useState(21.4);
  const [moistureJitter, setMoistureJitter] = useState(26.1);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastPingSec((prev) => (prev >= 7 ? 1 : prev + 1));
      if (Math.random() > 0.5) {
        setBrixJitter(Number((21.3 + Math.random() * 0.3).toFixed(1)));
        setMoistureJitter(Number((25.8 + Math.random() * 0.5).toFixed(1)));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastPingSec(1);
      setBrixJitter(21.5);
      setMoistureJitter(26.0);
      setIsSyncing(false);
    }, 600);
  };

  return (
    <section className="bg-gradient-to-b from-[#111e33] to-[#0c1626] text-white py-16 relative overflow-hidden" data-purpose="regional-night-schedule">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Night Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="eyebrow-badge text-sky-400">04. HARVEST SCHEDULE</span>
            <span className="text-[10px] bg-sky-950/90 text-sky-300 font-mono px-2 py-0.5 rounded-full border border-sky-800/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Updated {lastPingSec}s ago</span>
            </span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-1.5">
            Fresh Harvest &amp; Delivery Times
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track when crops are picked fresh and prepared for delivery in refrigerated vans.
          </p>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="mt-4 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium border border-slate-700 inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Checking Farm Status...' : 'Refresh Status'}</span>
          </button>
        </div>

        {/* 3 Live Readiness Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-slate-900/85 border border-slate-700/80 p-5 rounded-2xl relative shadow-lg hover:border-slate-500 transition-colors group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> Harvesting in 18 Hours
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Batch #MH-NSK-402
              </span>
            </div>
            
            <h4 className="font-serif-heading text-xl font-bold text-white mt-2 group-hover:text-farm-gold transition-colors">
              Tomatoes (Vine-Ripe)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">Sahyadri Organic Cluster • Nashik, Maharashtra</p>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>Quality Index:</span>
                </span>
                <span className="text-emerald-400 font-semibold font-mono">
                  Peak Firmness (Grade A)
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Soil Moisture Probe:</span>
                <span className="text-sky-300 font-semibold font-mono">
                  Optimal {moistureJitter}%
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cold Dispatch Window:</span>
                <span className="text-white font-semibold">Tomorrow 05:30 AM</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/85 border border-slate-700/80 p-5 rounded-2xl relative shadow-lg hover:border-slate-500 transition-colors group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Sorting &amp; Crating
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Batch #MP-MLW-109
              </span>
            </div>
            
            <h4 className="font-serif-heading text-xl font-bold text-white mt-2 group-hover:text-farm-gold transition-colors">
              Potatoes (Table Grade)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">Malwa Farmers FPO • Malwa, Madhya Pradesh</p>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>Dry Matter Index:</span>
                </span>
                <span className="text-emerald-400 font-semibold font-mono">21.4% (Optimal Starch)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Storage Temp:</span>
                <span className="text-sky-300 font-semibold font-mono">Chilled 8.2°C</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Truck Dispatch:</span>
                <span className="text-white font-semibold">Thursday Direct Reefer</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/85 border border-slate-700/80 p-5 rounded-2xl relative shadow-lg hover:border-slate-500 transition-colors group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span> Field Curing &amp; Bagging
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Batch #MH-NSK-883
              </span>
            </div>
            
            <h4 className="font-serif-heading text-xl font-bold text-white mt-2 group-hover:text-farm-gold transition-colors">
              Onions (Nashik Red)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">Godavari Agro Collective • Nashik, Maharashtra</p>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>Outer Skin Dryness:</span>
                </span>
                <span className="text-emerald-400 font-semibold font-mono">Triple Layer Cured</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pungency Rating:</span>
                <span className="text-amber-300 font-semibold font-mono">Standard Grade A</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Next Dispatch:</span>
                <span className="text-white font-semibold">Saturday Express Route</span>
              </div>
            </div>
          </div>
        </div>

        {/* Illustrated Nighttime Farm Cottages & Starry Horizon */}
        <div className="w-full mt-10 pt-4 pointer-events-none opacity-85">
          <svg className="w-full h-24" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 120">
            {/* Twinkling Stars */}
            <circle cx="120" cy="20" fill="#ffffff" r="1.8" className="animate-twinkle" />
            <circle cx="210" cy="35" fill="#facc15" r="1.2" className="animate-twinkle [animation-delay:0.7s]" />
            <circle cx="340" cy="15" fill="#ffffff" r="1.5" className="animate-twinkle [animation-delay:1.4s]" />
            <circle cx="480" cy="28" fill="#ffffff" r="1.2" className="animate-twinkle [animation-delay:0.3s]" />
            <circle cx="680" cy="24" fill="#ffffff" r="1.8" className="animate-twinkle [animation-delay:1.8s]" />
            <circle cx="750" cy="12" fill="#facc15" r="1.4" className="animate-twinkle [animation-delay:2.1s]" />
            <circle cx="890" cy="18" fill="#ffffff" r="1.5" className="animate-twinkle [animation-delay:0.9s]" />
            
            <path d="M0 80 Q 250 50 500 70 T 1000 60 L 1000 120 L 0 120 Z" fill="#09111c" />
            
            {/* Wind Turbines with blinking red beacon */}
            <line stroke="#475569" strokeWidth="1.5" x1="220" x2="220" y1="70" y2="30" />
            <circle cx="220" cy="30" fill="#ef4444" r="2" className="animate-ping [animation-duration:2.5s]" />
            <line stroke="#475569" strokeWidth="1.5" x1="280" x2="280" y1="65" y2="25" />
            <circle cx="280" cy="25" fill="#ef4444" r="2" className="animate-ping [animation-duration:2.8s]" />

            {/* Glowing Cottage Windows */}
            <polygon fill="#1e293b" points="760,75 775,65 790,75 790,85 760,85" />
            <rect fill="#facc15" height="5" width="5" x="770" y="74" className="animate-pulse" />
          </svg>
        </div>
      </div>
    </section>
  );
};
