'use client';

import React, { useEffect, useState } from 'react';

type AirSigmet = {
    icaoId: string;
    hazard: string;
    rawAirSigmet: string;
    validTimeFrom: number;
    validTimeTo: number;
};

const HAZARDS = [
    { value: '', label: 'All hazards' },
    { value: 'conv', label: 'Convective' },
    { value: 'turb', label: 'Turbulence' },
    { value: 'ice', label: 'Icing' },
    { value: 'ifr', label: 'IFR' },
];

const GetAirSigmet = () => {
    const [hazard, setHazard] = useState('');
    const [items, setItems] = useState<AirSigmet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAirSigmet = async (selectedHazard: string) => {
        setLoading(true);
        setError(null);
        try {
            const query = selectedHazard ? `?hazard=${selectedHazard}` : '';
            const response = await fetch(`/api/airsigmet${query}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch AIRMET/SIGMET data.');
            }
            setItems(data);
        } catch (err) {
            setItems([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch AIRMET/SIGMET data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirSigmet(hazard);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full">
            <label className="flex flex-row h-fit w-full items-center justify-between gap-2 py-4">
                AIRMET / SIGMET:
                <select
                    className="flex-1 min-w-0 bg-[var(--color-panel)] text-[var(--color-text)] rounded-md p-2"
                    value={hazard}
                    onChange={(e) => setHazard(e.target.value)}
                >
                    {HAZARDS.map((h) => (
                        <option key={h.value} value={h.value}>
                            {h.label}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className="text-[var(--color-accent)] items-center h-fit w-1/4 bg-[var(--color-panel)] rounded-md p-2 disabled:opacity-50"
                    onClick={() => fetchAirSigmet(hazard)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </label>
            {error && <p className="text-red-500 text-sm pb-2">{error}</p>}
            <div className="flex flex-col gap-2 h-fit w-full bg-[var(--color-panel)] text-[var(--color-text-accent)] rounded-md p-2 max-h-64 overflow-y-auto">
                {items.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No active AIRMETs/SIGMETs for this filter.</span>
                )}
                {items.map((item, index) => (
                    <div key={`${item.icaoId}-${index}`} className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase opacity-80">{item.hazard}</span>
                        <span className="text-sm break-words whitespace-pre-wrap">{item.rawAirSigmet}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetAirSigmet;
