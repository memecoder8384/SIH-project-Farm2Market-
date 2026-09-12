import React, { useState } from 'react';

export const SoilBreakdown: React.FC = () => {
  const [basketBudget, setBasketBudget] = useState<number>(2400); // Default ₹2,400 per month
  const [inspectedRoot, setInspectedRoot] = useState<string | null>(null);

  const farmerDirectShare = Math.round(basketBudget * 0.85);
  const soilFundShare = Math.round(basketBudget * 0.10);
  const platformTechShare = Math.round(basketBudget * 0.05);

  const rootsData: Record<string, { title: string; depth: string; biome: string; moisture: string }> = {
    carrot1: { title: 'Desi Pusa Rudhira Carrot', depth: '18 cm Taproot', biome: 'Mycorrhizal Fungi 94%', moisture: '26% Optimal' },
    carrot2: { title: 'Deep Kuroda Heirloom Carrot', depth: '24 cm Taproot', biome: 'Rhizobacteria Biome', moisture: '28% Deep Moisture' },
    beet: { title: 'Chioggia Candy Beet', depth: '16 cm Bulb Root', biome: 'Mycelium Soil Network', moisture: '31% Organic Loam' },
    carrot3: { title: 'Solar Cold-Frame Baby Carrot', depth: '19 cm Taproot', biome: 'Bio-Composted Basalt', moisture: '24% Aerated' },
    carrot4: { title: 'High-Altitude Mountain Carrot', depth: '22 cm Taproot', biome: 'Humus & Earthworm Casts', moisture: '27% Mountain Loam' },
  };

  return (
    <section className="relative bg-[#3c2415] text-amber-50 pt-16 pb-24 overflow-hidden border-t-8 border-[#58a351]" data-purpose="soil-transparency-breakdown">
      {/* Decorative Green Soil Plants Growing along Top Rim */}
      <div className="absolute top-0 left-0 w-full transform -translate-y-full overflow-hidden leading-none pointer-events-none">
        <svg className="w-full h-8" fill="#58a351" preserveAspectRatio="none" viewBox="0 0 1200 30">
          <path d="M0,30 Q300,5 600,20 T1200,10 L1200,30 Z"></path>
        </svg>
      </div>

      {/* Interactive Illustrated Taproots Hanging into the Loamy Soil */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex justify-around items-start opacity-95">
          {/* Carrot 1 */}
          <button
            onClick={() => setInspectedRoot(inspectedRoot === 'carrot1' ? null : 'carrot1')}
            className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 focus:outline-none"
          >
            <svg height="70" viewBox="0 0 40 70" width="40" className="group-hover:drop-shadow-[0_0_8px_rgba(245,200,66,0.6)] transition-all">
              <polygon fill="#e65c38" points="15,4 20,45 25,4"></polygon>
              <line stroke="#f5c842" strokeDasharray="2 2" strokeWidth="1.5" x1="20" x2="20" y1="45" y2="65"></line>
              <line stroke="#f5c842" strokeWidth="1" x1="20" x2="14" y1="52" y2="58"></line>
              <line stroke="#f5c842" strokeWidth="1" x1="20" x2="25" y1="58" y2="62"></line>
            </svg>
            <span className="text-[10px] text-amber-200/80 font-mono mt-1 group-hover:text-farm-gold">Depth: 18cm 🔍</span>
          </button>

          {/* Carrot 2 */}
          <button
            onClick={() => setInspectedRoot(inspectedRoot === 'carrot2' ? null : 'carrot2')}
            className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 focus:outline-none"
          >
            <svg height="85" viewBox="0 0 46 85" width="46" className="group-hover:drop-shadow-[0_0_8px_rgba(245,200,66,0.6)] transition-all">
              <polygon fill="#e65c38" points="16,2 23,55 30,2"></polygon>
              <line stroke="#f5c842" strokeDasharray="2 2" strokeWidth="1.5" x1="23" x2="23" y1="55" y2="80"></line>
              <line stroke="#f5c842" strokeWidth="1" x1="23" x2="16" y1="62" y2="70"></line>
              <line stroke="#f5c842" strokeWidth="1" x1="23" x2="29" y1="70" y2="76"></line>
            </svg>
            <span className="text-[10px] text-amber-200/80 font-mono mt-1 group-hover:text-farm-gold">Depth: 24cm 🔍</span>
          </button>

          {/* Chioggia Beet Root */}
          <button
            onClick={() => setInspectedRoot(inspectedRoot === 'beet' ? null : 'beet')}
            className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 focus:outline-none"
          >
            <svg height="75" viewBox="0 0 50 75" width="50" className="group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.6)] transition-all">
              <ellipse cx="25" cy="28" fill="#991b1b" rx="18" ry="16"></ellipse>
              <line stroke="#f87171" strokeWidth="1.5" x1="25" x2="25" y1="44" y2="70"></line>
              <line stroke="#f87171" strokeWidth="1" x1="25" x2="17" y1="52" y2="60"></line>
              <line stroke="#f87171" strokeWidth="1" x1="25" x2="33" y1="58" y2="65"></line>
            </svg>
            <span className="text-[10px] text-amber-200/80 font-mono mt-1 group-hover:text-farm-gold">Living Mycelium 🔍</span>
          </button>

          {/* Carrot 3 */}
          <button
            onClick={() => setInspectedRoot(inspectedRoot === 'carrot3' ? null : 'carrot3')}
            className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 focus:outline-none"
          >
            <svg height="70" viewBox="0 0 40 70" width="40" className="group-hover:drop-shadow-[0_0_8px_rgba(245,200,66,0.6)] transition-all">
              <polygon fill="#e65c38" points="14,3 20,46 26,3"></polygon>
              <line stroke="#f5c842" strokeDasharray="2 2" strokeWidth="1.5" x1="20" x2="20" y1="46" y2="66"></line>
            </svg>
            <span className="text-[10px] text-amber-200/80 font-mono mt-1 group-hover:text-farm-gold">Depth: 19cm 🔍</span>
          </button>

          {/* Carrot 4 */}
          <button
            onClick={() => setInspectedRoot(inspectedRoot === 'carrot4' ? null : 'carrot4')}
            className="hidden sm:flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 focus:outline-none"
          >
            <svg height="80" viewBox="0 0 44 80" width="44" className="group-hover:drop-shadow-[0_0_8px_rgba(245,200,66,0.6)] transition-all">
              <polygon fill="#e65c38" points="15,4 22,50 29,4"></polygon>
              <line stroke="#f5c842" strokeDasharray="2 2" strokeWidth="1.5" x1="22" x2="22" y1="50" y2="75"></line>
            </svg>
            <span className="text-[10px] text-amber-200/80 font-mono mt-1 group-hover:text-farm-gold">Depth: 22cm 🔍</span>
          </button>
        </div>

        {/* Dynamic Root Telemetry Inspector Tooltip */}
        {inspectedRoot && rootsData[inspectedRoot] && (
          <div className="mt-4 max-w-md mx-auto p-3.5 rounded-2xl bg-[#201007] border border-farm-gold/80 text-center animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[10px] uppercase font-bold text-farm-gold tracking-wider">
              {rootsData[inspectedRoot].title}
            </span>
            <div className="flex justify-around items-center text-xs font-mono text-stone-300 mt-1">
              <span>{rootsData[inspectedRoot].depth}</span>
              <span>•</span>
              <span className="text-emerald-400">{rootsData[inspectedRoot].biome}</span>
              <span>•</span>
              <span className="text-sky-300">{rootsData[inspectedRoot].moisture}</span>
            </div>
          </div>
        )}
      </div>

      {/* Soil Dot Matrix Pattern Backdrop */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 soil-dot-grid py-8 rounded-3xl bg-[#321c0f]/65 border border-amber-950/80">
        {/* Center Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow-badge text-farm-gold">03. FAIR MONEY FOR FARMERS</span>
          <h2 className="font-serif-heading text-3xl sm:text-5xl font-bold text-amber-100 mt-2">
            Where Does Your Money Go?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-2">
            In traditional markets, multiple middlemen take big cuts while farmers get very little. Farm2Market gives 85% directly to farmers.
          </p>
        </div>

        {/* 3 Columns Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Traditional Middleman Chains */}
          <div className="bg-[#29170c]/80 p-6 rounded-2xl border border-stone-800 text-center flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-800/80 border border-stone-700 flex items-center justify-center text-xl mb-4">
                🏪
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-amber-200">Regular Mandi Markets</h3>
              <p className="text-xs text-stone-400 mt-1">Brokers and middlemen take large cuts</p>
              
              <div className="my-6">
                <span className="text-4xl font-bold text-red-400 font-mono">14 - 18%</span>
                <span className="text-xs text-stone-400 block mt-1">Farmer receives very little</span>
              </div>

              <ul className="text-xs text-stone-300 space-y-2.5 text-left border-t border-stone-800 pt-4">
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> 4 to 6 middlemen take most of the profit
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> 25-30% food wasted in slow uncooled transport
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> Farmers wait 30-60 days to get paid
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800/60 flex justify-center items-end gap-1">
              <div className="w-5 h-2 bg-stone-600 rounded-xs"></div>
              <div className="w-5 h-3 bg-stone-600 rounded-xs"></div>
            </div>
          </div>

          {/* Column 2: Farm2Market Direct (Hero) */}
          <div className="bg-gradient-to-b from-[#422513] to-[#2e180c] p-6 rounded-2xl border-2 border-farm-gold text-center relative flex flex-col justify-between shadow-2xl">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-farm-gold text-stone-950 text-[10px] font-extrabold uppercase px-3.5 py-1 rounded-full tracking-widest shadow-sm">
              Fair &amp; Direct Standard
            </div>
            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-farm-gold/20 border border-farm-gold flex items-center justify-center text-xl mb-4 text-farm-gold">
                🌾
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-amber-100">Farm2Market Direct</h3>
              <p className="text-xs text-amber-200/80 mt-1">Direct sales and temperature-controlled vans</p>

              <div className="my-6">
                <span className="text-4xl font-extrabold text-farm-gold font-mono">85%</span>
                <span className="text-xs text-amber-200 block mt-1">Paid directly to the farmer</span>
              </div>

              <ul className="text-xs text-amber-100 space-y-2.5 text-left border-t border-amber-900/60 pt-4">
                <li className="flex items-center gap-2">
                  <span className="text-farm-gold font-bold">✓</span> Direct farm pickup within hours of harvest
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-farm-gold font-bold">✓</span> Immediate online payment to farmer upon delivery
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-farm-gold font-bold">✓</span> Advance orders help farmers plan seed and water
                </li>
              </ul>
            </div>

            {/* Stacks of gold coins */}
            <div className="mt-6 pt-4 border-t border-amber-900/60 flex justify-center items-end gap-1.5">
              <div className="flex flex-col gap-0.5">
                <div className="w-6 h-2 bg-farm-gold rounded-xs"></div>
                <div className="w-6 h-2 bg-farm-gold-deep rounded-xs"></div>
                <div className="w-6 h-2 bg-amber-600 rounded-xs"></div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="w-6 h-2 bg-farm-gold rounded-xs"></div>
                <div className="w-6 h-2 bg-farm-gold rounded-xs"></div>
                <div className="w-6 h-2 bg-farm-gold-deep rounded-xs"></div>
                <div className="w-6 h-2 bg-amber-600 rounded-xs"></div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="w-6 h-2 bg-farm-gold rounded-xs"></div>
                <div className="w-6 h-2 bg-farm-gold-deep rounded-xs"></div>
              </div>
            </div>
          </div>

          {/* Column 3: Delivery & Platform Fund */}
          <div className="bg-[#29170c]/80 p-6 rounded-2xl border border-stone-800 text-center flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xl mb-4 text-emerald-400">
                🌱
              </div>
              <h3 className="font-serif-heading text-2xl font-bold text-amber-100">Delivery &amp; Platform</h3>
              <p className="text-xs text-stone-400 mt-1">Cold storage vans &amp; food quality testing</p>

              <div className="my-6">
                <span className="text-4xl font-bold text-emerald-400 font-mono">15%</span>
                <span className="text-xs text-stone-400 block mt-1">Covers delivery &amp; app protection</span>
              </div>

              <ul className="text-xs text-stone-300 space-y-2.5 text-left border-t border-stone-800 pt-4">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> 10% for refrigerated vans and delivery drivers
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> 5% for safe online payments and food testing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Full money-back guarantee for spoiled goods
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800/60 flex justify-center items-end gap-2">
              <svg fill="none" height="24" viewBox="0 0 50 24" width="50">
                <path d="M8 12 C8 6, 20 6, 20 12 Z" fill="#cc3d2b"></path>
                <rect fill="#fef3c7" height="10" width="4" x="12" y="12"></rect>
                <path d="M26 8 C26 2, 42 2, 42 8 Z" fill="#cc3d2b"></path>
                <rect fill="#fef3c7" height="14" width="5" x="32" y="8"></rect>
              </svg>
            </div>
          </div>
        </div>

        {/* Fair Price Simulator Interactive Slider */}
        <div className="mt-14 max-w-xl mx-auto bg-[#231207] p-6 rounded-2xl border border-amber-900/70 shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-200 mb-2">
            <span>Monthly Household / Commercial Order Basket</span>
            <span className="text-farm-gold text-base font-bold font-mono animate-pulse">
              ₹{basketBudget.toLocaleString('en-IN')} / month
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { label: '🏡 Single (₹1,200)', val: 1200 },
              { label: '👨‍👩‍👦 Family (₹2,400)', val: 2400 },
              { label: '🥐 Bistro (₹8,000)', val: 8000 },
              { label: '🏢 Bulk (₹20,000)', val: 20000 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setBasketBudget(preset.val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  basketBudget === preset.val
                    ? 'bg-farm-gold text-stone-950 shadow-xs scale-105'
                    : 'bg-[#321c0f] text-amber-200 border border-amber-900/60 hover:bg-[#3c2415]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          <input
            type="range"
            min={800}
            max={20000}
            step={200}
            value={basketBudget}
            onChange={(e) => setBasketBudget(Number(e.target.value))}
            className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-farm-orange"
          />

          {/* Visual Percentage Distribution Bar */}
          <div className="w-full h-2.5 rounded-full overflow-hidden flex mt-3 border border-stone-800">
            <div style={{ width: '85%' }} className="bg-emerald-500 h-full" title="85% Farmer Net"></div>
            <div style={{ width: '10%' }} className="bg-amber-400 h-full" title="10% Soil Health Fund"></div>
            <div style={{ width: '5%' }} className="bg-sky-400 h-full" title="5% Tech & Telemetry"></div>
          </div>

          <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-mono">
            <span>₹800 / Single Basket</span>
            <span>₹2,400 / Family Share</span>
            <span>₹20,000 / Restaurant Bulk</span>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-300">Direct FPO &amp; Farmer Bank Payout (85%):</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">
                ₹{farmerDirectShare.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-400 text-[11px]">
              <span>Regenerative Soil &amp; Seed Testing (10%):</span>
              <span className="font-mono text-amber-300">₹{soilFundShare.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-stone-500 text-[11px]">
              <span>Cold-Chain Telemetry &amp; Platform Maintenance (5%):</span>
              <span className="font-mono text-stone-300">₹{platformTechShare.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
