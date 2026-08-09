'use client';

import React, { useEffect, useState } from 'react';

const GetWindsAloft = () => {
    const [level, setLevel] = useState<'low' | 'high'>('low');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWindsAloft = async (selectedLevel: 'low' | 'high') => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/windsaloft?level=${selectedLevel}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch winds aloft.');
            }
            setText(data.text);
        } catch (err) {
            setText('');
            setError(err instanceof Error ? err.message : 'Failed to fetch winds aloft.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWindsAloft(level);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">Winds Aloft</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <select
                    className="field flex-1 min-w-0"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as 'low' | 'high')}
                >
                    <option value="low">Low altitude</option>
                    <option value="high">High altitude</option>
                </select>
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchWindsAloft(level)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <textarea
                className="field w-full text-[var(--color-text-accent)] text-xs"
                name="windsAloftData"
                value={text || (loading ? 'Loading...' : 'No data.')}
                readOnly
                rows={10}
            />
        </div>
    );
};

export default GetWindsAloft;
