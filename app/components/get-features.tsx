'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/app/context/theme-context';
import type { FeaturesGeoJson } from './features-map';

const FeaturesMap = dynamic(() => import('./features-map'), { ssr: false });

const EMPTY_FEATURES: FeaturesGeoJson = { type: 'FeatureCollection', features: [] };

const GetFeatures = () => {
    const { theme } = useTheme();
    const [icao, setIcao] = useState('KJLN');
    const [center, setCenter] = useState<[number, number] | null>(null);
    const [features, setFeatures] = useState<FeaturesGeoJson>(EMPTY_FEATURES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFeatures = async (code: string) => {
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

            const featureResponse = await fetch(`/api/feature?lat=${lat}&lon=${lon}&radius=10`);
            const featureData = await featureResponse.json();
            if (!featureResponse.ok) {
                throw new Error(featureData.error ?? 'Failed to fetch aviation navigation features.');
            }

            setCenter([lat, lon]);
            setFeatures(featureData);
        } catch (err) {
            setCenter(null);
            setFeatures(EMPTY_FEATURES);
            setError(err instanceof Error ? err.message : 'Failed to fetch aviation navigation features.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures(icao);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Aviation Navigation Features</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <input
                    className="field flex-1 min-w-0"
                    value={icao}
                    onChange={(e) => setIcao(e.target.value.toUpperCase())}
                    maxLength={4}
                    placeholder="ICAO e.g. KJLN"
                />
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchFeatures(icao)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Search'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            {center && (
                <div className="panel">
                    <p className="text-sm pb-2 text-[var(--color-text-accent)]">
                        {features.features.length} feature{features.features.length === 1 ? '' : 's'} within 10 NM
                    </p>
                    <FeaturesMap center={center} theme={theme} features={features} />
                </div>
            )}
        </div>
    );
};

export default GetFeatures;
