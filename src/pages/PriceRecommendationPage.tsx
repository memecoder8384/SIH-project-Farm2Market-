import React, { useState, useEffect } from 'react';
import { MOCK_PRICE_RECOMMENDATIONS } from '../data/mockData';
import { PriceRecommendation } from '../types';
import { DashboardStatSkeleton } from '../components/common/ShadowLoader';
import { PriceEngineLoader } from '../components/common/PriceEngineLoader';
import { TrendingUp, DollarSign, Calculator, HelpCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface PriceRecommendationProps {
  onNavigate: (tab: string, param?: any) => void;
}

export const PriceRecommendationPage: React.FC<PriceRecommendationProps> = ({ onNavigate }) => {
  const [selectedCropKey, setSelectedCropKey] = useState<string>('prod-1');
  const [yieldTons, setYieldTons] = useState<number>(10);
  const [costPerKg, setCostPerKg] = useState<number>(14);
  const [targetSellingPrice, setTargetSellingPrice] = useState<number>(38);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    // Show typewriter loading animation when entering Price Engine page
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const handleCropChange = (cropKey: string) => {
    setIsCalculating(true);
    setSelectedCropKey(cropKey);
    const rec = MOCK_PRICE_RECOMMENDATIONS[cropKey];
    if (rec) setTargetSellingPrice(rec.aiOptimalRetailPrice);
    setTimeout(() => setIsCalculating(false), 120);
  };

  const currentRec: PriceRecommendation =
    MOCK_PRICE_RECOMMENDATIONS[selectedCropKey] || MOCK_PRICE_RECOMMENDATIONS['prod-1'];

  // Calculations
  const totalKg = yieldTons * 1000;
  const totalProductionCost = totalKg * costPerKg;
  const directGrossRevenue = totalKg * targetSellingPrice;
  const directFarmerNetProfit = Math.max(0, directGrossRevenue - totalProductionCost);

  // Traditional middleman comparison
  const traditionalSellingPrice = currentRec.localWholesalePrice;
  const traditionalGrossRevenue = totalKg * traditionalSellingPrice;
  const traditionalNetProfit = Math.max(0, traditionalGrossRevenue - totalProductionCost);

  const profitAdvantage = directFarmerNetProfit - traditionalNetProfit;
  const percentGain =
    traditionalNetProfit > 0
      ? Math.round((profitAdvantage / traditionalNetProfit) * 100)
      : 85;

  if (isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PriceEngineLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-200 gap-4">
        <div>
          <span className="eyebrow-badge text-farm-orange">FAIR CROP PRICING</span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Check Fair Crop Prices &amp; Profits
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Find the best price for your harvest with no middleman cuts. Compare normal mandi rates with direct farm prices.
          </p>
        </div>

        {/* Commodity Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">Select Crop:</span>
          <select
            value={selectedCropKey}
            onChange={(e) => handleCropChange(e.target.value)}
            className="text-xs font-bold rounded-xl border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="prod-1">Tomatoes (Nashik Valley)</option>
            <option value="prod-2">Potatoes (Malwa Plateau)</option>
            <option value="prod-3">Onions (Nashik Valley)</option>
            <option value="prod-4">Carrots (Bangalore Rural)</option>
            <option value="prod-6">Cauliflower (Kangra Valley)</option>
          </select>
        </div>
      </div>

      {/* 4 Comparative Rate Benchmarks with Shadow Loader */}
      {isCalculating ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          <DashboardStatSkeleton />
          <DashboardStatSkeleton />
          <DashboardStatSkeleton />
          <DashboardStatSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {/* Mandi MSP */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Govt Support Price (MSP)
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-stone-800">
                ₹{currentRec.currentMandiMsp}
              </span>
              <span className="text-xs text-stone-400">/ kg</span>
            </div>
            <p className="text-xs text-stone-500 mt-2">Official Government MSP rate</p>
          </div>

          {/* Local Wholesale / Broker Price */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Local Mandi Broker Price
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-red-600">
                ₹{currentRec.localWholesalePrice}
              </span>
              <span className="text-xs text-stone-400">/ kg</span>
            </div>
            <p className="text-xs text-red-600 mt-2">After middleman cuts and deductions</p>
          </div>

          {/* AI Optimal Bulk Rate */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Recommended Bulk Rate
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-sky-700">
                ₹{currentRec.aiOptimalBulkPrice}
              </span>
              <span className="text-xs text-stone-400">/ kg</span>
            </div>
            <p className="text-xs text-sky-700 mt-2">For restaurants &amp; 100kg+ orders</p>
          </div>

          {/* AI Optimal Direct Retail */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-orange-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-farm-orange">
              Recommended Direct Price
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-farm-orange">
                ₹{currentRec.aiOptimalRetailPrice}
              </span>
              <span className="text-xs text-stone-600">/ kg</span>
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-2">
              +{currentRec.farmerProfitIncreasePercent}% Extra Farmer Profit
            </p>
          </div>
        </div>
      )}

      {/* Interactive Profit Simulator */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Console */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <Calculator className="w-5 h-5 text-farm-orange" />
            <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
              Calculate Your Harvest Profit
            </h3>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-semibold text-stone-500 self-center mr-1">Quick Scenarios:</span>
            <button
              onClick={() => {
                setYieldTons(3);
                setCostPerKg(12);
                setTargetSellingPrice(currentRec.currentMandiMsp + 6);
              }}
              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              🌱 Small Farm (3 Tons)
            </button>
            <button
              onClick={() => {
                setYieldTons(12);
                setCostPerKg(14);
                setTargetSellingPrice(currentRec.aiOptimalRetailPrice);
              }}
              className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-farm-orange rounded-lg text-xs font-bold transition-colors cursor-pointer border border-orange-200"
            >
              ⭐ Recommended (12 Tons)
            </button>
            <button
              onClick={() => {
                setYieldTons(30);
                setCostPerKg(18);
                setTargetSellingPrice(currentRec.aiOptimalRetailPrice + 15);
              }}
              className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-emerald-200"
            >
              🏆 Large Harvest (30 Tons)
            </button>
          </div>

          {/* Dynamic Visual Margin Bar */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-1.5">
              <span>Per Kg Profit Breakdown</span>
              <span className="text-emerald-700">₹{targetSellingPrice - costPerKg} Net Profit ({Math.round(((targetSellingPrice - costPerKg) / targetSellingPrice) * 100)}%)</span>
            </div>
            <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex">
              <div
                className="bg-stone-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (costPerKg / targetSellingPrice) * 100)}%` }}
                title={`Production Cost: ₹${costPerKg}`}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.max(0, ((targetSellingPrice - costPerKg) / targetSellingPrice) * 100)}%` }}
                title={`Farmer Profit: ₹${targetSellingPrice - costPerKg}`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-stone-400"></span> Cost: ₹{costPerKg}/kg</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Direct Profit: ₹{targetSellingPrice - costPerKg}/kg</span>
            </div>
          </div>

          {/* Slider 1: Yield Volume */}
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
              <span>Total Harvest Quantity:</span>
              <span className="font-mono text-farm-orange text-sm">{yieldTons} Tons ({totalKg.toLocaleString()} kg)</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={yieldTons}
              onChange={(e) => setYieldTons(Number(e.target.value))}
              className="w-full accent-farm-orange cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
              <span>1 Ton (Small Farm)</span>
              <span>25 Tons (Mid Farm)</span>
              <span>50 Tons (Large Farm)</span>
            </div>
          </div>

          {/* Slider 2: Cultivation Cost */}
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
              <span>Farming Cost (Seeds, Water, Fertilizer):</span>
              <span className="font-mono text-stone-900 text-sm">₹{costPerKg} / kg</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={costPerKg}
              onChange={(e) => setCostPerKg(Number(e.target.value))}
              className="w-full accent-farm-orange cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
              <span>₹5/kg (Low cost)</span>
              <span>₹15/kg (Standard organic)</span>
              <span>₹30/kg (High input polyhouse)</span>
            </div>
          </div>

          {/* Slider 3: Target Direct Price */}
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
              <span>Your Selling Price on Farm2Market:</span>
              <span className="font-mono text-emerald-700 text-sm font-bold">₹{targetSellingPrice} / kg</span>
            </div>
            <input
              type="range"
              min={currentRec.currentMandiMsp}
              max={currentRec.aiOptimalRetailPrice + 20}
              step={1}
              value={targetSellingPrice}
              onChange={(e) => setTargetSellingPrice(Number(e.target.value))}
              className="w-full accent-farm-orange cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
              <span>Govt MSP: ₹{currentRec.currentMandiMsp}</span>
              <span>Recommended: ₹{currentRec.aiOptimalRetailPrice}</span>
              <span>Premium: ₹{currentRec.aiOptimalRetailPrice + 20}</span>
            </div>
          </div>

          {/* Pricing Factors Pill Tags */}
          <div className="pt-4 border-t border-stone-100">
            <span className="text-xs font-bold text-stone-700 block mb-2">
              Factors Affecting Crop Price:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Season &amp; Weather</span>
                <span className="font-bold text-stone-800">{currentRec.pricingFactors.seasonality}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Crop Quality &amp; Taste</span>
                <span className="font-bold text-stone-800">{currentRec.pricingFactors.qualityGradePremium}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Transport &amp; Delivery Cost</span>
                <span className="font-bold text-stone-800">{currentRec.pricingFactors.transportCostImpact}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Market Mandi Price</span>
                <span className="font-bold text-stone-800">{currentRec.pricingFactors.competitorWholesaleRate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#3c2415] text-amber-50 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-farm-gold sticky top-24">
            <span className="text-[10px] font-bold uppercase tracking-widest text-farm-gold block">
              Your Extra Earnings
            </span>
            <h4 className="font-serif-heading text-3xl font-bold text-amber-100 mt-1">
              +₹{profitAdvantage.toLocaleString()} More Profit
            </h4>
            <p className="text-xs text-stone-300 mt-1">
              Calculated on {yieldTons} tons compared to selling at a regular mandi.
            </p>

            <div className="mt-6 space-y-4 pt-4 border-t border-amber-900/80 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#2a170c] border border-amber-950 flex justify-between items-center">
                <div>
                  <span className="text-stone-400 text-[10px] block uppercase">Direct Farm2Market Profit</span>
                  <strong className="text-xl font-mono text-emerald-400">
                    ₹{directFarmerNetProfit.toLocaleString()}
                  </strong>
                </div>
                <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-800">
                  +{percentGain}% Boost
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#29170c]/60 border border-stone-800 flex justify-between items-center opacity-85">
                <div>
                  <span className="text-stone-400 text-[10px] block uppercase">Normal Mandi Profit</span>
                  <strong className="text-base font-mono text-red-300">
                    ₹{traditionalNetProfit.toLocaleString()}
                  </strong>
                </div>
                <span className="text-[11px] text-stone-400">After middleman cuts</span>
              </div>

              <div className="pt-2 text-[11px] text-amber-200/70 space-y-1">
                <p>• Farming Costs: ₹{totalProductionCost.toLocaleString()}</p>
                <p>• Total Sales at Your Price: ₹{directGrossRevenue.toLocaleString()}</p>
                <p>• 100% Guaranteed Safe Payments</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('farmer-dashboard')}
              className="mt-6 w-full py-3.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-md cursor-pointer"
            >
              Use This Price to List Crop →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
