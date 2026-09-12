import { RouteOptimization } from '../types/tradeFlow';

export interface RouteOptimizationRequest {
  origin: string;
  destination: string;
  vehicleType: string;
  cargoWeightKg: number;
  perishableGrade: string;
  maxTemperatureCelsius?: number;
}

export interface IRouteOptimizationService {
  optimizeRoute(request: RouteOptimizationRequest): Promise<RouteOptimization>;
  getDefaultOptimization(origin: string, destination: string): RouteOptimization;
}

/**
 * Route Optimization Service
 * Mock implementation structured for drop-in connection to Python/FastAPI ML route-planner
 */
export class RouteOptimizationService implements IRouteOptimizationService {
  getDefaultOptimization(origin: string, destination: string): RouteOptimization {
    return {
      originalDistanceKm: 420,
      originalEta: '8h 20m',
      originalCost: 9200,
      optimizedDistanceKm: 385,
      optimizedEta: '7h 35m',
      optimizedCost: 8450,
      costSavedInr: 750,
      distanceSavedKm: 35,
      timeSavedMin: 45,
      rationale:
        'Route optimized based on distance, estimated traffic, delivery priority, road surface gradient, and logistics fuel efficiency.',
      isOptimizedRouteApplied: true,
    };
  }

  async optimizeRoute(request: RouteOptimizationRequest): Promise<RouteOptimization> {
    // Simulated network latency to mimic Python/FastAPI model inference
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Dynamic calculations based on input weight and road factors
    const baseKm = 400;
    const distanceSaved = 35;
    const optimizedKm = baseKm - distanceSaved;
    const timeSavedMin = 45;
    const costSavedInr = Math.round(distanceSaved * 16.5 + (request.cargoWeightKg > 3000 ? 172 : 120));
    const baseCost = 9200;

    return {
      originalDistanceKm: baseKm,
      originalEta: '8h 20m',
      originalCost: baseCost,
      optimizedDistanceKm: optimizedKm,
      optimizedEta: '7h 35m',
      optimizedCost: baseCost - costSavedInr,
      distanceSavedKm: distanceSaved,
      timeSavedMin: timeSavedMin,
      costSavedInr: costSavedInr,
      rationale: `Route from ${request.origin} to ${request.destination} optimized using real-time congestion models, avoiding unpaved bypasses for ${request.vehicleType}. Reduces transit vibration and maintains optimal cargo refrigeration.`,
      isOptimizedRouteApplied: true,
    };
  }
}

export const routeOptimizationService: IRouteOptimizationService = new RouteOptimizationService();
