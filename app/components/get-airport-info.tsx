'use client';

import React, { useEffect, useState } from 'react';
import { fieldEntries, formatFieldValue } from './weather-text-utils';

const GetAirportInfo = () => {
    const [icao, setIcao] = useState('KJLN');
    const [items, setItems] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAirport = async (code: string) => {
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/airport?ids=${encodeURIComponent(code)}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch airport/station info.');
            }
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setItems([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch airport/station info.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirport(icao);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Airport / Station Info</span>
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
                    onClick={() => fetchAirport(icao)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Look Up'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <div className="panel flex flex-col gap-3 text-[var(--color-text)]">
                {items.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No airport/station info.</span>
                )}
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1 text-sm">
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

export default GetAirportInfo;
