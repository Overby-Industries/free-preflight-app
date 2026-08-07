'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/app/context/theme-context';
import type { AdsbAircraft } from './traffic-map';

const TrafficMap = dynamic(() => import('./traffic-map'), { ssr: false });

const GetTraffic = () => {
    const { theme } = useTheme();
    const [icao, setIcao] = useState('KJLN');
    const [center, setCenter] = useState<[number, number] | null>(null);
    const [aircraft, setAircraft] = useState<AdsbAircraft[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTraffic = async (code: string) => {
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const metarResponse = await fetch(`/api/metar?ids=${encodeURIComponent(code)}`);
            const metarData = await metarResponse.json();
            if (!metarResponse.ok) {
                throw new Error(metarData.error ?? 'Failed to look up airport location.');
            }
            const { lat, lon } = metarData[0];
            if (typeof lat !== 'number' || typeof lon !== 'number') {
                throw new Error(`No location data available for "${code}".`);
            }

            const trafficResponse = await fetch(`/api/traffic?lat=${lat}&lon=${lon}&radius=30`);
            const trafficData = await trafficResponse.json();
            if (!trafficResponse.ok) {
                throw new Error(trafficData.error ?? 'Failed to fetch traffic.');
            }

            setCenter([lat, lon]);
            setAircraft(trafficData.ac ?? []);
        } catch (err) {
            setCenter(null);
            setAircraft([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch traffic.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTraffic(icao);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full">
            <label className="flex flex-row h-fit w-full items-center justify-between gap-2 py-4">
                Traffic:
                <input
                    className="flex-1 min-w-0 bg-[var(--color-panel)] text-[var(--color-text)] rounded-md p-2"
                    value={icao}
                    onChange={(e) => setIcao(e.target.value.toUpperCase())}
                    maxLength={4}
                    placeholder="ICAO e.g. KJLN"
                />
                <button
                    type="button"
                    className="text-[var(--color-accent)] items-center h-fit w-1/4 bg-[var(--color-panel)] rounded-md p-2 disabled:opacity-50"
                    onClick={() => fetchTraffic(icao)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Show Traffic'}
                </button>
            </label>
            {error && <p className="text-red-500 text-sm pb-2">{error}</p>}
            {center && (
                <>
                    <p className="text-sm pb-2 opacity-70">{aircraft.length} aircraft nearby</p>
                    <TrafficMap center={center} aircraft={aircraft} theme={theme} />
                </>
            )}
        </div>
    );
};

export default GetTraffic;
