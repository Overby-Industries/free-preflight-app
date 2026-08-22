'use client';

import React, { useEffect, useState } from 'react';

const GetFcstDisc = () => {
    const [region, setRegion] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFcstDisc = async (selectedRegion: string) => {
        setLoading(true);
        setError(null);
        try {
            const query = selectedRegion.trim() ? `?region=${encodeURIComponent(selectedRegion.trim())}` : '';
            const response = await fetch(`/api/fcstdisc${query}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch the area forecast discussion.');
            }
            setText(data.text);
        } catch (err) {
            setText('');
            setError(err instanceof Error ? err.message : 'Failed to fetch the area forecast discussion.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFcstDisc(region);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Area Forecast Discussion</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <select
                    className="field flex-1 min-w-0"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    <option value="">All regions</option>
                    <option value="ak">Alaska</option>
                    <option value="hi">Hawaii</option>
                    <option value="gulf">Gulf of Mexico</option>
                </select>
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchFcstDisc(region)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <textarea
                className="field w-full text-[var(--color-text-accent)] text-xs"
                name="fcstDiscData"
                value={text || (loading ? 'Loading...' : 'No data.')}
                readOnly
                rows={10}
            />
        </div>
    );
};

export default GetFcstDisc;
