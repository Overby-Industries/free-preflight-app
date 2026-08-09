'use client';

import React, { useEffect, useState } from 'react';

type MetarReport = {
    icaoId: string;
    obsTime: number;
    name: string;
    rawOb: string;
    rawTaf?: string;
    fltCat?: string;
    lat?: number;
    lon?: number;
};

const flightCategoryStyles: Record<string, string> = {
    VFR: 'border-green-600 text-green-500',
    MVFR: 'border-blue-600 text-blue-500',
    IFR: 'border-red-600 text-red-500',
    LIFR: 'border-fuchsia-600 text-fuchsia-500',
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
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">METAR &amp; TAF</span>
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
                    onClick={() => fetchMetar(icao)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get METAR'}
                </button>
            </div>
            {error && (
                <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>
            )}
            <div className="panel flex flex-col gap-3 text-[var(--color-text)]">
                {reports.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No METAR data.</span>
                )}
                {reports.map((item) => (
                    <div key={`${item.icaoId}-${item.obsTime}`} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-sans text-xs font-bold uppercase tracking-widest">
                                {item.name ?? item.icaoId}
                            </span>
                            {item.fltCat && (
                                <span
                                    className={`border px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                        flightCategoryStyles[item.fltCat] ?? 'border-gray-500 text-gray-400'
                                    }`}
                                >
                                    {item.fltCat}
                                </span>
                            )}
                        </div>
                        <span className="text-sm break-words">{item.rawOb}</span>
                        {item.rawTaf && (
                            <span className="text-sm break-words text-[var(--color-text-accent)]">{item.rawTaf}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GetMetar;
