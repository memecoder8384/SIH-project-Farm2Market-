import React, { useState } from 'react';
import { ProduceItem, UserProfile } from '../../types';
import { X, Sparkles, Plus, CheckCircle2, ShieldCheck, Tractor } from 'lucide-react';

interface ListProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduce: (item: ProduceItem) => void;
  currentUser?: UserProfile | null;
}

export const ListProductModal: React.FC<ListProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduce,
  currentUser,
}) => {
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<ProduceItem['category']>('Daily Essentials');
  const [retailPrice, setRetailPrice] = useState('45');
  const [retailUnit, setRetailUnit] = useState('kg');
  const [bulkPrice, setBulkPrice] = useState('36');
  const [bulkMinUnit, setBulkMinUnit] = useState('100');
  const [stockKg, setStockKg] = useState('1200');
  const [brixGrade, setBrixGrade] = useState('15.2° Brix (Grade AA)');
  const [harvestDate, setHarvestDate] = useState('2026-09-18');
  const [dispatchDate, setDispatchDate] = useState('2026-09-20');
  const [originBadge, setOriginBadge] = useState('FPO Jaivik Certified');
  const [farmName, setFarmName] = useState(currentUser?.entityName || 'Sahyadri Organic FPO');
  const [location, setLocation] = useState(currentUser?.location || 'Nashik Valley, Maharashtra');
  const [description, setDescription] = useState('');
  const [imageTheme, setImageTheme] = useState<ProduceItem['imageTheme']>('orchard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleAutofillDemo = () => {
    setCropName('Tomatoes');
    setVariety('Vine-Ripened Hybrid');
    setCategory('Daily Essentials');
    setRetailPrice('28');
    setRetailUnit('kg');
    setBulkPrice('22');
    setBulkMinUnit('50');
    setStockKg('2500');
    setBrixGrade('Grade AA Fresh Plucked');
    setHarvestDate('2026-09-16');
    setDispatchDate('2026-09-17');
    setOriginBadge('Nashik Valley • Zero Chemical');
    setImageTheme('roots');
    setDescription(
      'Freshly harvested, sun-ripened red tomatoes from Nashik Valley. Plucked at peak firmness for culinary kitchens and households.'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    setIsSubmitting(true);

    const newProduce: ProduceItem = {
      id: `prod-user-${Date.now()}`,
      name: cropName.trim(),
      variety: variety.trim() || 'Regional Native Variety',
      category,
      farmId: currentUser?.id || 'user-farmer-farm',
      farmName: farmName || 'Sahyadri Organic FPO',
      location: location || 'Nashik, Maharashtra',
      retailPrice: Number(retailPrice) || 50,
      retailUnit: retailUnit || 'kg',
      bulkPrice: Number(bulkPrice) || 40,
      bulkMinUnit: Number(bulkMinUnit) || 100,
      stockAvailableKg: Number(stockKg) || 1000,
      allotmentReservedPercent: 0,
      brixSweetnessIndex: brixGrade || 'Grade A Verified',
      harvestDate: `${harvestDate}, 2026`,
      dispatchDate: `${dispatchDate}, 2026`,
      originBadge: originBadge || 'FPO Jaivik Certified',
      description:
        description.trim() ||
        `Fresh regional harvest directly from ${farmName}. Monitored cold chain and verified escrow settlement.`,
      nutritionalNotes: ['100% Non-GMO', 'Naturally Ripened', 'Direct FPO Harvest'],
      certifications: ['Jaivik Bharat Organic', 'Direct FPO Guarantee'],
      rating: 5.0,
      imageTheme,
      mandiMspPrice: Math.round(Number(retailPrice) * 0.7),
    };

    setTimeout(() => {
      onAddProduce(newProduce);
      setIsSubmitting(false);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 1000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  Farmer Account
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Direct Payment
                </span>
              </div>
              <h2 className="font-serif-heading text-xl sm:text-2xl font-bold mt-0.5">
                List a New Crop
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Click to fill in a demo tomato batch"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fill Sample Info</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Crop listed successfully! It is now visible on the marketplace.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Crop Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tomatoes, Potatoes, Onions..."
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Vegetable Variety</label>
              <input
                type="text"
                placeholder="e.g. Red Globe, Chipsona, Kufri..."
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProduceItem['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange"
              >
                <option value="Daily Essentials">Daily Essentials</option>
                <option value="Leafy Greens">Leafy Greens</option>
                <option value="Root Vegetables">Root Vegetables</option>
                <option value="Gourds &amp; Peppers">Gourds &amp; Peppers</option>
                <option value="Fresh Seasonal">Fresh Seasonal</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Vegetable Category Icon</label>
              <select
                value={imageTheme}
                onChange={(e) => setImageTheme(e.target.value as ProduceItem['imageTheme'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange"
              >
                <option value="roots">Root Vegetables</option>
                <option value="hydro">Leafy Greens</option>
                <option value="orchard">Vine &amp; Bush Vegetables</option>
                <option value="grain">Seasonal Harvest</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Price per Unit (₹)</label>
              <input
                type="number"
                min={1}
                required
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-mono font-bold text-stone-800"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Unit (kg / crate)</label>
              <input
                type="text"
                placeholder="kg, crate, dozen"
                value={retailUnit}
                onChange={(e) => setRetailUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Wholesale Price (₹/kg)</label>
              <input
                type="number"
                min={1}
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white font-mono font-bold text-emerald-800"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Available Quantity (kg)</label>
              <input
                type="number"
                min={10}
                value={stockKg}
                onChange={(e) => setStockKg(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Next Harvest Date</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Delivery Ready Date</label>
              <input
                type="date"
                value={dispatchDate}
                onChange={(e) => setDispatchDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Sweetness &amp; Quality Grade</label>
              <input
                type="text"
                placeholder="e.g. Extra Sweet Grade A"
                value={brixGrade}
                onChange={(e) => setBrixGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Farm Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Quality Label (e.g. 100% Organic)</label>
              <input
                type="text"
                placeholder="e.g. 100% Organic • Chemical Free"
                value={originBadge}
                onChange={(e) => setOriginBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Crop &amp; Taste Description</label>
            <textarea
              rows={2}
              placeholder="Describe taste, freshness, how it is grown, and when it was harvested..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-farm-orange/30 focus:border-farm-orange"
            />
          </div>

          {/* Footer Escrow Notice & Submit */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct payment: 85% goes directly to your bank account upon delivery.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white rounded-xl font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Listing...' : 'List Crop on Marketplace'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
