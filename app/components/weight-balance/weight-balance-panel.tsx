'use client';

import React, { useState } from 'react';
import { useAircraftProfiles } from './use-aircraft-profiles';
import { AircraftProfile, createBlankProfile } from './wb-types';
import AircraftForm from './aircraft-form';
import WBCalculator from './wb-calculator';

const WeightBalancePanel = () => {
    const {
        profiles,
        selectedProfile,
        selectedId,
        setSelectedId,
        addProfile,
        updateProfile,
        deleteProfile,
    } = useAircraftProfiles();
    const [editing, setEditing] = useState<AircraftProfile | null>(null);

    return (
        <div className="flex flex-col gap-4 w-full py-4">
            <span className="eyebrow">Weight &amp; Balance</span>

            <div className="panel border-l-4 border-l-[var(--color-warn)] text-sm">
                <strong>Reference only.</strong> Always use your aircraft&apos;s actual current
                weighed empty weight and CG from its POH and weight &amp; balance record — never
                placeholder or example data — for real flight planning.
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <select
                    className="field w-full sm:w-auto sm:flex-1 sm:max-w-xs"
                    value={selectedId ?? ''}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    {profiles.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name || 'Untitled aircraft'}
                        </option>
                    ))}
                </select>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="btn"
                        onClick={() => setEditing(createBlankProfile())}
                    >
                        + Add aircraft
                    </button>
                    {selectedProfile && (
                        <>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setEditing(selectedProfile)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn"
                                style={{ color: 'var(--color-warn)', borderColor: 'var(--color-warn)' }}
                                onClick={() => deleteProfile(selectedProfile.id)}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {editing && (
                <AircraftForm
                    initial={editing}
                    onCancel={() => setEditing(null)}
                    onSave={(profile) => {
                        if (profiles.some((p) => p.id === profile.id)) {
                            updateProfile(profile);
                        } else {
                            addProfile(profile);
                        }
                        setEditing(null);
                    }}
                />
            )}

            {selectedProfile && !editing && <WBCalculator profile={selectedProfile} />}

            {!selectedProfile && !editing && (
                <p className="text-sm opacity-70">
                    No aircraft yet — add one to start calculating weight and balance.
                </p>
            )}
        </div>
    );
};

export default WeightBalancePanel;
