'use client';

import { useEffect, useState } from 'react';
import { AircraftProfile, createExampleProfile } from './wb-types';

const STORAGE_KEY = 'freeflight-aircraft';

export const useAircraftProfiles = () => {
    const [profiles, setProfiles] = useState<AircraftProfile[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let initial: AircraftProfile[];
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            initial = stored ? JSON.parse(stored) : [createExampleProfile()];
        } catch {
            initial = [createExampleProfile()];
        }
        setProfiles(initial);
        setSelectedId(initial[0]?.id ?? null);
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }, [profiles, loaded]);

    const addProfile = (profile: AircraftProfile) => {
        setProfiles((prev) => [...prev, profile]);
        setSelectedId(profile.id);
    };

    const updateProfile = (profile: AircraftProfile) => {
        setProfiles((prev) => prev.map((p) => (p.id === profile.id ? profile : p)));
    };

    const deleteProfile = (id: string) => {
        setProfiles((prev) => {
            const next = prev.filter((p) => p.id !== id);
            setSelectedId(next[0]?.id ?? null);
            return next;
        });
    };

    const selectedProfile = profiles.find((p) => p.id === selectedId) ?? null;

    return {
        profiles,
        selectedProfile,
        selectedId,
        setSelectedId,
        addProfile,
        updateProfile,
        deleteProfile,
    };
};
