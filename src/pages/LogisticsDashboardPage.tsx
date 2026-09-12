import React, { useState } from 'react';
import { MOCK_LOGISTICS_VEHICLES } from '../data/mockData';
import { LogisticsVehicle } from '../types';
import { Truck, Thermometer, Navigation, AlertCircle, CheckCircle2, RefreshCw, Gauge, MapPin } from 'lucide-react';

interface LogisticsDashboardProps {
  onNavigate: (tab: string, param?: any) => void;
}

export const LogisticsDashboardPage: React.FC<LogisticsDashboardProps> = ({ onNavigate }) => {
  const [vehicles, setVehicles] = useState<LogisticsVehicle[]>(MOCK_LOGISTICS_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<LogisticsVehicle>(vehicles[0]);

  const handleStatusUpdate = (id: string, newStatus: LogisticsVehicle['status']) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
    if (selectedVehicle.id === id) {
      setSelectedVehicle((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-200 gap-4">
        <div>
          <span className="eyebrow-badge text-farm-orange">DELIVERY FLEET TRACKER</span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Delivery Vans &amp; Route Tracking
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Live cool van tracking, storage temperatures, and direct pickup routes from local farms.
          </p>
        </div>

        <button
          onClick={() => alert('Refreshing live GPS and cooling status from delivery vans...')}
          className="px-4 py-2 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          <span>Refresh Van Status</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Active Cool Vans</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold font-mono text-stone-900">{vehicles.length} Vans</span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">100% Online</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">All vans connected with live GPS &amp; cooling</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Average Van Temp</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold font-mono text-sky-700">4.1°C</span>
            <span className="text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold border border-sky-100">Target 4.0°C</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">Cooling steady within safe range</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Van Space Filled</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold font-mono text-stone-900">82%</span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">Good Load</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">Shared trips save fuel &amp; transport costs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">On-Time Deliveries</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold font-mono text-emerald-700">98.6%</span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">On Schedule</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">Average delay less than 14 minutes</p>
        </div>
      </div>

      {/* Main Logistics Content: Vehicles Table & Detailed Telematics Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        {/* Left 7 Cols: Vehicles List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif-heading text-2xl font-bold text-stone-900">
            Active Delivery Vans &amp; Routes
          </h3>

          <div className="space-y-4">
            {vehicles.map((veh) => {
              const isSelected = selectedVehicle.id === veh.id;
              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-farm-orange shadow-md ring-2 ring-orange-100'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-farm-orange">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm font-mono">{veh.vehicleNumber}</h4>
                        <span className="text-xs text-stone-500">
                          Driver: {veh.driverName} ({veh.driverPhone})
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        veh.status === 'In Transit'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : veh.status === 'Loading at Hub'
                          ? 'bg-sky-100 text-sky-800 border-sky-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {veh.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans uppercase">Van Temp</span>
                      <strong
                        className={`text-sm ${
                          veh.currentTempCelsius > 6 ? 'text-red-600' : 'text-emerald-700'
                        }`}
                      >
                        {veh.currentTempCelsius}°C
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans uppercase">Space Used</span>
                      <strong className="text-sm text-stone-900">{veh.capacityLoadPercent}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans uppercase">Next Stop</span>
                      <span className="text-xs text-stone-700 truncate block">{veh.nextWaypoint.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs text-stone-500 border-t border-stone-100">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{veh.currentLocation}</span>
                    </span>
                    <span className="font-bold text-stone-800 shrink-0">ETA: {veh.eta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Vehicle Command Inspector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-md sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Van Details &amp; Controls
                </span>
                <h4 className="font-mono text-xl font-bold text-stone-900">
                  {selectedVehicle.vehicleNumber}
                </h4>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                Online &amp; Cool
              </span>
            </div>

            {/* Reefer Diagnostics */}
            <div className="my-5 p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Air Cooler:</span>
                <span className="font-bold text-emerald-700 font-mono">Running (Eco Mode)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Humidity:</span>
                <span className="font-bold text-stone-900 font-mono">{selectedVehicle.humidityPercent}% RH</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Mileage:</span>
                <span className="font-bold text-stone-900 font-mono">{selectedVehicle.fuelEfficiencyKmPl} km/L</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Assigned Orders:</span>
                <span className="font-mono text-stone-700 font-bold">{selectedVehicle.assignedOrders.join(', ')}</span>
              </div>
            </div>

            {/* Quick Status Action Controls */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Update Van Status:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedVehicle.id, 'In Transit')}
                  className="py-2 px-3 text-xs font-bold rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 cursor-pointer"
                >
                  Mark In Transit
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedVehicle.id, 'Loading at Hub')}
                  className="py-2 px-3 text-xs font-bold rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 cursor-pointer"
                >
                  Mark At Hub
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedVehicle.id, 'Delivering')}
                  className="py-2 px-3 text-xs font-bold rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 cursor-pointer"
                >
                  Out for Delivery
                </button>
                <button
                  onClick={() => alert(`Calling driver at ${selectedVehicle.driverPhone}`)}
                  className="py-2 px-3 text-xs font-bold rounded-xl bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
                >
                  Call Driver
                </button>
              </div>
            </div>

            {/* Route Optimizer Callout */}
            <div className="mt-6 pt-5 border-t border-stone-100 text-xs text-stone-600 space-y-1">
              <span className="font-bold text-stone-900 block">Smart Route Planning:</span>
              <p>
                System grouped pickups from 3 nearby farms into one cool van trip, saving fuel and cutting delivery costs by 34%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
