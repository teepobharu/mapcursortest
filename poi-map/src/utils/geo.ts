import type { POI } from '../types';

export function toGeoJSONFeatures(pois: POI[]) {
  return pois.map((p) => ({
    type: 'Feature' as const,
    properties: { id: p.id, name: p.name, type: p.type, country: p.country },
    geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] },
  }));
}

export function haversineDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

export function groupByCountry(pois: POI[]): Record<string, POI[]> {
  return pois.reduce<Record<string, POI[]>>((acc, poi) => {
    if (!acc[poi.country]) acc[poi.country] = [];
    acc[poi.country].push(poi);
    return acc;
  }, {});
}

