import { create } from 'zustand';
import { POI, ViewportState } from '../types';
import { POIS } from '../data/poi';

interface MapStoreState {
  pois: POI[];
  selectedPoiId?: string;
  savedPoiIds: Set<string>;
  viewport: ViewportState;
  setViewport: (viewport: Partial<ViewportState>) => void;
  setSelectedPoi: (poiId?: string) => void;
  toggleSaved: (poiId: string) => void;
}

function loadSaved(): Set<string> {
  try {
    const raw = localStorage.getItem('savedPoiIds');
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export const useMapStore = create<MapStoreState>((set, get) => ({
  pois: POIS,
  selectedPoiId: undefined,
  savedPoiIds: loadSaved(),
  viewport: {
    center: { lat: 20, lng: 0 },
    zoom: 3,
    bounds: undefined,
  },
  setViewport: (viewport) =>
    set((state) => ({
      viewport: {
        center: viewport.center ?? state.viewport.center,
        zoom: viewport.zoom ?? state.viewport.zoom,
        bounds: viewport.bounds ?? state.viewport.bounds,
      },
    })),
  setSelectedPoi: (poiId) => set({ selectedPoiId: poiId }),
  toggleSaved: (poiId) =>
    set((state) => {
      const next = new Set(state.savedPoiIds);
      if (next.has(poiId)) {
        next.delete(poiId);
      } else {
        next.add(poiId);
      }
      try {
        localStorage.setItem('savedPoiIds', JSON.stringify(Array.from(next)));
      } catch {}
      return { savedPoiIds: next };
    }),
}));

