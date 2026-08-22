'use client';

import React, { useState } from 'react';

const GetFcstDisc = () => {
    const [cwa, setCwa] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFcstDisc = async (selectedCwa: string) => {
        if (!selectedCwa.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/fcstdisc?cwa=${encodeURIComponent(selectedCwa.trim())}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch the forecast discussion.');
            }
            setText(data.text);
        } catch (err) {
            setText('');
            setError(err instanceof Error ? err.message : 'Failed to fetch the forecast discussion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Area Forecast Discussion</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pb-3">
                <input
                    className="field w-full sm:w-auto sm:flex-1 sm:max-w-[140px]"
                    value={cwa}
                    onChange={(e) => setCwa(e.target.value.toUpperCase())}
                    maxLength={3}
                    placeholder="CWSU e.g. ZKC"
                />
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchFcstDisc(cwa)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <textarea
                className="field w-full text-[var(--color-text-accent)] text-xs"
                name="fcstDiscData"
                value={text || (loading ? 'Loading...' : 'Enter a CWSU identifier (e.g. ZKC, ZAB) and press Get.')}
                readOnly
                rows={10}
            />
        </div>
    );
};

export default GetFcstDisc;
