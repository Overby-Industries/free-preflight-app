'use client';

import React, { useState } from 'react';
import { AircraftProfile, WBStation, EnvelopePoint, createId } from './wb-types';

type AircraftFormProps = {
    initial: AircraftProfile;
    onSave: (profile: AircraftProfile) => void;
    onCancel: () => void;
};

const inputClass = 'field w-full';
const labelClass = 'text-sm opacity-80';

const AircraftForm = ({ initial, onSave, onCancel }: AircraftFormProps) => {
    const [profile, setProfile] = useState<AircraftProfile>(initial);

    const updateStation = (id: string, patch: Partial<WBStation>) => {
        setProfile((p) => ({
            ...p,
            stations: p.stations.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }));
    };

    const addStation = () => {
        setProfile((p) => ({
            ...p,
            stations: [...p.stations, { id: createId(), name: '', arm: 0 }],
        }));
    };

    const removeStation = (id: string) => {
        setProfile((p) => ({ ...p, stations: p.stations.filter((s) => s.id !== id) }));
    };

    const updateEnvelopePoint = (index: number, patch: Partial<EnvelopePoint>) => {
        setProfile((p) => ({
            ...p,
            envelope: p.envelope.map((pt, i) => (i === index ? { ...pt, ...patch } : pt)),
        }));
    };

    const addEnvelopePoint = () => {
        setProfile((p) => ({ ...p, envelope: [...p.envelope, { weight: 0, cg: 0 }] }));
    };

    const removeEnvelopePoint = (index: number) => {
        setProfile((p) => ({ ...p, envelope: p.envelope.filter((_, i) => i !== index) }));
    };

    return (
        <form
            className="panel flex flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                onSave(profile);
            }}
        >
            <div>
                <label className={labelClass}>Aircraft name</label>
                <input
                    className={inputClass}
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. N12345"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={labelClass}>Empty weight (lb)</label>
                    <input
                        className={inputClass}
                        type="number"
                        value={profile.emptyWeight}
                        onChange={(e) =>
                            setProfile((p) => ({ ...p, emptyWeight: Number(e.target.value) }))
                        }
                    />
                </div>
                <div>
                    <label className={labelClass}>Empty weight arm (in)</label>
                    <input
                        className={inputClass}
                        type="number"
                        value={profile.emptyWeightArm}
                        onChange={(e) =>
                            setProfile((p) => ({ ...p, emptyWeightArm: Number(e.target.value) }))
                        }
                    />
                </div>
                <div>
                    <label className={labelClass}>Max gross weight (lb)</label>
                    <input
                        className={inputClass}
                        type="number"
                        value={profile.maxGrossWeight}
                        onChange={(e) =>
                            setProfile((p) => ({ ...p, maxGrossWeight: Number(e.target.value) }))
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className={labelClass}>Loading stations</span>
                    <button
                        type="button"
                        onClick={addStation}
                        className="text-[var(--color-accent)] text-sm"
                    >
                        + Add station
                    </button>
                </div>
                {profile.stations.map((station) => (
                    <div key={station.id} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <input
                            className={inputClass}
                            value={station.name}
                            onChange={(e) => updateStation(station.id, { name: e.target.value })}
                            placeholder="Station name, e.g. Front Seats"
                        />
                        <input
                            className={`${inputClass} w-full sm:max-w-[140px]`}
                            type="number"
                            value={station.arm}
                            onChange={(e) =>
                                updateStation(station.id, { arm: Number(e.target.value) })
                            }
                            placeholder="Arm (in)"
                        />
                        <button
                            type="button"
                            onClick={() => removeStation(station.id)}
                            className="text-[var(--color-warn)] text-sm text-left sm:text-center py-1 sm:py-0"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className={labelClass}>
                        Envelope points (weight/CG pairs, in order around the envelope)
                    </span>
                    <button
                        type="button"
                        onClick={addEnvelopePoint}
                        className="text-[var(--color-accent)] text-sm"
                    >
                        + Add point
                    </button>
                </div>
                {profile.envelope.map((point, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <input
                            className={inputClass}
                            type="number"
                            value={point.weight}
                            onChange={(e) =>
                                updateEnvelopePoint(index, { weight: Number(e.target.value) })
                            }
                            placeholder="Weight (lb)"
                        />
                        <input
                            className={inputClass}
                            type="number"
                            value={point.cg}
                            onChange={(e) =>
                                updateEnvelopePoint(index, { cg: Number(e.target.value) })
                            }
                            placeholder="CG (in)"
                        />
                        <button
                            type="button"
                            onClick={() => removeEnvelopePoint(index)}
                            className="text-[var(--color-warn)] text-sm text-left sm:text-center py-1 sm:py-0"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Save aircraft
                </button>
            </div>
        </form>
    );
};

export default AircraftForm;
