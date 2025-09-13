import { memo, useEffect, useMemo, useRef } from 'react';
import { useMapStore } from '../store/useMapStore';

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const x = (lng + 180) / 360; // 0..1
  const y = (90 - lat) / 180; // 0..1 (simple equirectangular)
  return { x, y };
}

export const MiniMap = memo(function MiniMap() {
  const viewport = useMapStore((s) => s.viewport);
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    // draw simple graticule for continents hint
    for (let i = 1; i < 12; i++) {
      const x = (i / 12) * w;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let i = 1; i < 6; i++) {
      const y = (i / 6) * h;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    if (viewport.bounds) {
      const [[south, west], [north, east]] = viewport.bounds;
      const tl = latLngToXY(north, west);
      const br = latLngToXY(south, east);
      const x = tl.x * w;
      const y = tl.y * h;
      const rw = (br.x - tl.x) * w;
      const rh = (br.y - tl.y) * h;
      ctx.strokeStyle = '#0af';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, rw, rh);
    }
    // continent and country/state rectangles simplified as two small markers
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(w - 56, 8, 48, 24); // continent placeholder
    ctx.fillRect(w - 56, 36, 48, 24); // country/state placeholder
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(w - 56, 8, 48, 24);
    ctx.strokeRect(w - 56, 36, 48, 24);
  }, [viewport]);

  return (
    <div className="mini-map">
      <canvas ref={ref} width={240} height={120} />
    </div>
  );
});

