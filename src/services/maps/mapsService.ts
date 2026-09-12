/**
 * Maps Service Abstraction Layer
 * Structured for future drop-in connection to Google Maps API / Mapbox / OpenStreetMap
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapWaypoint extends LatLng {
  name: string;
  timestamp?: string;
  isStopover?: boolean;
}

export interface RouteGeometry {
  origin: MapWaypoint;
  destination: MapWaypoint;
  waypoints: MapWaypoint[];
  pathCoordinates: LatLng[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
}

export interface IMapProvider {
  calculateDistance(from: LatLng, to: LatLng): number;
  calculateEta(distanceKm: number, averageSpeedKmH?: number): { minutes: number; formatted: string };
  interpolatePosition(route: LatLng[], progressPercent: number): { position: LatLng; bearingDeg: number };
  getRouteGeometry(origin: MapWaypoint, destination: MapWaypoint): Promise<RouteGeometry>;
}

/**
 * Standard Haversine formula for calculating great-circle distance between two points on earth
 */
export function calculateHaversineDistanceKm(from: LatLng, to: LatLng): number {
  const R = 6371; // Earth radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculate bearing angle in degrees between two points
 */
export function calculateBearing(start: LatLng, end: LatLng): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Default MockMapProvider for client-side prototype execution
 */
export class MockMapProvider implements IMapProvider {
  calculateDistance(from: LatLng, to: LatLng): number {
    return calculateHaversineDistanceKm(from, to);
  }

  calculateEta(distanceKm: number, averageSpeedKmH = 48): { minutes: number; formatted: string } {
    if (distanceKm <= 0) return { minutes: 0, formatted: 'Delivered' };
    const hoursDecimal = distanceKm / averageSpeedKmH;
    const totalMinutes = Math.round(hoursDecimal * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const formatted =
      hours > 0
        ? `${hours}h ${minutes.toString().padStart(2, '0')}m`
        : `${minutes} mins`;

    return { minutes: totalMinutes, formatted };
  }

  interpolatePosition(route: LatLng[], progressPercent: number): { position: LatLng; bearingDeg: number } {
    if (!route || route.length === 0) {
      return { position: { lat: 0, lng: 0 }, bearingDeg: 0 };
    }
    if (route.length === 1 || progressPercent <= 0) {
      return { position: route[0], bearingDeg: 0 };
    }
    if (progressPercent >= 100) {
      const last = route[route.length - 1];
      const prev = route[route.length - 2] || last;
      return { position: last, bearingDeg: calculateBearing(prev, last) };
    }

    // Segment interpolation
    const totalSegments = route.length - 1;
    const fractionalProgress = (progressPercent / 100) * totalSegments;
    const segmentIndex = Math.min(Math.floor(fractionalProgress), totalSegments - 1);
    const segmentT = fractionalProgress - segmentIndex;

    const p0 = route[segmentIndex];
    const p1 = route[segmentIndex + 1];

    const lat = p0.lat + (p1.lat - p0.lat) * segmentT;
    const lng = p0.lng + (p1.lng - p0.lng) * segmentT;

    return {
      position: { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) },
      bearingDeg: Math.round(calculateBearing(p0, p1)),
    };
  }

  async getRouteGeometry(origin: MapWaypoint, destination: MapWaypoint): Promise<RouteGeometry> {
    const directDistance = this.calculateDistance(origin, destination);
    // Estimated road distance roughly 1.25x direct distance
    const roadDistance = Math.round(directDistance * 1.25);
    const eta = this.calculateEta(roadDistance);

    return {
      origin,
      destination,
      waypoints: [origin, destination],
      pathCoordinates: [
        { lat: origin.lat, lng: origin.lng },
        {
          lat: origin.lat + (destination.lat - origin.lat) * 0.4 + 0.05,
          lng: origin.lng + (destination.lng - origin.lng) * 0.4 - 0.04,
        },
        {
          lat: origin.lat + (destination.lat - origin.lat) * 0.75 - 0.02,
          lng: origin.lng + (destination.lng - origin.lng) * 0.75 + 0.03,
        },
        { lat: destination.lat, lng: destination.lng },
      ],
      totalDistanceKm: roadDistance,
      estimatedDurationMinutes: eta.minutes,
    };
  }
}

export const mapsService: IMapProvider = new MockMapProvider();
