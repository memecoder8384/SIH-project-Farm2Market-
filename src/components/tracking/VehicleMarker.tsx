import React from 'react';
import { Truck } from 'lucide-react';

interface VehicleMarkerProps {
  vehicleNumber?: string;
  speedKmH: number;
  tempCelsius: number;
  isSimulating?: boolean;
}

export const VehicleMarker: React.FC<VehicleMarkerProps> = ({
  vehicleNumber = 'MH 15 AB 8941',
  speedKmH,
  tempCelsius,
  isSimulating = false,
}) => {
  return (
    <div className="relative group cursor-pointer">
      {/* Pulsing Radar Ring */}
      <div className="absolute -inset-2.5 rounded-full bg-farm-orange/30 animate-ping pointer-events-none" />
      <div className="absolute -inset-1 rounded-full bg-farm-orange/40 pointer-events-none" />

      {/* Main Vehicle Marker Token */}
      <div className="relative z-10 w-9 h-9 rounded-2xl bg-stone-900 border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform group-hover:scale-110">
        <Truck className="w-4 h-4 text-farm-orange" />
      </div>

      {/* Live Mini Badge on Top */}
      <div className="absolute -top-1.5 -right-1.5 z-20 w-3 h-3 bg-emerald-500 border border-white rounded-full flex items-center justify-center">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      </div>

      {/* Tooltip on Hover / Permanent Display */}
      <div className="absolute left-1/2 -bottom-11 -translate-x-1/2 bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-lg whitespace-nowrap shadow-md pointer-events-none border border-stone-700/80">
        <span className="font-bold text-farm-orange">{speedKmH} km/h</span> • {tempCelsius}°C
      </div>
    </div>
  );
};
