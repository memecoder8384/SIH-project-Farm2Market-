/**
 * Farm2Market AI Service API Client
 * Connects to the local FastAPI backend (default: http://localhost:8000)
 * Exposing historical demand analytics and ML forward-demand forecasting.
 */

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

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${AI_API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

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

    return (await response.json()) as T;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Unable to connect to AI Service at ${AI_API_BASE_URL}. Please ensure the FastAPI backend is running.`
      );
    }
    throw error;
  }
}

export const aiApi = {
  /**
   * Health and service metadata check
   */
  async checkHealth(): Promise<ServiceHealthResponse> {
    return fetchFromApi<ServiceHealthResponse>('/');
  },

  /**
   * GET /api/locations
   * Returns all 10 Uttar Pradesh districts and their 34 cities
   */
  async getLocations(): Promise<LocationsResponse> {
    return fetchFromApi<LocationsResponse>('/api/locations');
  },

  /**
   * GET /api/crops
   * Returns all 10 agricultural crops
   */
  async getCrops(): Promise<CropsResponse> {
    return fetchFromApi<CropsResponse>('/api/crops');
  },

  /**
   * GET /api/demand?district=...&city=...&period=...
   * Returns demand overview across all crops for a given location and period
   */
  async getDemand(district: string, city: string, period: number = 7): Promise<DemandOverviewResponse> {
    const params = new URLSearchParams({
      district,
      city,
      period: period.toString(),
    });
    return fetchFromApi<DemandOverviewResponse>(`/api/demand?${params.toString()}`);
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
    const params = new URLSearchParams({
      district,
      city,
      period: period.toString(),
    });
    return fetchFromApi<CropDemandDetailResponse>(`/api/demand/${encodeURIComponent(crop)}?${params.toString()}`);
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
    const params = new URLSearchParams({
      district,
      city,
      period: period.toString(),
    });
    return fetchFromApi<MarketSummaryResponse>(`/api/market-summary?${params.toString()}`);
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
    const params = new URLSearchParams({
      district,
      city,
      crop,
      period: period.toString(),
    });
    return fetchFromApi<PredictDemandResponse>(`/api/predict-demand?${params.toString()}`);
  },
};
