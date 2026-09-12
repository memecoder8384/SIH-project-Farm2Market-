import React, { useState, useEffect, useCallback } from 'react';
import {
  aiApi,
  LocationDistrict,
  CropDemandMetric,
  MarketSummaryResponse,
  PredictDemandResponse,
} from '../services/aiApi';
import { DemandLevelBadge } from '../components/demand/DemandLevelBadge';
import { TrendIndicator } from '../components/demand/TrendIndicator';
import { DemandForecastChart } from '../components/demand/DemandForecastChart';
import {
  MapPin,
  Calendar,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Package,
  ShoppingCart,
  IndianRupee,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Sprout,
  CalendarClock,
  Scale,
  Users,
} from 'lucide-react';

interface AiDemandForecastingProps {
  onNavigate: (tab: string, param?: any) => void;
}

// Visual crop asset mapping matching public/images/products
const CROP_IMAGE_MAP: Record<string, string> = {
  Tomato: '/images/products/tomatoes.jpg',
  Potato: '/images/products/potatoes.jpg',
  Onion: '/images/products/onions.jpg',
  Carrot: '/images/products/carrots.jpg',
  Cauliflower: '/images/products/cauliflower.jpg',
  Cabbage: '/images/products/cabbage.jpg',
  Spinach: '/images/products/spinach.jpg',
  Peas: '/images/products/green_peas.jpg',
  Brinjal: '/images/products/brinjal.jpg',
  Okra: '/images/products/ladyfinger.jpg',
};

export const AiDemandForecastingPage: React.FC<AiDemandForecastingProps> = ({ onNavigate }) => {
  // -------------------------------------------------------------------------
  // State: Locations & Filters
  // -------------------------------------------------------------------------
  const [locations, setLocations] = useState<LocationDistrict[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Meerut');
  const [selectedCity, setSelectedCity] = useState<string>('Meerut');
  const [period, setPeriod] = useState<number>(7);

  // -------------------------------------------------------------------------
  // State: Market Data & Selected Crop
  // -------------------------------------------------------------------------
  const [demandList, setDemandList] = useState<CropDemandMetric[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummaryResponse | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [predictionData, setPredictionData] = useState<PredictDemandResponse | null>(null);

  // -------------------------------------------------------------------------
  // State: View Persona (Farmer Opportunity vs Buyer Sourcing)
  // -------------------------------------------------------------------------
  const [activePersona, setActivePersona] = useState<'farmer' | 'buyer'>('farmer');

  // -------------------------------------------------------------------------
  // State: Loading & Error Status
  // -------------------------------------------------------------------------
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isMarketLoading, setIsMarketLoading] = useState<boolean>(false);
  const [isPredictionLoading, setIsPredictionLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // 1. Initial Load: Fetch Locations Registry
  // -------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    const initLocations = async () => {
      try {
        setIsInitializing(true);
        setErrorMessage(null);
        const res = await aiApi.getLocations();
        if (isMounted && res.locations && res.locations.length > 0) {
          setLocations(res.locations);

          // Prefer Meerut as initial default if present, else first district
          const defaultLoc = res.locations.find((l) => l.district.toLowerCase() === 'meerut') || res.locations[0];
          setSelectedDistrict(defaultLoc.district);
          setSelectedCity(defaultLoc.cities[0] || '');
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err.message || 'Unable to connect to AI Service backend.');
        }
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    initLocations();
    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------------------------------------------------------
  // 2. Fetch Demand Overview & Market Summary
  // -------------------------------------------------------------------------
  const loadMarketData = useCallback(async () => {
    if (!selectedDistrict || !selectedCity) return;

    try {
      setIsMarketLoading(true);
      setErrorMessage(null);

      const [demandRes, summaryRes] = await Promise.all([
        aiApi.getDemand(selectedDistrict, selectedCity, period),
        aiApi.getMarketSummary(selectedDistrict, selectedCity, period),
      ]);

      setDemandList(demandRes.crops);
      setMarketSummary(summaryRes);

      // If currently selected crop is not in the new crop list or unset, default to top demand crop
      if (demandRes.crops.length > 0) {
        const hasCurrent = demandRes.crops.some((c) => c.crop === selectedCrop);
        if (!hasCurrent) {
          setSelectedCrop(demandRes.crops[0].crop);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to retrieve market demand metrics.');
    } finally {
      setIsMarketLoading(false);
    }
  }, [selectedDistrict, selectedCity, period, selectedCrop]);

  useEffect(() => {
    if (!isInitializing && selectedDistrict && selectedCity) {
      loadMarketData();
    }
  }, [selectedDistrict, selectedCity, period, isInitializing, loadMarketData]);

  // -------------------------------------------------------------------------
  // 3. Fetch ML Demand Prediction for Selected Crop
  // -------------------------------------------------------------------------
  const loadCropPrediction = useCallback(async () => {
    if (!selectedDistrict || !selectedCity || !selectedCrop) return;

    try {
      setIsPredictionLoading(true);
      const predRes = await aiApi.predictDemand(selectedDistrict, selectedCity, selectedCrop, period);
      setPredictionData(predRes);
    } catch (err: any) {
      console.error('Error fetching ML prediction:', err);
    } finally {
      setIsPredictionLoading(false);
    }
  }, [selectedDistrict, selectedCity, selectedCrop, period]);

  useEffect(() => {
    if (!isInitializing && selectedCrop) {
      loadCropPrediction();
    }
  }, [selectedCrop, selectedDistrict, selectedCity, period, isInitializing, loadCropPrediction]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const loc = locations.find((l) => l.district === district);
    if (loc && loc.cities.length > 0) {
      setSelectedCity(loc.cities[0]);
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handlePeriodChange = (days: number) => {
    setPeriod(days);
  };

  const currentAvailableCities = locations.find((l) => l.district === selectedDistrict)?.cities || [];

  // Selected crop historical metric from current demandList
  const selectedCropMetric = demandList.find((c) => c.crop === selectedCrop);

  // -------------------------------------------------------------------------
  // Dynamic Advice Generators
  // -------------------------------------------------------------------------
  const getFarmerOpportunityText = (level?: string, gap?: number) => {
    if (level === 'Very High') {
      return `Demand for ${selectedCrop} is very high in ${selectedCity}. Buyers want more stock than currently available${
        gap && gap > 0 ? `, with an estimated shortage of about ${gap.toLocaleString()} kg` : ''
      }. Farmers and FPOs should harvest and bring fresh produce to market now to get top prices.`;
    }
    if (level === 'High') {
      return `There is strong buyer demand for ${selectedCrop} across ${selectedDistrict} markets. Produce is selling quickly with steady buyer orders. This is a good time to sell with low risk of unsold stock.`;
    }
    if (level === 'Medium') {
      return `Demand for ${selectedCrop} is moderate. Daily sales match incoming stock well. Make sure your produce is graded well and check market rates before bringing large quantities.`;
    }
    return `Demand for ${selectedCrop} is currently low in ${selectedCity}. Produce is selling more slowly. Consider holding stock or selling in nearby markets where demand is higher.`;
  };

  const getBuyerProcurementText = (level?: string) => {
    if (level === 'Very High' || level === 'High') {
      return `Many buyers are competing for ${selectedCrop} in ${selectedCity}. Connecting directly with local farmers or FPOs will help you secure good supply and steady prices.`;
    }
    return `Plenty of ${selectedCrop} is available in the market. Buyers can easily purchase bulk quantities at good prices.`;
  };

  // -------------------------------------------------------------------------
  // Loading & Error States
  // -------------------------------------------------------------------------
  if (isInitializing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-stone-200 rounded-lg w-1/3" />
          <div className="h-4 bg-stone-100 rounded w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-stone-100 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-stone-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in duration-300">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Banner & Context */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-stone-200/80 gap-4">
        <div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            AI Demand Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Understand where demand is rising and identify better selling opportunities across local markets.
          </p>
        </div>

        {/* Action button & Live Status */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              loadMarketData();
              loadCropPrediction();
            }}
            disabled={isMarketLoading || isPredictionLoading}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
            title="Refresh latest mandi metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isMarketLoading || isPredictionLoading ? 'animate-spin text-farm-orange' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => onNavigate('marketplace')}
            className="px-4 py-2 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Global Error Banner if API connection fails */}
      {/* ------------------------------------------------------------------- */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Unable to load market data
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">{errorMessage}</p>
              <p className="text-[11px] text-amber-700 mt-1">
                Please check that the FastAPI service is running locally at{' '}
                <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">http://localhost:8000</code>.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              loadMarketData();
              loadCropPrediction();
            }}
            className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 2. Dynamic Filter Bar */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-stone-500 font-medium text-xs">
            <SlidersHorizontal className="w-4 h-4 text-farm-orange" />
            <span className="uppercase tracking-wider font-semibold text-stone-700">Filter Market:</span>
          </div>

          {/* District Dropdown */}
          <div className="relative">
            <label htmlFor="district-select" className="sr-only">
              Select District
            </label>
            <div className="flex items-center bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 focus-within:border-farm-orange transition-colors">
              <MapPin className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer pr-1"
              >
                {locations.map((loc) => (
                  <option key={loc.district} value={loc.district}>
                    District: {loc.district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <label htmlFor="city-select" className="sr-only">
              Select City
            </label>
            <div className="flex items-center bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 focus-within:border-farm-orange transition-colors">
              <span className="text-[11px] text-stone-400 font-medium mr-1.5">Mandi:</span>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer pr-1"
                disabled={currentAvailableCities.length === 0}
              >
                {currentAvailableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Forecast Period Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:self-auto">
          <span className="text-xs text-stone-500 font-medium mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Horizon:</span>
          </span>
          {[
            { label: '1 Day', value: 1 },
            { label: '7 Days', value: 7 },
            { label: '30 Days', value: 30 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => handlePeriodChange(item.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === item.value
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Reference Date Benchmark Pill */}
          {marketSummary && (
            <span className="text-[11px] text-stone-400 font-mono pl-2 border-l border-stone-200 hidden sm:inline-block">
              Anchor: {marketSummary.reference_date}
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Market Overview KPI Summary */}
      {/* ------------------------------------------------------------------- */}
      {marketSummary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Total Sold Volume */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Sold</span>
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900">
              {marketSummary.total_sold_kg.toLocaleString()}
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">kg bought by buyers</span>
          </div>

          {/* Card 2: Total Listed Volume */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total In Market</span>
              <Package className="w-4 h-4 text-farm-orange" />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900">
              {marketSummary.total_listed_kg.toLocaleString()}
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">kg brought to sell</span>
          </div>

          {/* Card 3: Clearance Rate */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Share Sold</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-700">
              {marketSummary.overall_selling_percentage}%
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">of total crops sold</span>
          </div>

          {/* Card 4: Avg Price */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Average Price</span>
              <IndianRupee className="w-4 h-4 text-farm-gold-deep" />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-stone-900">
              ₹{marketSummary.average_market_price.toFixed(2)}
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">average price per kg</span>
          </div>

          {/* Card 5: Highest Demand Crop */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Highest Demand</span>
              <Sparkles className="w-4 h-4 text-farm-orange" />
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900 truncate">
              {marketSummary.highest_demand_crop}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Selling the fastest</span>
          </div>

          {/* Card 6: Lowest Demand Crop */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Lowest Demand</span>
              <Layers className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-700 truncate">
              {marketSummary.lowest_demand_crop}
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">Selling more slowly</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 4. Main Two-Column Layout: Demand Ranking Table & Selected ML Forecast */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Demand Opportunity Ranking List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif-heading text-xl font-bold text-stone-900">
                Demand Opportunity Ranking
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Crops sorted by buyer demand in {selectedCity}
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
              {demandList.length} Crops
            </span>
          </div>

          {/* Ranking Table / Rows */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {demandList.map((item, idx) => {
              const isSelected = item.crop === selectedCrop;
              const cropImg = CROP_IMAGE_MAP[item.crop];

              return (
                <div
                  key={item.crop}
                  onClick={() => setSelectedCrop(item.crop)}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-orange-50/50 border-farm-orange shadow-2xs ring-1 ring-farm-orange/30'
                      : 'bg-stone-50/50 border-stone-200/70 hover:bg-white hover:border-stone-300'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedCrop(item.crop);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <span className="text-[11px] font-mono font-bold text-stone-400 w-4 text-center shrink-0">
                      {idx + 1}
                    </span>

                    {/* Thumbnail Image */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
                      {cropImg ? (
                        <img
                          src={cropImg}
                          alt={item.crop}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-stone-500">
                          {item.crop[0]}
                        </div>
                      )}
                    </div>

                    {/* Crop Name and Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-stone-900 truncate">{item.crop}</h4>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-farm-orange shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span>Sold: <strong className="text-stone-700 font-mono">{item.total_sold_kg.toLocaleString()} kg</strong></span>
                        <span>•</span>
                        <span>₹{item.average_price_per_kg.toFixed(1)}/kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Demand Level & Score Pill */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <DemandLevelBadge level={item.demand_level} size="sm" />
                    <div className="flex items-center gap-1.5">
                      <TrendIndicator trend={item.trend} showLabel={false} />
                      <span className="font-mono text-xs font-bold text-stone-800">
                        {item.demand_score}<span className="text-[10px] text-stone-400">/100</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Click any crop to see sales forecasts and selling advice.</span>
          </div>
        </div>

        {/* Right Column (7 cols): Selected Crop Detail & ML Forecast */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selected Crop Header Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-4">
              <div className="flex items-center gap-4">
                {/* Large Thumbnail */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-2xs">
                  {CROP_IMAGE_MAP[selectedCrop] ? (
                    <img
                      src={CROP_IMAGE_MAP[selectedCrop]}
                      alt={selectedCrop}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-stone-500">
                      {selectedCrop[0]}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900">
                      {selectedCrop}
                    </h2>
                    {predictionData && (
                      <DemandLevelBadge level={predictionData.demand_level} size="md" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-farm-orange" />
                    <span>{selectedCity}, {selectedDistrict} Mandi Hub</span>
                    <span>•</span>
                    <span>{period}-Day Analysis</span>
                  </p>
                </div>
              </div>

              {/* Persona Context Toggle (Farmer vs Buyer view) */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
                <button
                  onClick={() => setActivePersona('farmer')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activePersona === 'farmer'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>Farmer / FPO</span>
                </button>
                <button
                  onClick={() => setActivePersona('buyer')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activePersona === 'buyer'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Scale className="w-3 h-3" />
                  <span>Buyer / Trader</span>
                </button>
              </div>
            </div>

            {/* Selected Crop Key Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              {/* Predicted Demand */}
              <div className="bg-orange-50/50 border border-orange-200/70 p-3.5 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-farm-orange block">
                  Predicted Demand
                </span>
                <div className="font-mono text-lg sm:text-xl font-bold text-stone-900 mt-1">
                  {predictionData ? `${predictionData.predicted_demand_kg.toLocaleString()} kg` : '—'}
                </div>
                <span className="text-[10px] text-stone-500 block">Expected sales in next {period} days</span>
              </div>

              {/* Standing Supply */}
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block">
                  Current Supply
                </span>
                <div className="font-mono text-lg sm:text-xl font-bold text-stone-800 mt-1">
                  {predictionData ? `${predictionData.current_supply_kg.toLocaleString()} kg` : '—'}
                </div>
                <span className="text-[10px] text-stone-400 block">Unsold stock in market</span>
              </div>

              {/* Demand Gap */}
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block">
                  Market Balance
                </span>
                <div
                  className={`font-mono text-lg sm:text-xl font-bold mt-1 ${
                    predictionData && predictionData.demand_gap_kg > 0
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {predictionData ? (
                    `${predictionData.demand_gap_kg > 0 ? '+' : ''}${predictionData.demand_gap_kg.toLocaleString()} kg`
                  ) : (
                    '—'
                  )}
                </div>
                <span className="text-[10px] text-stone-500 block">
                  {predictionData && predictionData.demand_gap_kg > 0 ? 'Market Shortage (Great to Sell)' : 'Plenty of Stock Available'}
                </span>
              </div>

              {/* Avg Market Price */}
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block">
                  Average Price
                </span>
                <div className="font-mono text-lg sm:text-xl font-bold text-stone-900 mt-1">
                  {selectedCropMetric ? `₹${selectedCropMetric.average_price_per_kg.toFixed(2)}` : '—'}
                </div>
                <span className="text-[10px] text-stone-400 block">Average price per kg</span>
              </div>
            </div>
          </div>

          {/* ML Demand Trajectory Forecast Chart */}
          <DemandForecastChart
            data={predictionData?.daily_predictions || []}
            cropName={selectedCrop}
            periodDays={period}
            isLoading={isPredictionLoading}
          />

          {/* Expanded Farmer & FPO Selling Opportunity Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100/70 text-farm-orange flex items-center justify-center font-bold text-sm border border-orange-200/60 shadow-2xs">
                  <Sprout className="w-5 h-5 text-farm-orange" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-stone-900 font-serif-heading tracking-tight">
                    Farmer &amp; FPO Selling Opportunity
                  </h4>
                  <p className="text-xs text-stone-500">
                    Market demand and selling advice for {selectedCrop} in {selectedCity}
                  </p>
                </div>
              </div>

              {predictionData && (
                <DemandLevelBadge level={predictionData.demand_level} size="md" />
              )}
            </div>

            {/* Main Opportunity Narrative */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {activePersona === 'farmer'
                ? getFarmerOpportunityText(predictionData?.demand_level, predictionData?.demand_gap_kg)
                : getBuyerProcurementText(predictionData?.demand_level)}
            </p>

            {/* Structured Opportunity Insight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {/* 1. Recommended Timing */}
              <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 transition-colors hover:border-stone-300">
                <div className="flex items-center gap-2 text-stone-500 mb-1.5">
                  <CalendarClock className="w-4 h-4 text-farm-orange shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">Best Time to Sell</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-900">
                  {predictionData?.demand_level === 'Very High' || predictionData?.demand_level === 'High'
                    ? 'Immediate Dispatch (Next 2–3 Days)'
                    : predictionData?.demand_level === 'Medium'
                    ? 'Staggered Weekly Batches'
                    : 'Hold or Check Other Markets'}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                  {predictionData?.demand_level === 'Very High' || predictionData?.demand_level === 'High'
                    ? 'Buyers are actively buying right now. Best time to sell for top prices.'
                    : 'Bring crops in batches to avoid low prices from oversupply.'}
                </p>
              </div>

              {/* 2. Projected Market Absorption */}
              <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 transition-colors hover:border-stone-300">
                <div className="flex items-center gap-2 text-stone-500 mb-1.5">
                  <Scale className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">Expected Demand</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                  {predictionData ? `${predictionData.predicted_demand_kg.toLocaleString()} kg` : '—'}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                  {predictionData && predictionData.demand_gap_kg > 0
                    ? `Estimated market shortage of ${predictionData.demand_gap_kg.toLocaleString()} kg in next ${period} days.`
                    : 'Plenty of stock available. Focus on clean, high quality produce.'}
                </p>
              </div>

              {/* 3. Indicative Clearing Price */}
              <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 transition-colors hover:border-stone-300">
                <div className="flex items-center gap-2 text-stone-500 mb-1.5">
                  <IndianRupee className="w-4 h-4 text-farm-gold-deep shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">Average Market Price</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                  {selectedCropMetric ? `₹${selectedCropMetric.average_price_per_kg.toFixed(2)} / kg` : '—'}
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                  Average selling price in {selectedCity}. Check other markets in Price Engine.
                </p>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3.5 border-t border-stone-100 gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Selling directly to buyers helps you save on middleman commissions.</span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Find Buyers in {selectedCity}
                </button>

                <button
                  onClick={() => onNavigate('price-recommendation')}
                  className="px-4 py-2 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Check Prices in Price Engine</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
