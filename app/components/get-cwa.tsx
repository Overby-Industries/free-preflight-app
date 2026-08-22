'use client';

import React, { useEffect, useState } from 'react';
import { pickRawText } from './weather-text-utils';

type CwaItem = Record<string, unknown> & {
    cwsu?: string;
    id?: string;
};

const GetCwa = () => {
    const [cwsu, setCwsu] = useState('');
    const [items, setItems] = useState<CwaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCwa = async (filter: string) => {
        setLoading(true);
        setError(null);
        try {
            const query = filter.trim() ? `?cwsu=${encodeURIComponent(filter.trim())}` : '';
            const response = await fetch(`/api/cwa${query}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch Center Weather Advisories.');
            }
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setItems([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch Center Weather Advisories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCwa(cwsu);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Center Weather Advisories</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <input
                    className="field flex-1 min-w-0"
                    value={cwsu}
                    onChange={(e) => setCwsu(e.target.value.toUpperCase())}
                    maxLength={3}
                    placeholder="CWSU e.g. ZKC (optional)"
                />
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchCwa(cwsu)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <div className="panel flex flex-col gap-3 text-[var(--color-text)] max-h-64 overflow-y-auto">
                {items.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No active Center Weather Advisories.</span>
                )}
                {items.map((item, index) => (
                    <div key={`${item.id ?? index}`} className="flex flex-col gap-1">
                        {item.cwsu && (
                            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                                {item.cwsu}
                            </span>
                        )}
                        <span className="text-sm break-words whitespace-pre-wrap">{pickRawText(item)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetCwa;
