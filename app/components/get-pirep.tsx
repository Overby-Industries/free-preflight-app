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
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">PIREP</span>
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
                    onClick={() => fetchPirep(icao)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get PIREP'}
                </button>
            </div>
            {error && (
                <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>
            )}
            <textarea
                className="field w-full text-[var(--color-text-accent)]"
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
