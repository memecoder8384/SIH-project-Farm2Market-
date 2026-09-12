import React, { useState, useEffect } from 'react';
import { Shipment, TrackingPoint } from '../../types/tradeFlow';
import { VehicleMarker } from './VehicleMarker';
import {
  MapPin,
  Navigation,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Thermometer,
  ShieldCheck,
  Clock,
  Gauge,
  Layers,
} from 'lucide-react';

interface TrackingMapProps {
  shipment: Shipment;
  onUpdateProgress?: (progress: number) => void;
  onToggleRoute?: () => void;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  shipment,
  onUpdateProgress,
  onToggleRoute,
}) => {
  const initialProgress = shipment.trackingData?.progressPercent ?? 0;
  const [progress, setProgress] = useState(initialProgress);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Synchronize with external shipment changes when id or progressPercent changes
  useEffect(() => {
    if (shipment.trackingData?.progressPercent !== undefined) {
      setProgress(shipment.trackingData.progressPercent);
    }
  }, [shipment.id, shipment.trackingData?.progressPercent]);

  // Simulation timer - pure updater without calling onUpdateProgress inside setState
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return Math.min(100, prev + 1 * simSpeed);
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Notify parent component outside of setState callback when progress reaches 100 or when playing
  useEffect(() => {
    if (onUpdateProgress && isPlaying) {
      const timer = setTimeout(() => {
        onUpdateProgress(Math.round(progress));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [Math.round(progress), isPlaying, onUpdateProgress]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    if (onUpdateProgress) onUpdateProgress(val);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    if (onUpdateProgress) onUpdateProgress(0);
  };

  // Bezier curve calculations for vector map:
  // Pickup: (80, 260) -> Mid 1: (180, 160) -> Mid 2: (320, 210) -> Delivery: (480, 110)
  // If AI optimized route is active, the curve is smoother & avoids detour
  const isOptimized = shipment.aiOptimization?.isOptimizedRouteApplied ?? false;

  const getCoordinatesOnCurve = (pct: number) => {
    const t = Math.max(0, Math.min(1, pct / 100));
    // Points
    const p0 = { x: 70, y: 250 };
    const p1 = isOptimized ? { x: 190, y: 150 } : { x: 170, y: 90 };
    const p2 = isOptimized ? { x: 330, y: 170 } : { x: 330, y: 240 };
    const p3 = { x: 490, y: 100 };

    // Cubic Bezier: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
    const x =
      Math.pow(1 - t, 3) * p0.x +
      3 * Math.pow(1 - t, 2) * t * p1.x +
      3 * (1 - t) * Math.pow(t, 2) * p2.x +
      Math.pow(t, 3) * p3.x;

    const y =
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * p1.y +
      3 * (1 - t) * Math.pow(t, 2) * p2.y +
      Math.pow(t, 3) * p3.y;

    return { x, y };
  };

  const vehiclePos = getCoordinatesOnCurve(progress);
  const originalDist = shipment.aiOptimization?.originalDistanceKm ?? 145;
  const optimizedDist = shipment.aiOptimization?.optimizedDistanceKm ?? 122;
  const distanceRemaining = Math.max(
    0,
    Math.round((isOptimized ? optimizedDist : originalDist) * (1 - progress / 100))
  );

  const speed = progress >= 100 || !isPlaying ? 0 : 54;
  const temp = shipment.trackingData?.coldChainTempCelsius ?? 4.2;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm relative transition-all">
      {/* Top Map Header & Live Status Bar */}
      <div className="p-4 sm:p-5 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>● LIVE GPS TELEMETRY</span>
          </div>

          <span className="text-xs text-stone-300 hidden sm:inline-block font-mono">
            Tracking #{shipment.trackingNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleRoute && (
            <button
              type="button"
              onClick={onToggleRoute}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isOptimized
                  ? 'bg-farm-orange text-white shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isOptimized ? 'AI Route Active ✓' : 'Switch to AI Route'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-stone-800 rounded-xl p-1 border border-stone-700">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 hover:bg-stone-700 rounded-lg text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Simulation' : 'Play Live Route'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 hover:bg-stone-700 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative w-full h-80 sm:h-96 bg-[#f7f8f6] overflow-hidden select-none border-b border-stone-200">
        {/* Soft Grid Terrain Map Lines */}
        <svg className="w-full h-full" viewBox="0 0 560 360" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e7eae3" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="altRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* Grid background */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Topographical Rivers / Regional Curves */}
          <path
            d="M -20 280 Q 140 220 280 290 T 580 240"
            fill="none"
            stroke="#d5e8f5"
            strokeWidth="14"
            opacity="0.6"
          />

          {/* Alternate Original Route (dashed grey) */}
          <path
            d="M 70 250 C 170 90, 330 240, 490 100"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="transition-opacity duration-300"
            opacity={isOptimized ? 0.6 : 0.9}
          />

          {/* Active Route Path */}
          <path
            d={
              isOptimized
                ? 'M 70 250 C 190 150, 330 170, 490 100'
                : 'M 70 250 C 170 90, 330 240, 490 100'
            }
            fill="none"
            stroke={isOptimized ? 'url(#routeGradient)' : '#f97316'}
            strokeWidth={isOptimized ? '5' : '4'}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Origin Marker (Farm) */}
          <circle cx="70" cy="250" r="10" fill="#10b981" opacity="0.2" />
          <circle cx="70" cy="250" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

          {/* Destination Marker (Buyer) */}
          <circle cx="490" cy="100" r="10" fill="#f97316" opacity="0.2" />
          <circle cx="490" cy="100" r="6" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
        </svg>

        {/* Origin Label Tag */}
        <div className="absolute left-6 bottom-16 sm:bottom-20 z-10 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-stone-200 shadow-sm text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <strong className="text-stone-900 font-semibold">Origin:</strong>
            <span className="text-stone-600 truncate max-w-[140px] sm:max-w-[180px]">
              {shipment.dispatchDetails?.pickupLocation || shipment.order?.fpoName || 'Origin Packhouse'}
            </span>
          </div>
        </div>

        {/* Destination Label Tag */}
        <div className="absolute right-6 top-8 sm:top-12 z-10 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-stone-200 shadow-sm text-xs text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-stone-600 truncate max-w-[140px] sm:max-w-[180px]">
              {shipment.dispatchDetails?.deliveryLocation || shipment.order?.deliveryLocation || 'Destination Hub'}
            </span>
            <strong className="text-stone-900 font-semibold">:Destination</strong>
            <span className="w-2 h-2 rounded-full bg-farm-orange" />
          </div>
        </div>

        {/* Moving Vehicle Marker HTML Overlay */}
        <div
          className="absolute z-20 transition-all duration-200 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${(vehiclePos.x / 560) * 100}%`,
            top: `${(vehiclePos.y / 360) * 100}%`,
          }}
        >
          <VehicleMarker
            vehicleNumber={shipment.dispatchDetails?.vehicleNumber}
            speedKmH={speed}
            tempCelsius={temp}
            isSimulating={isPlaying}
          />
        </div>

        {/* Telemetry Float Cards (Bottom Overlay) */}
        <div className="absolute left-4 right-4 bottom-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3 text-xs font-mono pointer-events-auto">
            <div className="flex items-center gap-1 text-stone-700">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>ETA: <strong>{progress >= 100 ? 'Delivered' : shipment.trackingData?.estimatedArrivalFormatted || 'In Transit'}</strong></span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1 text-stone-700">
              <Navigation className="w-3.5 h-3.5 text-farm-orange" />
              <span><strong>{distanceRemaining} km</strong> left</span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1 text-emerald-800 font-bold">
              <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
              <span>{temp}°C</span>
            </div>
          </div>

          <div className="bg-stone-900/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-[11px] font-mono shadow-xs pointer-events-auto">
            {progress < 100 ? (
              <span>Transit: {Math.round(progress)}% Completed</span>
            ) : (
              <span className="text-emerald-400 font-bold">✓ Destination Reached</span>
            )}
          </div>
        </div>
      </div>

      {/* Scrubbing & Speed Control Bar */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex-1 flex items-center gap-3">
          <span className="text-stone-400 font-medium text-[11px] uppercase shrink-0">Scrub Route:</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={progress}
            onChange={handleSliderChange}
            className="w-full accent-farm-orange cursor-pointer"
          />
          <span className="font-mono font-bold text-stone-800 w-10 text-right">{Math.round(progress)}%</span>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <span className="text-stone-400 text-[11px]">Speed:</span>
          {[1, 2, 4].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setSimSpeed(spd)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                simSpeed === spd ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
