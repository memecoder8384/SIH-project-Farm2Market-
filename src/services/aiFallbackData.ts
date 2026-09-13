import {
  LocationsResponse,
  CropsResponse,
  DemandOverviewResponse,
  CropDemandDetailResponse,
  MarketSummaryResponse,
  PredictDemandResponse,
  CropDemandMetric,
  DailyPrediction,
  DemandLevel,
  DemandTrend,
} from './aiApi';

export const FALLBACK_LOCATIONS: LocationsResponse = {
  locations: [
    { district: 'Agra', cities: ['Agra', 'Fatehabad', 'Shamsabad', 'Kheragarh'] },
    { district: 'Aligarh', cities: ['Aligarh', 'Atrauli', 'Khair'] },
    { district: 'Bareilly', cities: ['Bareilly', 'Aonla', 'Baheri', 'Faridpur'] },
    { district: 'Bulandshahr', cities: ['Bulandshahr', 'Khurja', 'Sikandrabad', 'Siana'] },
    { district: 'Ghaziabad', cities: ['Ghaziabad', 'Modinagar', 'Loni', 'Muradnagar'] },
    { district: 'Hapur', cities: ['Hapur', 'Pilkhuwa', 'Garhmukteshwar'] },
    { district: 'Meerut', cities: ['Meerut', 'Mawana', 'Sardhana'] },
    { district: 'Moradabad', cities: ['Moradabad', 'Bilari', 'Thakurdwara'] },
    { district: 'Muzaffarnagar', cities: ['Muzaffarnagar', 'Khatauli', 'Budhana'] },
    { district: 'Saharanpur', cities: ['Saharanpur', 'Deoband', 'Nakur'] },
  ],
};

export const FALLBACK_CROPS: CropsResponse = {
  crops: [
    'Brinjal',
    'Cabbage',
    'Carrot',
    'Cauliflower',
    'Okra',
    'Onion',
    'Peas',
    'Potato',
    'Spinach',
    'Tomato',
  ],
};

const BASE_CROP_METRICS: Record<
  string,
  { basePrice: number; baseDailyQty: number; sellingRate: number }
> = {
  Tomato: { basePrice: 28, baseDailyQty: 1850, sellingRate: 0.91 },
  Potato: { basePrice: 19, baseDailyQty: 3200, sellingRate: 0.88 },
  Onion: { basePrice: 34, baseDailyQty: 2400, sellingRate: 0.94 },
  Carrot: { basePrice: 30, baseDailyQty: 1200, sellingRate: 0.82 },
  Cauliflower: { basePrice: 26, baseDailyQty: 1400, sellingRate: 0.85 },
  Cabbage: { basePrice: 18, baseDailyQty: 1600, sellingRate: 0.79 },
  Spinach: { basePrice: 22, baseDailyQty: 900, sellingRate: 0.96 },
  Peas: { basePrice: 52, baseDailyQty: 1100, sellingRate: 0.93 },
  Brinjal: { basePrice: 24, baseDailyQty: 1300, sellingRate: 0.84 },
  Okra: { basePrice: 38, baseDailyQty: 950, sellingRate: 0.89 },
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getMultiplier(district: string, city: string, crop: string): number {
  const h = hashString(`${district}-${city}-${crop}`) % 100;
  return 0.85 + (h / 100) * 0.35; // 0.85 to 1.20
}

function calculateDemandScore(sellingPct: number, totalSoldKg: number, baseDaily: number, period: number): number {
  const volumeRatio = Math.min(1.5, totalSoldKg / (baseDaily * period * 0.8));
  const score = (sellingPct * 0.6) + (volumeRatio * 35);
  return Math.round(Math.min(99, Math.max(25, score)) * 10) / 10;
}

function getDemandLevel(score: number): DemandLevel {
  if (score >= 82) return 'Very High';
  if (score >= 68) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

function getDemandTrend(crop: string, district: string): DemandTrend {
  const h = (hashString(`${crop}-${district}`) % 3);
  if (h === 0) return 'increasing';
  if (h === 1) return 'stable';
  return 'decreasing';
}

export function generateFallbackDemand(
  district: string,
  city: string,
  period: number = 7
): DemandOverviewResponse {
  const crops = FALLBACK_CROPS.crops.map((cropName) => {
    const config = BASE_CROP_METRICS[cropName] || { basePrice: 25, baseDailyQty: 1000, sellingRate: 0.85 };
    const mult = getMultiplier(district, city, cropName);

    const dailyListed = Math.round(config.baseDailyQty * mult);
    const total_listed_kg = dailyListed * period;
    const sellingRate = Math.min(0.99, config.sellingRate * (0.95 + (mult % 0.1)));
    const total_sold_kg = Math.round(total_listed_kg * sellingRate);
    const available_quantity_kg = total_listed_kg - total_sold_kg;
    const average_price_per_kg = Math.round((config.basePrice * (1.1 - (mult - 1) * 0.3)) * 10) / 10;
    const selling_percentage = Math.round((total_sold_kg / total_listed_kg) * 1000) / 10;
    const number_of_orders = Math.round((total_sold_kg / 85) * (0.9 + (mult % 0.2)));
    const demand_score = calculateDemandScore(selling_percentage, total_sold_kg, config.baseDailyQty, period);
    const demand_level = getDemandLevel(demand_score);
    const trend = getDemandTrend(cropName, district);

    return {
      crop: cropName,
      total_listed_kg,
      total_sold_kg,
      available_quantity_kg,
      number_of_orders,
      average_price_per_kg,
      selling_percentage,
      demand_score,
      demand_level,
      trend,
    } as CropDemandMetric;
  });

  // Sort by demand score descending
  crops.sort((a, b) => b.demand_score - a.demand_score);

  return {
    location: { district, city },
    period_days: period,
    reference_date: '2026-10-29',
    crops,
  };
}

export function generateFallbackCropDemand(
  crop: string,
  district: string,
  city: string,
  period: number = 7
): CropDemandDetailResponse {
  const overview = generateFallbackDemand(district, city, period);
  const metric = overview.crops.find((c) => c.crop.toLowerCase() === crop.toLowerCase()) || overview.crops[0];

  return {
    location: { district, city },
    period_days: period,
    reference_date: '2026-10-29',
    ...metric,
  };
}

export function generateFallbackMarketSummary(
  district: string,
  city: string,
  period: number = 7
): MarketSummaryResponse {
  const overview = generateFallbackDemand(district, city, period);
  const total_crops = overview.crops.length;
  const total_listed_kg = overview.crops.reduce((acc, c) => acc + c.total_listed_kg, 0);
  const total_sold_kg = overview.crops.reduce((acc, c) => acc + c.total_sold_kg, 0);
  const overall_selling_percentage = Math.round((total_sold_kg / total_listed_kg) * 1000) / 10;
  const average_market_price =
    Math.round((overview.crops.reduce((acc, c) => acc + c.average_price_per_kg, 0) / total_crops) * 10) / 10;

  return {
    location: { district, city },
    period_days: period,
    reference_date: '2026-10-29',
    total_crops,
    total_listed_kg,
    total_sold_kg,
    overall_selling_percentage,
    average_market_price,
    highest_demand_crop: overview.crops[0].crop,
    lowest_demand_crop: overview.crops[overview.crops.length - 1].crop,
  };
}

export function generateFallbackPredictDemand(
  district: string,
  city: string,
  crop: string,
  period: number = 7
): PredictDemandResponse {
  const detail = generateFallbackCropDemand(crop, district, city, period);
  const mult = getMultiplier(district, city, crop);
  const growthRate = 1.04 + (mult % 0.08); // 4% to 12% predicted forward demand expansion
  const predicted_demand_kg = Math.round(detail.total_sold_kg * growthRate);
  const current_supply_kg = detail.available_quantity_kg + Math.round(detail.total_listed_kg * 0.4);
  const demand_gap_kg = predicted_demand_kg - current_supply_kg;

  const daily_predictions: DailyPrediction[] = [];
  const baseDate = new Date('2026-10-30');
  const avgDaily = predicted_demand_kg / period;

  for (let i = 0; i < period; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayVariation = 1 + (Math.sin(i * 1.2) * 0.15);
    daily_predictions.push({
      date: dateStr,
      predicted_demand_kg: Math.round(avgDaily * dayVariation),
    });
  }

  return {
    location: { district, city },
    crop: detail.crop,
    prediction_period_days: period,
    reference_date: '2026-10-29',
    predicted_demand_kg,
    current_supply_kg,
    demand_gap_kg,
    demand_score: detail.demand_score,
    demand_level: detail.demand_level,
    model: 'RandomForestRegressor (Client Simulation)',
    daily_predictions,
  };
}
