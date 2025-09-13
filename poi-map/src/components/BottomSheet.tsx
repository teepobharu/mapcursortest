import { memo, useMemo, useRef, useState } from 'react';
import { useMapStore } from '../store/useMapStore';
import { haversineDistanceKm, groupByCountry } from '../utils/geo';
import type { POI } from '../types';

type TabKey = 'Current' | 'All' | 'Saved';

function useViewportCenterOrSelected() {
  const { viewport, pois, selectedPoiId } = useMapStore((s) => ({ viewport: s.viewport, pois: s.pois, selectedPoiId: s.selectedPoiId }));
  const selected = pois.find((p) => p.id === selectedPoiId);
  return selected ? { lat: selected.lat, lng: selected.lng } : viewport.center;
}

function currentPoisSorted(): POI[] {
  const { pois, viewport } = useMapStore.getState();
  const center = useViewportCenterOrSelected();
  const inBounds = viewport.bounds
    ? pois.filter((p) =>
        p.lat >= viewport.bounds![0][0] &&
        p.lat <= viewport.bounds![1][0] &&
        p.lng >= viewport.bounds![0][1] &&
        p.lng <= viewport.bounds![1][1]
      )
    : pois;
  return inBounds
    .slice()
    .sort((a, b) => haversineDistanceKm(center, { lat: a.lat, lng: a.lng }) - haversineDistanceKm(center, { lat: b.lat, lng: b.lng }));
}

export const BottomSheet = memo(function BottomSheet() {
  const { pois, savedPoiIds } = useMapStore((s) => ({ pois: s.pois, savedPoiIds: s.savedPoiIds }));
  const setSelectedPoi = useMapStore((s) => s.setSelectedPoi);
  const toggleSaved = useMapStore((s) => s.toggleSaved);
  const [tab, setTab] = useState<TabKey>('Current');
  const [heightPct, setHeightPct] = useState<number>(0.1);

  const current = useMemo(() => currentPoisSorted(), [useMapStore((s) => s.viewport), useMapStore((s) => s.selectedPoiId)]);
  const savedList = useMemo(() => pois.filter((p) => savedPoiIds.has(p.id)), [pois, savedPoiIds]);
  const countries = useMemo(() => groupByCountry(pois), [pois]);
  const countryKeys = useMemo(() => Object.keys(countries).sort((a, b) => a.localeCompare(b)), [countries]);

  function handleDrag(deltaY: number) {
    const viewportH = window.innerHeight;
    const currentPx = viewportH * heightPct;
    const nextPx = Math.max(0.1 * viewportH, Math.min(viewportH, currentPx - deltaY));
    const steps = [0.1, 0.5, 1];
    const nextPctRaw = nextPx / viewportH;
    const snapped = steps.reduce((prev, s) => (Math.abs(s - nextPctRaw) < Math.abs(prev - nextPctRaw) ? s : prev), steps[0]);
    setHeightPct(snapped);
  }

  return (
    <div className="bottom-sheet" style={{ height: `${Math.round(heightPct * 100)}vh` }}>
      <div className="drag-handle" onMouseDown={(e) => {
        const startY = e.clientY;
        function onMove(ev: MouseEvent) { handleDrag(ev.clientY - startY); }
        function onUp() { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      }} onTouchStart={(e) => {
        const startY = e.touches[0].clientY;
        function onMove(ev: TouchEvent) { handleDrag(ev.touches[0].clientY - startY); }
        function onUp() { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onUp); }
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onUp);
      }}>
        <div className="grip" />
      </div>
      <div className="tabs">
        {(['Current','All','Saved'] as TabKey[]).map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="sheet-content">
        {tab === 'Current' && (
          <ul className="list">
            {current.map((p) => (
              <li key={p.id} className="item" onClick={() => setSelectedPoi(p.id)}>
                <div className="item-title">{p.name}</div>
                <div className="item-sub">{p.country}{p.region ? ` • ${p.region}` : ''}</div>
                <button className={`heart ${savedPoiIds.has(p.id) ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSaved(p.id); }}>
                  {savedPoiIds.has(p.id) ? '♥' : '♡'}
                </button>
              </li>
            ))}
          </ul>
        )}
        {tab === 'All' && (
          <div className="all">
            {countryKeys.map((c) => (
              <div key={c} className="country-section">
                <div className="country-title">{c}</div>
                <ul className="list">
                  {countries[c].map((p) => (
                    <li key={p.id} className="item" onClick={() => setSelectedPoi(p.id)}>
                      <div className="item-title">{p.name}</div>
                      <div className="item-sub">{p.region ? `${p.region} • ` : ''}{p.type}</div>
                      <button className={`heart ${savedPoiIds.has(p.id) ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSaved(p.id); }}>
                        {savedPoiIds.has(p.id) ? '♥' : '♡'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {tab === 'Saved' && (
          <ul className="list">
            {savedList.length === 0 && <div className="empty">No saved places.</div>}
            {savedList.map((p) => (
              <li key={p.id} className="item" onClick={() => setSelectedPoi(p.id)}>
                <div className="item-title">{p.name}</div>
                <div className="item-sub">{p.country}{p.region ? ` • ${p.region}` : ''}</div>
                <button className={`heart ${savedPoiIds.has(p.id) ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSaved(p.id); }}>
                  {savedPoiIds.has(p.id) ? '♥' : '♡'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

