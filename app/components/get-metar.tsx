'use client';

import React, { useEffect, useState } from 'react';

type MetarReport = {
    metar_id: number;
    icaoId: string;
    name: string;
    rawOb: string;
    rawTaf?: string;
    fltcat?: string;
};

const flightCategoryStyles: Record<string, string> = {
    VFR: 'bg-green-600 text-white',
    MVFR: 'bg-blue-600 text-white',
    IFR: 'bg-red-600 text-white',
    LIFR: 'bg-fuchsia-600 text-white',
};

const GetMetar = () => {
    const [icao, setIcao] = useState('KJLN');
    const [reports, setReports] = useState<MetarReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMetar = async (code: string) => {
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/metar?ids=${encodeURIComponent(code)}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch METAR.');
            }
            setReports(data);
        } catch (err) {
            setReports([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch METAR.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetar(icao);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full">
            <label className="flex flex-row h-fit w-full items-center justify-between gap-2 py-4">
                METAR:
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
                    onClick={() => fetchMetar(icao)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get METAR'}
                </button>
            </label>
            {error && (
                <p className="text-red-500 text-sm pb-2">{error}</p>
            )}
            <div className="flex flex-col gap-2 h-fit w-full bg-[var(--color-panel)] text-[var(--color-text-accent)] rounded-md p-2">
                {reports.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No METAR data.</span>
                )}
                {reports.map((item) => (
                    <div key={item.metar_id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.name ?? item.icaoId}</span>
                            {item.fltcat && (
                                <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                                        flightCategoryStyles[item.fltcat] ?? 'bg-gray-500 text-white'
                                    }`}
                                >
                                    {item.fltcat}
                                </span>
                            )}
                        </div>
                        <span className="text-sm break-words">{item.rawOb}</span>
                        {item.rawTaf && (
                            <span className="text-sm break-words opacity-90">{item.rawTaf}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GetMetar;
