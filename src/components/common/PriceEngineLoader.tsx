import React, { useState, useEffect } from 'react';
import './PriceEngineLoader.css';

const PRICE_ENGINE_FACTS = [
  "Selling directly to buyers can increase a farmer's profit by up to 35%.",
  "Traditional market agents take away 6% to 12% of the money in extra broker fees.",
  "Testing vegetable freshness and size helps farmers earn 20% higher prices for grade-A vegetables.",
  "Our smart price checker compares rates across 15+ wholesale markets to find fair prices.",
  "Sharing delivery vans with nearby farms cuts transport costs by up to 28%.",
  "Booking orders before harvest protects farmers from sudden price drops in local markets.",
  "In normal markets, over 40% of the price you pay goes to middlemen instead of the farmer.",
  "Live market prices help farmers know when is the best time to sell.",
  "Direct digital weighing and instant bank transfers ensure farmers get paid for every single kilo."
];

export const PriceEngineLoader: React.FC = () => {
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * PRICE_ENGINE_FACTS.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % PRICE_ENGINE_FACTS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="price-engine-loader-wrapper animate-in fade-in duration-300">
      <div className="typewriter">
        <div className="slide"><i /></div>
        <div className="paper" />
        <div className="keyboard" />
      </div>

      <div className="mt-8 text-center max-w-lg mx-auto px-4">
        <p
          key={factIndex}
          className="text-stone-800 text-sm sm:text-base font-medium leading-relaxed animate-in fade-in duration-300 min-h-[52px] flex items-center justify-center flex-wrap"
        >
          <span className="font-semibold text-farm-orange mr-1.5">Did you know?</span>
          <span className="text-stone-700">{PRICE_ENGINE_FACTS[factIndex]}</span>
        </p>
      </div>
    </div>
  );
};

export default PriceEngineLoader;
