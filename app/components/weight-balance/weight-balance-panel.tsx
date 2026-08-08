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
        <div className="flex flex-col gap-4 w-full">
            <div className="bg-[var(--color-panel)] border-l-4 border-red-500 rounded-md p-3 text-sm">
                <strong>Reference only.</strong> Always use your aircraft&apos;s actual current
                weighed empty weight and CG from its POH and weight &amp; balance record — never
                placeholder or example data — for real flight planning.
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <select
                    className="bg-[var(--color-panel)] text-[var(--color-text)] rounded-md p-2"
                    value={selectedId ?? ''}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    {profiles.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name || 'Untitled aircraft'}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className="bg-[var(--color-panel)] text-[var(--color-accent)] rounded-md p-2"
                    onClick={() => setEditing(createBlankProfile())}
                >
                    + Add aircraft
                </button>
                {selectedProfile && (
                    <>
                        <button
                            type="button"
                            className="bg-[var(--color-panel)] text-[var(--color-accent)] rounded-md p-2"
                            onClick={() => setEditing(selectedProfile)}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="bg-[var(--color-panel)] text-red-500 rounded-md p-2"
                            onClick={() => deleteProfile(selectedProfile.id)}
                        >
                            Delete
                        </button>
                    </>
                )}
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
