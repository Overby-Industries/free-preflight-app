'use client';

import React, { useEffect, useState } from 'react';

type AlertFeature = {
    id: string;
    properties: {
        event?: string;
        headline?: string;
        severity?: string;
        areaDesc?: string;
        description?: string;
        expires?: string;
    };
};

const SEVERITY_STYLES: Record<string, string> = {
    Extreme: 'border-fuchsia-600 text-fuchsia-500',
    Severe: 'border-red-600 text-red-500',
    Moderate: 'border-yellow-600 text-yellow-500',
    Minor: 'border-blue-600 text-blue-500',
};

const GetAlerts = () => {
    const [area, setArea] = useState('MO');
    const [alerts, setAlerts] = useState<AlertFeature[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = async (code: string) => {
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/alerts?area=${encodeURIComponent(code.trim())}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? 'Failed to fetch active alerts.');
            }
            setAlerts(Array.isArray(data.features) ? data.features : []);
        } catch (err) {
            setAlerts([]);
            setError(err instanceof Error ? err.message : 'Failed to fetch active alerts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts(area);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-fit w-full py-4">
            <span className="eyebrow">NWS Active Alerts</span>
            <div className="flex flex-row h-fit w-full items-center gap-2 pb-3">
                <input
                    className="field flex-1 min-w-0"
                    value={area}
                    onChange={(e) => setArea(e.target.value.toUpperCase())}
                    maxLength={2}
                    placeholder="State e.g. MO"
                />
                <button
                    type="button"
                    className="btn"
                    onClick={() => fetchAlerts(area)}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>
            {error && <p className="text-[var(--color-warn)] text-sm pb-2">{error}</p>}
            <div className="panel flex flex-col gap-3 text-[var(--color-text)] max-h-64 overflow-y-auto">
                {alerts.length === 0 && !loading && !error && (
                    <span className="text-sm opacity-70">No active alerts for this state.</span>
                )}
                {alerts.map((alert) => (
                    <div key={alert.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-sans text-xs font-bold uppercase tracking-widest">
                                {alert.properties.event ?? 'Alert'}
                            </span>
                            {alert.properties.severity && (
                                <span
                                    className={`border px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                        SEVERITY_STYLES[alert.properties.severity] ?? 'border-gray-500 text-gray-400'
                                    }`}
                                >
                                    {alert.properties.severity}
                                </span>
                            )}
                        </div>
                        {alert.properties.areaDesc && (
                            <span className="text-sm text-[var(--color-text-accent)]">
                                {alert.properties.areaDesc}
                            </span>
                        )}
                        <span className="text-sm break-words whitespace-pre-wrap">
                            {alert.properties.headline ?? alert.properties.description ?? ''}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetAlerts;
