import React, { useState, useEffect } from 'react';
import './AiDemandLoader.css';

const AI_DEMAND_FACTS = [
  "Our smart predictor tracks weather and upcoming festivals to forecast how much crop buyers will need.",
  "Predicting demand in advance cuts crop waste and rotting by up to 34%.",
  "Restaurant bulk orders can be predicted up to 3 weeks before they buy.",
  "Looking at past market trends helps farmers choose the best day to harvest and sell.",
  "Sending crops directly to high-demand cities can increase farmer income by 26%.",
  "Tracking market prices ensures farmers never sell their crops too cheap during busy seasons.",
  "Weather and soil tracking helps farmers choose which crops will make the most profit.",
  "Smart demand matching connects farmers with trusted buyers before they even start growing."
];

export const AiDemandLoader: React.FC = () => {
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * AI_DEMAND_FACTS.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % AI_DEMAND_FACTS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ai-demand-loader-wrapper animate-in fade-in duration-300">
      <div className="container">
        <div className="loader" />
        <div className="loader" />
        <div className="loader" />
      </div>

      <div className="mt-8 text-center max-w-lg mx-auto px-4">
        <p
          key={factIndex}
          className="text-stone-800 text-sm sm:text-base font-medium leading-relaxed animate-in fade-in duration-300 min-h-[52px] flex items-center justify-center flex-wrap"
        >
          <span className="font-semibold text-farm-orange mr-1.5">Did you know?</span>
          <span className="text-stone-700">{AI_DEMAND_FACTS[factIndex]}</span>
        </p>
      </div>
    </div>
  );
};

export default AiDemandLoader;
