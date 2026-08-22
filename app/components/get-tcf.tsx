'use client';

import React, { useEffect, useState } from 'react';
import { pickRawText } from './weather-text-utils';

type TcfItem = Record<string, unknown> & {
    id?: string;
};

const GetTcf = () => {
    const [items, setItems] = useState<TcfItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTcf = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/tcf');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch TFM Convective Forecasts.');
            }
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setItems([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch TFM Convective Forecasts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTcf();
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">TFM Convective Forecast</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchTcf()}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <div className="panel flex flex-col gap-3 text-[var(--color-text)] max-h-64 overflow-y-auto">
                {items.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No current TFM Convective Forecast.</span>
                )}
                {items.map((item, index) => (
                    <div key={`${item.id ?? index}`} className="flex flex-col gap-1">
                        <span className="text-sm break-words whitespace-pre-wrap">{pickRawText(item)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetTcf;
