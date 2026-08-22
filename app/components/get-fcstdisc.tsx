'use client';

import React, { useState } from 'react';

const GetFcstDisc = () => {
    const [cwa, setCwa] = useState('');
    const [type, setType] = useState('afd');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFcstDisc = async (selectedCwa: string, selectedType: string) => {
        if (!selectedCwa.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ cwa: selectedCwa.trim(), type: selectedType });
            const response = await fetch(`/api/fcstdisc?${params.toString()}`);
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
                <select
                    className="field w-full sm:w-auto"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="afd">Forecast discussion</option>
                    <option value="af">Area forecast</option>
                </select>
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchFcstDisc(cwa, type)}
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
