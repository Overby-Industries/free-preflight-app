'use client';

import React, { useEffect, useState } from 'react';
import { fieldEntries, formatFieldValue } from './weather-text-utils';

const GetFeatures = () => {
    const [icao, setIcao] = useState('KJLN');
    const [items, setItems] = useState<Record<string, unknown>[]>([]);
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
                throw new Error(featureData.error ?? 'Failed to fetch sectional chart features.');
            }
            setItems(Array.isArray(featureData) ? featureData : []);
        } catch (err) {
            setItems([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch sectional chart features.');
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
            <span className="eyebrow">Sectional Chart Features</span>
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
            <div className="panel flex flex-col gap-3 text-[var(--color-text)] max-h-64 overflow-y-auto">
                {items.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No landmark features found within 10 NM.</span>
                )}
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-1 text-sm border-b border-[var(--color-rule)] pb-2 last:border-b-0 last:pb-0"
                    >
                        {fieldEntries(item).map(([key, value]) => (
                            <div key={key} className="flex justify-between gap-2">
                                <span className="opacity-60 shrink-0">{key}</span>
                                <span className="text-right break-all min-w-0 flex-1">{formatFieldValue(value)}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetFeatures;
