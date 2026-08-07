'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Theme } from '@/app/context/theme-context';

export type AdsbAircraft = {
    hex: string;
    flight?: string;
    r?: string;
    t?: string;
    lat?: number;
    lon?: number;
    alt_baro?: number | 'ground';
    gs?: number;
    track?: number;
};

const TILE_LAYERS: Record<Theme, { url: string; attribution: string }> = {
    day: {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    night: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
};

const planeIcon = (track: number) =>
    L.divIcon({
        className: 'traffic-plane-icon',
        html: `<div style="transform: rotate(${track}deg); width: 18px; height: 18px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#f87171" stroke="#111827" stroke-width="1">
                <path d="M12 2L4 15l8-3.5L20 15z" />
            </svg>
        </div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    });

const airportIcon = L.divIcon({
    className: 'traffic-airport-icon',
    html: `<div style="width: 12px; height: 12px; border-radius: 9999px; background: #2563eb; border: 2px solid white;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

const RecenterMap = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
};

type TrafficMapProps = {
    center: [number, number];
    aircraft: AdsbAircraft[];
    theme: Theme;
};

const TrafficMap = ({ center, aircraft, theme }: TrafficMapProps) => {
    const tiles = TILE_LAYERS[theme];

    return (
        <MapContainer center={center} zoom={9} style={{ height: '500px', width: '100%' }}>
            <RecenterMap center={center} />
            <TileLayer url={tiles.url} attribution={tiles.attribution} />
            <Marker position={center} icon={airportIcon}>
                <Popup>Airport</Popup>
            </Marker>
            {aircraft
                .filter((ac) => typeof ac.lat === 'number' && typeof ac.lon === 'number')
                .map((ac) => (
                    <Marker
                        key={ac.hex}
                        position={[ac.lat as number, ac.lon as number]}
                        icon={planeIcon(ac.track ?? 0)}
                    >
                        <Popup>
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    {ac.flight?.trim() || ac.r || ac.hex}
                                </span>
                                {ac.t && <span>Type: {ac.t}</span>}
                                <span>
                                    Altitude:{' '}
                                    {ac.alt_baro === 'ground' ? 'On ground' : `${ac.alt_baro ?? '—'} ft`}
                                </span>
                                <span>Speed: {ac.gs ?? '—'} kt</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
};

export default TrafficMap;
