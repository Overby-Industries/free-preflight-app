'use client';

import React, { useEffect, useState } from 'react';

const GetPirep = () => {
    const [icao, setIcao] = useState('KJLN');
    const [pirepText, setPirepText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPirep = async (code: string) => {
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/pirep?id=${encodeURIComponent(code)}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch PIREP.');
            }
            setPirepText(data.text);
        } catch (err) {
            setPirepText('');
            setError(err instanceof Error ? err.message : 'Failed to fetch PIREP.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPirep(icao);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full">
            <label className="flex flex-row h-fit w-full items-center justify-between gap-2 py-4">
                PIREP:
                <input
                    className="flex-1 min-w-0 bg-[var(--color-panel)] text-[var(--color-text)] rounded-md p-2"
                    value={icao}
                    onChange={(e) => setIcao(e.target.value.toUpperCase())}
                    maxLength={4}
                    placeholder="ICAO e.g. KJLN"
                />
                <button
                    type="button"
                    className="text-[var(--color-accent)] items-center h-fit w-1/4 bg-[var(--color-panel)] rounded-md p-2 disabled:opacity-50"
                    onClick={() => fetchPirep(icao)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get PIREP'}
                </button>
            </label>
            {error && (
                <p className="text-red-500 text-sm pb-2">{error}</p>
            )}
            <textarea
                className="w-full bg-[var(--color-panel)] text-[var(--color-text-accent)] rounded-md p-2"
                name="pirepData"
                value={pirepText || (loading ? 'Loading...' : 'No PIREP data.')}
                readOnly
                rows={4}
                cols={40}
            />
        </div>
    );
}

export default GetPirep;
