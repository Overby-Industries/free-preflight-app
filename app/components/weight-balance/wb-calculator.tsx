'use client';

import React, { useState } from 'react';
import { AircraftProfile, calculateWB } from './wb-types';
import WBEnvelopeChart from './wb-envelope-chart';

type WBCalculatorProps = {
    profile: AircraftProfile;
};

const WBCalculator = ({ profile }: WBCalculatorProps) => {
    const [stationWeights, setStationWeights] = useState<Record<string, number>>({});

    const result = calculateWB(profile, stationWeights);
    const isSafe = result.withinMaxGross && result.withinEnvelope;

    return (
        <div className="flex flex-col gap-4 bg-[var(--color-panel)] rounded-md p-4">
            <div className="flex flex-col gap-2">
                {profile.stations.map((station) => (
                    <label key={station.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm">
                            {station.name} <span className="opacity-60">(arm {station.arm} in)</span>
                        </span>
                        <input
                            type="number"
                            className="bg-[var(--color-bg)] text-[var(--color-text)] rounded-md p-2 w-28"
                            value={stationWeights[station.id] ?? ''}
                            onChange={(e) =>
                                setStationWeights((prev) => ({
                                    ...prev,
                                    [station.id]: Number(e.target.value),
                                }))
                            }
                            placeholder="lb"
                        />
                    </label>
                ))}
            </div>

            <div className="flex flex-col gap-1 text-sm">
                <span>Total weight: {result.totalWeight.toFixed(1)} lb (max {profile.maxGrossWeight} lb)</span>
                <span>CG: {result.cg.toFixed(2)} in</span>
                <span className={isSafe ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                    {isSafe
                        ? 'Within weight and CG envelope'
                        : !result.withinMaxGross
                          ? 'Over max gross weight'
                          : 'CG outside envelope'}
                </span>
            </div>

            <WBEnvelopeChart
                envelope={profile.envelope}
                point={{ cg: result.cg, weight: result.totalWeight }}
                withinEnvelope={isSafe}
            />
        </div>
    );
};

export default WBCalculator;
