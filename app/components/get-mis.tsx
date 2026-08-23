'use client';

import React, { useEffect, useState } from 'react';
import { pickRawText } from './weather-text-utils';

type MisItem = Record<string, unknown> & {
    cwsu?: string;
    id?: string;
};

const GetMis = () => {
    const [items, setItems] = useState<MisItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMis = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/mis');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch Meteorological Impact Statements.');
            }
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setItems([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch Meteorological Impact Statements.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMis();
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Meteorological Impact Statements</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchMis()}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <div className="panel flex flex-col gap-3 text-[var(--color-text)] max-h-64 overflow-y-auto">
                {items.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No active Meteorological Impact Statements.</span>
                )}
                {items.map((item, index) => (
                    <div key={`${item.id ?? index}`} className="flex flex-col gap-1">
                        {item.cwsu && (
                            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                                {item.cwsu}
                            </span>
                        )}
                        <span className="text-sm break-all whitespace-pre-wrap">{pickRawText(item)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetMis;
