import React, { useState, useEffect } from 'react';
import { StorybookHorizon } from '../components/common/StorybookHorizon';
import { SoilBreakdown } from '../components/common/SoilBreakdown';
import { NightReadiness } from '../components/common/NightReadiness';
import { FarmCardSvg } from '../components/common/FarmCardSvg';
import { ShadowImage } from '../components/common/ShadowLoader';
import { FindHarvestButton } from '../components/common/FindHarvestButton';
import { MOCK_FARMS, MOCK_PRODUCE } from '../data/mockData';
import { ProduceItem, Farm } from '../types';
import { Search, MapPin, ArrowRight, ShieldCheck, Star, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string, itemParam?: any) => void;
  onSelectProduct: (product: ProduceItem) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions (India)');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchSuggestions = searchQuery.trim().length > 1
    ? MOCK_PRODUCE.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setIsSearching(true);
    setTimeout(() => {
      onNavigate('marketplace', { search: searchQuery });
      setIsSearching(false);
    }, 2400);
  };

  return (
    <div className="flex flex-col w-full">
      {/* BEGIN: HeroBanner */}
      <section className="relative bg-gradient-to-b from-[#e7f7fd] via-[#aedef4] to-[#c8ecf8] pt-10 pb-24 overflow-hidden transition-colors duration-300" data-purpose="hero-section">
        {/* Drifting Clouds Layer 1 (Slow) */}
        <div className="absolute top-6 left-10 opacity-90 pointer-events-none animate-drift-slow">
          <svg fill="white" height="42" viewBox="0 0 110 38" width="110">
            <path d="M18 36h74c10 0 18-8 18-18s-8-18-18-18c-3 0-6 1-8 2C80 9 70 2 58 2c-14 0-25 10-27 23-2-1-5-1-7-1-10 0-18 8-18 18s8 14 18 14z" opacity="0.9"></path>
          </svg>
        </div>

        {/* Drifting Clouds Layer 2 (Fast opposite) */}
        <div className="absolute top-14 right-16 opacity-85 pointer-events-none animate-drift-fast">
          <svg fill="white" height="48" viewBox="0 0 150 46" width="150">
            <path d="M22 44h106c12 0 22-10 22-22s-10-22-22-22c-4 0-8 1-11 3C111 11 98 2 82 2 64 2 49 14 46 30c-3-1-7-2-10-2-13 0-24 10-24 22 0 7 3 13 8 16z" opacity="0.85"></path>
          </svg>
        </div>

        {/* Floating Clouds Layer 3 (Gentle float) */}
        <div className="absolute top-28 left-1/3 opacity-75 pointer-events-none animate-float hidden md:block">
          <svg fill="white" height="32" viewBox="0 0 100 32" width="100">
            <path d="M15 30h70c8 0 15-7 15-15s-7-15-15-15c-3 0-5 1-7 2C72 7 64 1 54 1 42 1 32 9 30 20c-2-1-4-1-6-1-8 0-15 7-15 15s7 11 15 11z" opacity="0.75"></path>
          </svg>
        </div>

        {/* Center Hero Content */}
        <div className="max-w-4xl mx-auto px-4 text-center relative z-20 pt-4">

          {/* Main Serif Headline */}
          <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 leading-[1.08] tracking-tight mb-4">
            Fresh Vegetables Directly<br className="hidden sm:inline" />
            from Local Indian Farms.
          </h1>

          <p className="text-base sm:text-lg text-stone-700 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Buy farm-fresh vegetables straight from verified growers at transparent prices with quick, reliable delivery.
          </p>

          {/* Storybook Search Container with Live Suggestions */}
          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-full shadow-xl flex flex-col sm:flex-row items-center border border-sky-100 gap-2 relative z-30 transition-colors"
            >
              <div className="flex items-center gap-3 pl-4 flex-1 w-full">
                <Search className="w-5 h-5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search tomatoes, potatoes, onions, carrots..."
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  className="w-full border-none focus:ring-0 text-sm text-stone-800 placeholder-stone-400 p-0 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="text-xs text-stone-400 hover:text-stone-600 px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="hidden sm:block h-6 w-px bg-stone-200"></div>

              <div className="w-full sm:w-auto px-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="border-none focus:ring-0 text-xs font-medium text-stone-600 cursor-pointer py-1 pr-7 focus:outline-none"
                >
                  <option>All Regions (India)</option>
                  <option>Nashik Valley, Maharashtra</option>
                  <option>Malwa Plateau, Madhya Pradesh</option>
                  <option>Gir Somnath, Gujarat</option>
                  <option>Bangalore Rural, Karnataka</option>
                  <option>Kangra Valley, Himachal</option>
                </select>
              </div>

              <FindHarvestButton
                type="submit"
                isActive={isSearching}
                className="w-full sm:w-auto shrink-0"
              />
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-40 text-left animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 flex items-center justify-between">
                  <span>Available Vegetables</span>
                  <span className="text-emerald-700 font-normal">Direct Farm Price</span>
                </div>
                {searchSuggestions.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      setShowSuggestions(false);
                      onNavigate('product-detail');
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-stone-50 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-900 group-hover:text-farm-orange">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {prod.farmName} • {prod.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        ₹{prod.retailPrice} / {prod.retailUnit.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Category Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-stone-600">
            <span className="font-medium text-stone-500">Popular items:</span>
            <button
              onClick={() => onNavigate('marketplace', { search: 'Tomatoes' })}
              className="px-3 py-1 bg-white/70 hover:bg-white rounded-full transition-all font-semibold text-stone-700 hover:scale-105 shadow-2xs cursor-pointer"
            >
              🍅 Tomatoes
            </button>
            <button
              onClick={() => onNavigate('marketplace', { search: 'Potatoes' })}
              className="px-3 py-1 bg-white/70 hover:bg-white rounded-full transition-all font-semibold text-stone-700 hover:scale-105 shadow-2xs cursor-pointer"
            >
              🥔 Potatoes
            </button>
            <button
              onClick={() => onNavigate('marketplace', { search: 'Onions' })}
              className="px-3 py-1 bg-white/70 hover:bg-white rounded-full transition-all font-semibold text-stone-700 hover:scale-105 shadow-2xs cursor-pointer"
            >
              🧅 Onions
            </button>
            <button
              onClick={() => onNavigate('marketplace', { search: 'Carrots' })}
              className="px-3 py-1 bg-white/70 hover:bg-white rounded-full transition-all font-semibold text-stone-700 hover:scale-105 shadow-2xs cursor-pointer"
            >
              🥕 Carrots
            </button>
            <button
              onClick={() => onNavigate('marketplace', { search: 'Spinach' })}
              className="px-3 py-1 bg-white/70 hover:bg-white rounded-full transition-all font-semibold text-stone-700 hover:scale-105 shadow-2xs cursor-pointer"
            >
              🥬 Spinach
            </button>
          </div>
        </div>

        {/* Illustrated Horizon Landscape Transition */}
        <StorybookHorizon className="mt-10 -mb-1" />
      </section>
      {/* END: HeroBanner */}

      {/* BEGIN: CategoryExplorer */}
      <section className="py-14 bg-stone-50 border-b border-stone-200 relative z-20 transition-colors" data-purpose="category-explorer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-9">
            <div>
              <span className="eyebrow-badge text-farm-orange">01. CATEGORIES</span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Browse Vegetables by Category
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Choose fresh vegetables directly from trusted local farmer groups.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                <span>✓ Organic Certified</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-stone-700 border border-stone-300 hover:bg-stone-100 shrink-0">
                Cold Van Delivery
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-stone-700 border border-stone-300 hover:bg-stone-100 shrink-0">
                Wholesale Available
              </span>
              <button
                onClick={() => onNavigate('marketplace')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-farm-orange hover:underline shrink-0"
              >
                View All Vegetables →
              </button>
            </div>
          </div>

          {/* Category Tiles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '🍅', name: 'Daily Essentials', sub: 'Tomatoes, Potatoes, Onions', farms: '38 Farms', cat: 'Daily Essentials' },
              { icon: '🥬', name: 'Leafy Greens', sub: 'Spinach, Cabbage, Mint', farms: '24 Farms', cat: 'Leafy Greens' },
              { icon: '🥕', name: 'Root Vegetables', sub: 'Carrots, Radish, Beetroot', farms: '21 Farms', cat: 'Root Vegetables' },
              { icon: '🫑', name: 'Gourds & Peppers', sub: 'Capsicum, Cucumbers', farms: '19 Farms', cat: 'Gourds & Peppers' },
              { icon: '🥦', name: 'Fresh Seasonal', sub: 'Cauliflower, Green Peas', farms: '18 Farms', cat: 'Fresh Seasonal' },
              { icon: '🍆', name: 'Tender Vegetables', sub: 'Brinjal, Ladyfinger', farms: '22 Farms', cat: 'All' },
            ].map((c, i) => (
              <div
                key={i}
                onClick={() => onNavigate('marketplace', { category: c.cat })}
                className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer text-center group flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {c.icon}
                </div>
                <h3 className="font-bold text-stone-800 text-sm mt-3 leading-tight">{c.name}</h3>
                <p className="text-[11px] text-stone-500 mt-0.5">{c.sub}</p>
                <span className="mt-2 text-[10px] font-bold text-farm-orange bg-orange-50 px-2 py-0.5 rounded-full">
                  {c.farms}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* END: CategoryExplorer */}

      {/* BEGIN: FeaturedFarmsGrid */}
      {/* BEGIN: FeaturedFarmsGrid */}
      <section className="py-16 bg-stone-100/70 transition-colors" data-purpose="featured-farms" id="marketplace">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="eyebrow-badge text-farm-orange">02. LOCAL FARMS</span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                Verified Local Farms &amp; Producers
              </h2>
              <p className="text-sm text-stone-600">
                Order directly from farmers before stock runs out. Safe payment guarantee on every order.
              </p>
            </div>

            <button
              onClick={() => onNavigate('marketplace')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-farm-orange hover:text-farm-orange-hover"
            >
              <span>Explore All Produce</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6 Storybook Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {MOCK_FARMS.map((farm, idx) => {
              const matchedProduce = MOCK_PRODUCE[idx] || MOCK_PRODUCE[0];
              return (
                <article
                  key={farm.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Farm Photography Header */}
                    <div className="w-full h-48 rounded-2xl bg-stone-100 overflow-hidden relative border border-stone-200/80 shadow-xs">
                      {farm.imageUrl ? (
                        <ShadowImage
                          src={farm.imageUrl}
                          alt={farm.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      ) : (
                        <FarmCardSvg type={farm.bgSvgType} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-1 rounded-full text-emerald-800 border border-emerald-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {farm.isOrganicCertified ? '100% Organic Farm' : 'Verified Farmer'}
                      </div>
                      <div className="absolute top-3 right-3 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{farm.rating} ({farm.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Farm Meta */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif-heading text-xl font-bold text-stone-900">
                          {farm.name}
                        </h3>
                        <span className="text-xs font-bold text-farm-green-dark bg-emerald-50 px-2 py-0.5 rounded">
                          Quality {farm.yieldReturn}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{farm.region}, {farm.state}</span>
                      </p>
                    </div>

                    {/* Attributes Row */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] block uppercase font-medium">Main Vegetable</span>
                        <span className="font-bold text-stone-800 truncate block">{matchedProduce.name}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block uppercase font-medium">Direct Price</span>
                        <span className="font-bold text-stone-800">₹{matchedProduce.retailPrice} / {matchedProduce.retailUnit}</span>
                      </div>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-stone-500">Available Stock</span>
                        <span className="text-farm-green-dark font-bold">{farm.allotmentQuotaPercent}% Booked</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-farm-green h-full rounded-full"
                          style={{ width: `${farm.allotmentQuotaPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectProduct(matchedProduce);
                        onNavigate('product-detail');
                      }}
                      className="flex-1 py-2.5 bg-farm-orange hover:bg-farm-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Buy Fresh Crop
                    </button>
                    <button
                      onClick={() => onNavigate('farmer-dashboard')}
                      className="px-3.5 py-2.5 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Farm Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('marketplace')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <span>View All Fresh Harvests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
      {/* END: FeaturedFarmsGrid */}

      {/* BEGIN: StorybookSoilSection */}
      <SoilBreakdown />
      {/* END: StorybookSoilSection */}

      {/* BEGIN: NighttimeFoodshedMap */}
      <NightReadiness />
      {/* END: NighttimeFoodshedMap */}

      {/* BEGIN: TestimonialsSection */}
      <section className="py-16 bg-stone-50 border-b border-stone-200 transition-colors" data-purpose="customer-chef-stories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="eyebrow-badge text-farm-orange">05. REVIEWS &amp; STORIES</span>
              <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
                What Our Customers &amp; Farmers Say
              </h2>
              <p className="text-sm text-stone-600">
                Over 12,000 families and 400 businesses buying directly from Indian farmers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Story 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="absolute top-4 left-4 w-4 h-4">
                <div className="w-2.5 h-4 bg-emerald-500 rounded-tr-full rounded-bl-full"></div>
              </div>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed pl-4 italic">
                "We run a cloud kitchen and restaurant in Bandra. Earlier, market prices kept changing and middlemen took big cuts. With Farm2Market, we get clean, farm-fresh vegetables directly from growers with consistent quality every morning."
              </p>
              <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center font-bold text-amber-900 text-xs">
                  CR
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 text-sm">Chef Cyrus Rustam</h5>
                  <p className="text-xs text-stone-500">Restaurant Owner, Mumbai</p>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="absolute top-4 left-4 w-4 h-4">
                <div className="w-2.5 h-4 bg-emerald-500 rounded-tr-full rounded-bl-full"></div>
              </div>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed pl-4 italic">
                "We are a group of 380 tomato and onion farmers in Nashik. We used to lose money to mandi middlemen and late payments. With Farm2Market, we sell directly to buyers, get paid safely on time, and our vegetables stay fresh in cold delivery vans."
              </p>
              <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-900 text-xs">
                  DS
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 text-sm">Dnyaneshwar Shinde</h5>
                  <p className="text-xs text-stone-500">Farmer Group Leader, Nashik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: TestimonialsSection */}

      {/* BEGIN: CallToActionBanner */}
      <section className="bg-gradient-to-b from-[#aedef4] to-[#7dbfe0] pt-14 pb-0 relative overflow-hidden text-center transition-colors">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="font-serif-heading text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
            Fresh vegetables from real farms,<br />delivered to your door.
          </h2>
          <p className="text-sm sm:text-base text-stone-700 mt-2 mb-7">
            Fair earnings for farmers, fresh healthy vegetables for families, and direct delivery.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for joining Farm2Market! We will keep you updated on new harvest arrivals.');
            }}
            className="bg-white p-2 rounded-full shadow-lg max-w-lg mx-auto flex items-center border border-sky-200"
          >
            <input
              type="email"
              placeholder="Enter your email or mobile number"
              required
              className="flex-1 border-none focus:ring-0 text-xs sm:text-sm text-stone-800 placeholder-stone-400 pl-4 py-2 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-farm-orange hover:bg-farm-orange-hover text-white text-xs font-bold px-5 py-3 rounded-full transition-colors shrink-0 shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <span className="text-[11px] text-stone-600 mt-2.5 block">
            No hidden charges • 100% Safe Payments Guarantee
          </span>
        </div>

        {/* Bottom Horizon Illustration */}
        <div className="w-full mt-10 -mb-1 relative pointer-events-none">
          <svg className="w-full h-36" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 160">
            <path d="M0 80 Q 320 40 720 75 T 1440 60 L 1440 160 L 0 160 Z" fill="#58a351"></path>
            <path d="M0 100 Q 420 70 1080 110 T 1440 90 L 1440 160 L 0 160 Z" fill="#3e8e41"></path>
            
            <g transform="translate(860, 45)">
              <polygon fill="#be3320" points="50,30 90,0 130,30 130,75 50,75"></polygon>
              <rect fill="#ffffff" height="33" width="28" x="76" y="42"></rect>
              <rect fill="#3c2415" height="30" width="22" x="79" y="45"></rect>
              <line stroke="#ffffff" strokeWidth="2" x1="79" x2="101" y1="45" y2="75"></line>
              <line stroke="#ffffff" strokeWidth="2" x1="101" x2="79" y1="45" y2="75"></line>
            </g>

            <g transform="translate(180, 80)">
              <rect fill="#e5b324" height="16" rx="2" width="26" x="18" y="10"></rect>
              <circle cx="16" cy="28" fill="#222" r="9" stroke="#ffffff" strokeWidth="2"></circle>
              <circle cx="42" cy="30" fill="#222" r="6" stroke="#ffffff" strokeWidth="2"></circle>
              <rect fill="#9ed5ef" height="10" width="14" x="12" y="3"></rect>
            </g>
          </svg>
        </div>
      </section>
      {/* END: CallToActionBanner */}
    </div>
  );
};
