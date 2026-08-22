'use client';

import React, { useEffect, useState } from 'react';

const REGIONS = [
    { value: 'aknorth', label: 'Alaska - North' },
    { value: 'akcentral', label: 'Alaska - Central' },
    { value: 'akaleutian', label: 'Alaska - Aleutians' },
    { value: 'aksouth', label: 'Alaska - South' },
    { value: 'aksouthwest', label: 'Alaska - Southwest' },
    { value: 'aksoutheast', label: 'Alaska - Southeast' },
    { value: 'akpanhandle', label: 'Alaska - Panhandle' },
];

const GetAreaFcst = () => {
    const [region, setRegion] = useState('aknorth');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAreaFcst = async (selectedRegion: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/areafcst?region=${encodeURIComponent(selectedRegion)}`);
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
                US area forecasts are issued only for Alaska (the CONUS area forecast was discontinued).
            </p>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <select
                    className="field flex-1 min-w-0"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    {REGIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                            {r.label}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchAreaFcst(region)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
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
