'use client';

import React, { useEffect, useState } from 'react';

// Sources disagree on the exact valid region codes for this endpoint, so
// this is a free-text field rather than a locked-down dropdown — these are
// just quick-pick suggestions, not a validated list.
const SUGGESTIONS = [
    'alaska',
    'hawaii',
    'aknorth',
    'akcentral',
    'akaleutian',
    'aksouth',
    'aksouthwest',
    'aksoutheast',
    'akpanhandle',
];

const GetAreaFcst = () => {
    const [region, setRegion] = useState('alaska');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAreaFcst = async (selectedRegion: string) => {
        if (!selectedRegion.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/areafcst?region=${encodeURIComponent(selectedRegion.trim())}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch the area forecast.');
            }
            setText(data.text);
        } catch (err) {
            setText('');
            setError(err instanceof Error ? err.message : 'Failed to fetch the area forecast.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreaFcst(region);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Area Forecast</span>
            <p className="text-xs opacity-60 pb-2">
                US area forecasts are issued only outside the contiguous states (Alaska, Hawaii, etc).
            </p>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-2">
                <input
                    className="field flex-1 min-w-0"
                    value={region}
                    onChange={(e) => setRegion(e.target.value.toLowerCase())}
                    placeholder="Region e.g. alaska"
                />
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchAreaFcst(region)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>
            <div className="flex flex-wrap gap-1 pb-3">
                {SUGGESTIONS.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => {
                            setRegion(s);
                            fetchAreaFcst(s);
                        }}
                        className="font-mono text-[10px] uppercase px-1.5 py-0.5 border border-[var(--color-rule)] text-[var(--color-text-accent)] hover:border-[var(--color-accent)]"
                    >
                        {s}
                    </button>
                ))}
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <textarea
                className="field w-full text-[var(--color-text-accent)] text-xs"
                name="areaFcstData"
                value={text || (loading ? 'Loading...' : 'No data.')}
                readOnly
                rows={10}
            />
        </div>
    );
};

export default GetAreaFcst;
