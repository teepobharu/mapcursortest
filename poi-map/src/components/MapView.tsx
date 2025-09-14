import { memo, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, ZoomControl } from 'react-leaflet';
import L, { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Supercluster from 'supercluster';
import { useMapStore } from '../store/useMapStore';
import type { POI } from '../types';
import { toGeoJSONFeatures } from '../utils/geo';

const darkTilesUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const darkTilesAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const poiIconCache: Record<string, L.DivIcon> = {};
function getPoiIcon(type: string) {
  if (poiIconCache[type]) return poiIconCache[type];
  const emoji =
    type === 'city' ? '🏙️' :
    type === 'nature' ? '🌲' :
    type === 'beach' ? '🏖️' :
    type === 'mountain' ? '⛰️' :
    type === 'museum' ? '🏛️' :
    type === 'landmark' ? '📍' :
    type === 'food' ? '🍜' :
    type === 'temple' ? '⛩️' : '📌';
  poiIconCache[type] = L.divIcon({
    className: 'poi-marker',
    html: `<div class="poi pin">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
  return poiIconCache[type];
}

const clusterIcon = (count: number) =>
  L.divIcon({
    className: 'cluster-marker',
    html: `<div class="cluster">${count}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

function MapEventSync() {
  const setViewport = useMapStore((s) => s.setViewport);
  const map = useMap();
  useMapEvents({
    moveend() {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const b = map.getBounds();
      setViewport({
        center: { lat: center.lat, lng: center.lng },
        zoom,
        bounds: [
          [b.getSouth(), b.getWest()],
          [b.getNorth(), b.getEast()],
        ],
      });
    },
    zoomend() {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const b = map.getBounds();
      setViewport({
        center: { lat: center.lat, lng: center.lng },
        zoom,
        bounds: [
          [b.getSouth(), b.getWest()],
          [b.getNorth(), b.getEast()],
        ],
      });
    },
  });
  return null;
}

function useClusters(pois: POI[], zoom: number, bounds?: [[number, number], [number, number]]) {
  const index = useMemo(() => {
    const idx = new Supercluster({ radius: 60, maxZoom: 18 });
    idx.load(toGeoJSONFeatures(pois));
    return idx;
  }, [pois]);

  return useMemo(() => {
    if (!bounds) return [] as any[];
    const b = { west: bounds[0][1], south: bounds[0][0], east: bounds[1][1], north: bounds[1][0] };
    return index.getClusters([b.west, b.south, b.east, b.north], Math.round(zoom));
  }, [index, zoom, bounds]);
}

function FitSelected() {
  const selectedPoiId = useMapStore((s) => s.selectedPoiId);
  const pois = useMapStore((s) => s.pois);
  const map = useMap();
  useEffect(() => {
    if (!selectedPoiId) return;
    const poi = pois.find((p) => p.id === selectedPoiId);
    if (!poi) return;
    map.flyTo([poi.lat, poi.lng], Math.max(8, map.getZoom()), { duration: 0.6 });
  }, [selectedPoiId, pois, map]);
  return null;
}

export const MapView = memo(function MapView() {
  const { pois, viewport } = useMapStore((s) => ({ pois: s.pois, viewport: s.viewport }));
  const setSelectedPoi = useMapStore((s) => s.setSelectedPoi);
  const toggleSaved = useMapStore((s) => s.toggleSaved);
  const savedSet = useMapStore((s) => s.savedPoiIds);
  const mapRef = useRef<L.Map | null>(null);

  const clusters = useClusters(pois, viewport.zoom, viewport.bounds);

  return (
    <div className="map-root">
      <MapContainer
        center={[viewport.center.lat, viewport.center.lng]}
        zoom={viewport.zoom}
        zoomControl={false}
        minZoom={2}
        worldCopyJump
        ref={(m) => (mapRef.current = m as any)}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={darkTilesUrl} attribution={darkTilesAttribution} />
        <ZoomControl position="bottomright" />
        <MapEventSync />
        <FitSelected />
        {clusters.map((item: any) => {
          const [lng, lat] = item.geometry.coordinates;
          const { cluster, point_count: pointCount } = item.properties as any;
          if (cluster) {
            return (
              <Marker
                key={`cluster-${item.id}`}
                position={[lat, lng]}
                icon={clusterIcon(pointCount)}
                eventHandlers={{
                  click: () => {
                    const expansionZoom = (item as any).properties.cluster_id
                      ? (mapRef.current && (mapRef.current as any))
                      : null;
                    const superclusterZoom = (clusters as any).supercluster?.getClusterExpansionZoom?.(item.id) ?? undefined;
                    const nextZoom = Math.min(18, (superclusterZoom ?? (Math.round(viewport.zoom) + 2)) as number);
                    mapRef.current?.setView([lat, lng], nextZoom, { animate: true });
                  },
                }}
              />
            );
          }
          const poi = pois.find((p) => p.id === (item.properties as any).id);
          if (!poi) return null;
          return (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lng]}
              icon={getPoiIcon(poi.type)}
              eventHandlers={{ click: () => setSelectedPoi(poi.id) }}
            >
              <Popup minWidth={220} maxWidth={260} autoPan>
                <div className="popup">
                  <div className="popup-title">{poi.name}</div>
                  <div className="popup-sub">{poi.country}{poi.region ? ` • ${poi.region}` : ''}</div>
                  {poi.description ? <div className="popup-desc">{poi.description}</div> : null}
                  <div className="popup-actions">
                    <a
                      className="btn"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${poi.name} ${poi.country}`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Navigate
                    </a>
                    <button className={`btn ${savedSet.has(poi.id) ? 'saved' : ''}`} onClick={() => toggleSaved(poi.id)}>
                      {savedSet.has(poi.id) ? '♥ Saved' : '♡ Save'}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
});

