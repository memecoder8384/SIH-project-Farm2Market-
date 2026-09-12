/**
 * FastAPI AI/ML Microservice Client & Simulation Interface
 * 
 * Configured to connect to FastAPI endpoints:
 * - POST /api/v1/predict-demand (FastAPI + Pandas + Scikit-Learn)
 * - POST /api/v1/recommend-price (Dynamic pricing regression model)
 * - GET /api/v1/market-insights (Regional supply-demand deficit detection)
 */

import { MOCK_DEMAND_FORECASTS, MOCK_PRICE_RECOMMENDATIONS } from '../data/mockData';
import { DemandForecastItem, PriceRecommendation } from '../types';

export interface AiServiceResponse<T> {
  success: boolean;
  data: T | null;
  inferenceTimeMs: number;
  modelConfidence: number;
  message?: string;
}

class AiService {
  private baseUrl: string = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000';

  async getDemandForecasts(): Promise<AiServiceResponse<DemandForecastItem[]>> {
    // Simulating FastAPI response payload
    return {
      success: true,
      data: MOCK_DEMAND_FORECASTS,
      inferenceTimeMs: 142,
      modelConfidence: 0.92,
      message: 'Random Forest Regressor & Prophet Time-Series forecast loaded.',
    };
  }

  async getPriceRecommendation(cropId: string): Promise<AiServiceResponse<PriceRecommendation>> {
    const recommendation = MOCK_PRICE_RECOMMENDATIONS[cropId] || MOCK_PRICE_RECOMMENDATIONS['prod-1'];
    return {
      success: true,
      data: recommendation,
      inferenceTimeMs: 98,
      modelConfidence: 0.94,
      message: 'Optimal pricing evaluated against local Mandi MSP, transport indices, and quality grading.',
    };
  }

  async calculateSimulatedMargin(
    costPerKg: number,
    yieldTons: number,
    sellingPricePerKg: number
  ): Promise<{
    totalRevenue: number;
    totalCost: number;
    netProfit: number;
    traditionalMiddlemanNetProfit: number;
    directAdvantagePercent: number;
  }> {
    const totalKg = yieldTons * 1000;
    const totalCost = totalKg * costPerKg;
    const directRevenue = totalKg * sellingPricePerKg;
    const directProfit = directRevenue - totalCost;

    // Traditional middlemen take 40-50% cut; farmgate wholesale is typically 30% below selling price
    const traditionalRevenue = totalKg * (sellingPricePerKg * 0.65);
    const traditionalProfit = Math.max(0, traditionalRevenue - totalCost);

    const directAdvantagePercent = traditionalProfit > 0 
      ? Math.round(((directProfit - traditionalProfit) / traditionalProfit) * 100) 
      : 85;

    return {
      totalRevenue: Math.round(directRevenue),
      totalCost: Math.round(totalCost),
      netProfit: Math.round(directProfit),
      traditionalMiddlemanNetProfit: Math.round(traditionalProfit),
      directAdvantagePercent,
    };
  }
}

export const aiService = new AiService();
