'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/app/context/theme-context';
import type { AlertsGeoJson } from './radar-satellite-map';

const RadarSatelliteMap = dynamic(() => import('./radar-satellite-map'), { ssr: false });

const CONUS_CENTER: [number, number] = [39.8283, -98.5795];
const CONUS_ZOOM = 4;
const AIRPORT_ZOOM = 9;

const GetRadar = () => {
    const { theme } = useTheme();
    const [icao, setIcao] = useState('');
    const [area, setArea] = useState('MO');
    const [center, setCenter] = useState<[number, number]>(CONUS_CENTER);
    const [zoom, setZoom] = useState(CONUS_ZOOM);
    const [showRadar, setShowRadar] = useState(true);
    const [showSatellite, setShowSatellite] = useState(true);
    const [showAlerts, setShowAlerts] = useState(true);
    const [radarOpacity, setRadarOpacity] = useState(0.7);
    const [satelliteOpacity, setSatelliteOpacity] = useState(0.6);
    const [alerts, setAlerts] = useState<AlertsGeoJson | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recenter = async (code: string) => {
        if (!code.trim()) {
            setCenter(CONUS_CENTER);
            setZoom(CONUS_ZOOM);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/metar?ids=${encodeURIComponent(code)}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to look up airport location.');
            }
            const { lat, lon } = data[0];
            if (typeof lat !== 'number' || typeof lon !== 'number') {
                throw new Error(`No location data available for "${code}".`);
            }
            setCenter([lat, lon]);
            setZoom(AIRPORT_ZOOM);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to look up airport location.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAlerts = async (stateCode: string) => {
        if (!stateCode.trim()) {
            setAlerts(null);
            return;
        }
        try {
            const response = await fetch(`/api/alerts?area=${encodeURIComponent(stateCode.trim())}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch active alerts.');
            }
            setAlerts(data);
        } catch (err) {
            setAlerts(null);
            setError((prev) => prev ?? (err instanceof Error ? err.message : 'Failed to fetch active alerts.'));
        }
    };

    useEffect(() => {
        fetchAlerts(area);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Radar &amp; Satellite</span>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pb-3">
                <input
                    className="field w-full sm:w-auto sm:flex-1 sm:max-w-xs"
                    value={icao}
                    onChange={(e) => setIcao(e.target.value.toUpperCase())}
                    maxLength={4}
                    placeholder="Center on ICAO e.g. KJLN (optional)"
                />
                <button type="button" className="btn" onClick={() => recenter(icao)} disabled={loading}>
                    {loading ? 'Loading...' : 'Center'}
                </button>
            </div>

            <div className="panel flex flex-col gap-3 mb-3">
                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={showRadar} onChange={(e) => setShowRadar(e.target.checked)} />
                        Radar
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={showSatellite}
                            onChange={(e) => setShowSatellite(e.target.checked)}
                        />
                        Satellite
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={showAlerts} onChange={(e) => setShowAlerts(e.target.checked)} />
                        Active Alerts
                    </label>
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <span className="w-20 shrink-0">Radar opacity</span>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={radarOpacity}
                        onChange={(e) => setRadarOpacity(Number(e.target.value))}
                        className="flex-1"
                    />
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <span className="w-20 shrink-0">Satellite opacity</span>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={satelliteOpacity}
                        onChange={(e) => setSatelliteOpacity(Number(e.target.value))}
                        className="flex-1"
                    />
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                        className="field w-full sm:w-auto"
                        value={area}
                        onChange={(e) => setArea(e.target.value.toUpperCase())}
                        maxLength={2}
                        placeholder="Alerts state e.g. MO"
                    />
                    <button type="button" className="btn" onClick={() => fetchAlerts(area)}>
                        Refresh Alerts
                    </button>
                </div>
            </div>

            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}

            <div className="panel">
                <RadarSatelliteMap
                    center={center}
                    zoom={zoom}
                    theme={theme}
                    showRadar={showRadar}
                    showSatellite={showSatellite}
                    showAlerts={showAlerts}
                    radarOpacity={radarOpacity}
                    satelliteOpacity={satelliteOpacity}
                    alerts={alerts}
                />
            </div>
        </div>
    );
};

export default GetRadar;
