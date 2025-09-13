export type POIType =
  | 'city'
  | 'nature'
  | 'beach'
  | 'mountain'
  | 'museum'
  | 'landmark'
  | 'food'
  | 'temple';

export interface POI {
  id: string;
  name: string;
  type: POIType;
  lat: number;
  lng: number;
  country: string;
  region?: string; // state/province/region
  description?: string;
  url?: string; // optional external link
}

export interface ViewportState {
  center: { lat: number; lng: number };
  zoom: number;
  bounds?: [[number, number], [number, number]]; // [[south, west],[north, east]]
}

