/**
 * Farm2Market AI Service API Client
 * Connects to the FastAPI backend when available (default: http://localhost:8000 or VITE_AI_API_URL).
 * When running in production without a separate backend (e.g. Netlify static hosting)
 * or when the backend is offline, it seamlessly falls back to high-fidelity client simulation.
 */

import {
  FALLBACK_LOCATIONS,
  FALLBACK_CROPS,
  generateFallbackDemand,
  generateFallbackCropDemand,
  generateFallbackMarketSummary,
  generateFallbackPredictDemand,
} from './aiFallbackData';

export interface LocationDistrict {
  district: string;
  cities: string[];
}

export interface LocationsResponse {
  locations: LocationDistrict[];
}

export interface CropsResponse {
  crops: string[];
}

export type DemandLevel = 'Low' | 'Medium' | 'High' | 'Very High';
export type DemandTrend = 'increasing' | 'stable' | 'decreasing';

export interface CropDemandMetric {
  crop: string;
  total_listed_kg: number;
  total_sold_kg: number;
  available_quantity_kg: number;
  number_of_orders: number;
  average_price_per_kg: number;
  selling_percentage: number;
  demand_score: number;
  demand_level: DemandLevel;
  trend: DemandTrend;
}

export interface DemandOverviewResponse {
  location: {
    district: string;
    city: string;
  };
  period_days: number;
  reference_date: string;
  crops: CropDemandMetric[];
}

export interface CropDemandDetailResponse {
  location: {
    district: string;
    city: string;
  };
  crop: string;
  period_days: number;
  reference_date: string;
  total_listed_kg: number;
  total_sold_kg: number;
  available_quantity_kg: number;
  number_of_orders: number;
  average_price_per_kg: number;
  selling_percentage: number;
  demand_score: number;
  demand_level: DemandLevel;
  trend: DemandTrend;
}

export interface MarketSummaryResponse {
  location: {
    district: string;
    city: string;
  };
  period_days: number;
  reference_date: string;
  total_crops: number;
  total_listed_kg: number;
  total_sold_kg: number;
  overall_selling_percentage: number;
  average_market_price: number;
  highest_demand_crop: string;
  lowest_demand_crop: string;
}

export interface DailyPrediction {
  date: string;
  predicted_demand_kg: number;
}

export interface PredictDemandResponse {
  location: {
    district: string;
    city: string;
  };
  crop: string;
  prediction_period_days: number;
  reference_date: string;
  predicted_demand_kg: number;
  current_supply_kg: number;
  demand_gap_kg: number;
  demand_score: number;
  demand_level: DemandLevel;
  model: string;
  daily_predictions: DailyPrediction[];
}

export interface ServiceHealthResponse {
  service: string;
  phase: string;
  status: string;
  model_available: boolean;
  reference_date: string;
  total_records: number;
  docs: string;
  redoc: string;
}

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

// Global flag to track whether client is running in fallback mode
let fallbackMode = false;

// Check if we are running in HTTPS production while API is HTTP localhost (would trigger browser mixed-content block)
const isBrowserHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const isApiInsecureLocalhost = AI_API_BASE_URL.startsWith('http://localhost') || AI_API_BASE_URL.startsWith('http://127.0.0.1');
const shouldImmediatelyUseFallback = isBrowserHttps && isApiInsecureLocalhost;

if (shouldImmediatelyUseFallback) {
  fallbackMode = true;
  console.info('[Farm2Market AI] Deployed on HTTPS without remote API URL. Automatically running in client simulation mode.');
}

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (fallbackMode && shouldImmediatelyUseFallback) {
    throw new Error('FallbackActive');
  }

  const url = `${AI_API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `API error (${response.status}): ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // Fallback to HTTP status text
      }
      throw new Error(errorMessage);
    }

    // Success - reset fallbackMode
    fallbackMode = false;
    return (await response.json()) as T;
  } catch (error: any) {
    fallbackMode = true;
    console.warn(`[Farm2Market AI] Cannot reach backend at ${AI_API_BASE_URL} (${error.message}). Using local fallback simulation.`);
    throw error;
  }
}

export const aiApi = {
  get isFallback(): boolean {
    return fallbackMode;
  },

  /**
   * Health and service metadata check
   */
  async checkHealth(): Promise<ServiceHealthResponse> {
    try {
      return await fetchFromApi<ServiceHealthResponse>('/');
    } catch {
      return {
        service: 'Farm2Market AI Service',
        phase: 'Phase 3 - Client Simulation',
        status: 'online (client-side)',
        model_available: true,
        reference_date: '2026-10-29',
        total_records: 30600,
        docs: '/docs',
        redoc: '/redoc',
      };
    }
  },

  /**
   * GET /api/locations
   * Returns all 10 Uttar Pradesh districts and their 34 cities
   */
  async getLocations(): Promise<LocationsResponse> {
    try {
      return await fetchFromApi<LocationsResponse>('/api/locations');
    } catch {
      return FALLBACK_LOCATIONS;
    }
  },

  /**
   * GET /api/crops
   * Returns all 10 agricultural crops
   */
  async getCrops(): Promise<CropsResponse> {
    try {
      return await fetchFromApi<CropsResponse>('/api/crops');
    } catch {
      return FALLBACK_CROPS;
    }
  },

  /**
   * GET /api/demand?district=...&city=...&period=...
   * Returns demand overview across all crops for a given location and period
   */
  async getDemand(district: string, city: string, period: number = 7): Promise<DemandOverviewResponse> {
    try {
      const params = new URLSearchParams({
        district,
        city,
        period: period.toString(),
      });
      return await fetchFromApi<DemandOverviewResponse>(`/api/demand?${params.toString()}`);
    } catch {
      return generateFallbackDemand(district, city, period);
    }
  },

  /**
   * GET /api/demand/{crop}?district=...&city=...&period=...
   * Returns detailed historical demand metrics for a specific crop
   */
  async getCropDemand(
    crop: string,
    district: string,
    city: string,
    period: number = 7
  ): Promise<CropDemandDetailResponse> {
    try {
      const params = new URLSearchParams({
        district,
        city,
        period: period.toString(),
      });
      return await fetchFromApi<CropDemandDetailResponse>(`/api/demand/${encodeURIComponent(crop)}?${params.toString()}`);
    } catch {
      return generateFallbackCropDemand(crop, district, city, period);
    }
  },

  /**
   * GET /api/market-summary?district=...&city=...&period=...
   * Returns high-level market totals, clearance velocity, and top/bottom crops
   */
  async getMarketSummary(
    district: string,
    city: string,
    period: number = 7
  ): Promise<MarketSummaryResponse> {
    try {
      const params = new URLSearchParams({
        district,
        city,
        period: period.toString(),
      });
      return await fetchFromApi<MarketSummaryResponse>(`/api/market-summary?${params.toString()}`);
    } catch {
      return generateFallbackMarketSummary(district, city, period);
    }
  },

  /**
   * GET /api/predict-demand?district=...&city=...&crop=...&period=...
   * Returns ML-driven future demand predictions, supply gaps, scores, and daily breakdown
   */
  async predictDemand(
    district: string,
    city: string,
    crop: string,
    period: number = 7
  ): Promise<PredictDemandResponse> {
    try {
      const params = new URLSearchParams({
        district,
        city,
        crop,
        period: period.toString(),
      });
      return await fetchFromApi<PredictDemandResponse>(`/api/predict-demand?${params.toString()}`);
    } catch {
      return generateFallbackPredictDemand(district, city, crop, period);
    }
  },
};
