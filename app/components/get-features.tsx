'use client';

// NOTE: not currently rendered anywhere (see
// app/ui/dashboard/weather/reference/page.tsx) — a nationwide CONUS bbox
// against aviationweather.gov's /api/data/feature returns no usable data in
// practice. Left in place for future rework; the most promising next idea
// is querying along a flight route (departure/destination pair, buffered
// into a corridor bbox or a sequence of leg-sized boxes) instead of one
// static area, since this dataset may be meant for per-leg lookups.

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/app/context/theme-context';
import type { FeaturesGeoJson } from './features-map';

const FeaturesMap = dynamic(() => import('./features-map'), { ssr: false });

const EMPTY_FEATURES: FeaturesGeoJson = { type: 'FeatureCollection', features: [] };
const CONUS_CENTER: [number, number] = [39.8283, -98.5795];

const GetFeatures = () => {
    const { theme } = useTheme();
    const [features, setFeatures] = useState<FeaturesGeoJson>(EMPTY_FEATURES);
    const [version, setVersion] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFeatures = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/feature');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch aviation navigation features.');
            }
            setFeatures(data);
            setVersion((v) => v + 1);
        } catch (err) {
            setFeatures(EMPTY_FEATURES);
            setError(err instanceof Error ? err.message : 'Failed to fetch aviation navigation features.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Aviation Navigation Features</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchFeatures()}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <div className="panel">
                <p className="text-sm pb-2 text-[var(--color-text-accent)]">
                    {features.features.length} feature{features.features.length === 1 ? '' : 's'} nationwide
                </p>
                <FeaturesMap center={CONUS_CENTER} zoom={4} theme={theme} features={features} version={version} />
            </div>
        </div>
    );
};

export default GetFeatures;
