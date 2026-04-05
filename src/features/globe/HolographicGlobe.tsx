'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { OIL_ROUTES, CHOKEPOINTS, CONFLICT_ZONES, COLORS } from '@/lib/constants';

interface ArcData {
  readonly startLat: number;
  readonly startLng: number;
  readonly endLat: number;
  readonly endLng: number;
  readonly color: string;
  readonly name: string;
}

interface PointData {
  readonly lat: number;
  readonly lng: number;
  readonly name: string;
  readonly dailyBarrels: string;
  readonly size: number;
  readonly color: string;
  readonly isHormuz?: boolean;
}

interface RingData {
  readonly lat: number;
  readonly lng: number;
  readonly maxR: number;
  readonly color: string;
}

export default function HolographicGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const arcsData: readonly ArcData[] = useMemo(
    () =>
      OIL_ROUTES.map((route) => ({
        startLat: route.start.lat,
        startLng: route.start.lng,
        endLat: route.end.lat,
        endLng: route.end.lng,
        color: route.color,
        name: route.name,
      })),
    []
  );

  const pointsData: readonly PointData[] = useMemo(
    () =>
      Object.entries(CHOKEPOINTS).map(([key, cp]) => {
        const isHormuz = key === 'HORMUZ';
        return {
          lat: cp.lat,
          lng: cp.lng,
          name: cp.name,
          dailyBarrels: cp.dailyBarrels,
          size: isHormuz ? 1.2 : 0.6,
          color: isHormuz ? COLORS.danger : COLORS.warning,
          isHormuz,
        };
      }),
    []
  );

  const ringsData: readonly RingData[] = useMemo(
    () =>
      Object.entries(CHOKEPOINTS).map(([key, cp]) => {
        const isHormuz = key === 'HORMUZ';
        return {
          lat: cp.lat,
          lng: cp.lng,
          maxR: isHormuz ? 5 : 3,
          color: isHormuz ? COLORS.danger : COLORS.primary,
        };
      }),
    []
  );

  // Extra pulsing rings for Hormuz emphasis
  const hormuzExtraRings: readonly RingData[] = useMemo(
    () => [
      { lat: CHOKEPOINTS.HORMUZ.lat, lng: CHOKEPOINTS.HORMUZ.lng, maxR: 8, color: COLORS.danger },
      { lat: CHOKEPOINTS.HORMUZ.lat, lng: CHOKEPOINTS.HORMUZ.lng, maxR: 12, color: COLORS.warning },
    ],
    []
  );

  const conflictPointsData: readonly PointData[] = useMemo(
    () =>
      CONFLICT_ZONES.map((zone) => ({
        lat: zone.lat,
        lng: zone.lng,
        name: zone.name,
        dailyBarrels: '',
        size: zone.radius * 0.3,
        color: zone.severity === 'high' ? COLORS.danger : COLORS.warning,
      })),
    []
  );

  const conflictRingsData: readonly RingData[] = useMemo(
    () =>
      CONFLICT_ZONES.map((zone) => ({
        lat: zone.lat,
        lng: zone.lng,
        maxR: zone.radius,
        color: zone.severity === 'high' ? COLORS.danger : COLORS.warning,
      })),
    []
  );

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 25, lng: 50, altitude: 2.2 }, 1000);

      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.enableZoom = true;
      }
    }
  }, []);

  const getArcColor = useCallback((d: object) => {
    const arc = d as ArcData;
    return [`${arc.color}cc`, `${arc.color}44`];
  }, []);

  const getPointColor = useCallback((d: object) => (d as PointData).color, []);
  const getPointAlt = useCallback(() => 0.01, []);
  const getPointRadius = useCallback((d: object) => (d as PointData).size, []);

  const getRingColor = useCallback((d: object) => {
    const ring = d as RingData;
    if (ring.color === COLORS.danger) {
      return (t: number) => `rgba(255, 0, 64, ${Math.sqrt(1 - t)})`;
    }
    if (ring.color === COLORS.warning) {
      return (t: number) => `rgba(255, 170, 0, ${Math.sqrt(1 - t) * 0.6})`;
    }
    return (t: number) => `rgba(0, 240, 255, ${Math.sqrt(1 - t)})`;
  }, []);
  const getRingMaxR = useCallback((d: object) => (d as RingData).maxR, []);
  const getRingSpeed = useCallback((d: object) => {
    const ring = d as RingData;
    return ring.maxR > 5 ? 2 : 1;
  }, []);
  const getRingRepeatPeriod = useCallback((d: object) => {
    const ring = d as RingData;
    return ring.maxR > 5 ? 1200 : 800;
  }, []);

  const getArcDashLength = useCallback(() => 0.4, []);
  const getArcDashGap = useCallback(() => 0.2, []);
  const getArcDashAnimateTime = useCallback(() => 2000, []);
  const getArcStroke = useCallback(() => 0.5, []);

  const getArcLabel = useCallback((d: object) => {
    const arc = d as ArcData;
    return `<div style="color: ${COLORS.primary}; font-size: 11px; padding: 4px 8px; background: rgba(0,10,20,0.9); border: 1px solid rgba(0,240,255,0.3); border-radius: 4px;">${arc.name}</div>`;
  }, []);

  const getPointLabel = useCallback((d: object) => {
    const point = d as PointData;
    if (point.isHormuz) {
      return `<div style="color: #ff0040; font-size: 12px; padding: 8px 12px; background: rgba(10,0,0,0.95); border: 1px solid rgba(255,0,64,0.6); border-radius: 4px; min-width: 200px;">
        <div style="font-weight: bold; font-size: 13px; margin-bottom: 4px;">&#9888; STRAIT OF HORMUZ</div>
        <div style="color: #ffaa00; font-size: 10px; margin-bottom: 2px;">CRITICAL CHOKEPOINT - PRIORITY MONITOR</div>
        <div style="color: #c0e8ff; font-size: 10px;">Daily flow: 21M bbl/day (21% global supply)</div>
        <div style="color: #c0e8ff; font-size: 10px;">Width: 33km | Depth: 60m</div>
        <div style="color: #ff0040; font-size: 10px; margin-top: 4px;">Iran threat level: ELEVATED</div>
      </div>`;
    }
    return `<div style="color: ${COLORS.primary}; font-size: 11px; padding: 4px 8px; background: rgba(0,10,20,0.9); border: 1px solid rgba(0,240,255,0.3); border-radius: 4px;">
      <strong>${point.name}</strong>${point.dailyBarrels ? `<br/>${point.dailyBarrels} bbl/day` : ''}
    </div>`;
  }, []);

  const allPoints = useMemo(
    () => [...pointsData, ...conflictPointsData],
    [pointsData, conflictPointsData]
  );

  const allRings = useMemo(
    () => [...ringsData, ...hormuzExtraRings, ...conflictRingsData],
    [ringsData, hormuzExtraRings, conflictRingsData]
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Globe glow effect */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,240,255,0.03) 0%, transparent 60%)',
        }}
      />
      <div className="absolute inset-0">
      <Globe
        ref={globeRef}
        width={undefined}
        height={undefined}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        atmosphereColor={COLORS.primary}
        atmosphereAltitude={0.2}
        // Arcs - oil routes
        arcsData={arcsData as unknown as object[]}
        arcColor={getArcColor}
        arcDashLength={getArcDashLength}
        arcDashGap={getArcDashGap}
        arcDashAnimateTime={getArcDashAnimateTime}
        arcStroke={getArcStroke}
        arcLabel={getArcLabel}
        // Points - chokepoints + conflict zones
        pointsData={allPoints as unknown as object[]}
        pointColor={getPointColor}
        pointAltitude={getPointAlt}
        pointRadius={getPointRadius}
        pointLabel={getPointLabel}
        // Rings - pulsing markers
        ringsData={allRings as unknown as object[]}
        ringColor={getRingColor}
        ringMaxRadius={getRingMaxR}
        ringPropagationSpeed={getRingSpeed}
        ringRepeatPeriod={getRingRepeatPeriod}
      />
      </div>

      {/* Globe title overlay */}
      <div className="absolute left-4 top-4 z-20 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
        GLOBAL OIL FLOW MONITOR
      </div>

      {/* Hormuz priority monitor badge */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded border border-[rgba(255,0,64,0.4)] bg-[rgba(255,0,64,0.08)]">
        <div className="h-2 w-2 rounded-full bg-[var(--color-danger)] pulse-glow" />
        <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--color-danger)] font-bold">
          HORMUZ PRIORITY WATCH
        </span>
      </div>
    </div>
  );
}
