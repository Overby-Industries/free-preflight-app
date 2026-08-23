'use client';

import React, { useState } from 'react';
import { fieldEntries, formatFieldValue } from './weather-text-utils';

const GetFix = () => {
    const [ident, setIdent] = useState('');
    const [items, setItems] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFix = async (code: string) => {
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/fix?ids=${encodeURIComponent(code)}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch fix info.');
            }
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setItems([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch fix info.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Fix</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <input
                    className="field flex-1 min-w-0"
                    value={ident}
                    onChange={(e) => setIdent(e.target.value.toUpperCase())}
                    maxLength={5}
                    placeholder="Fix ident e.g. BILEE"
                />
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchFix(ident)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Look Up'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <div className="panel flex flex-col gap-3 text-[var(--color-text)]">
                {items.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No fix info.</span>
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

export default GetFix;
