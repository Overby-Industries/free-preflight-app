'use client';

import React from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Theme } from '@/app/context/theme-context';
import { fieldEntries, formatFieldValue } from './weather-text-utils';

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

const ICON_COLORS: Record<Theme, string> = {
    day: '#b8962e',
    night: '#e0554a',
};

const featureIcon = (color: string) =>
    L.divIcon({
        className: 'feature-icon',
        html: `<div style="width: 10px; height: 10px; background: ${color}; border: 1.5px solid white; border-radius: 50%;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    });

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const popupHtml = (properties: Record<string, unknown>) => {
    const rows = fieldEntries(properties)
        .map(
            ([key, value]) =>
                `<div style="display:flex;justify-content:space-between;gap:8px;"><span style="opacity:0.6">${escapeHtml(
                    key
                )}</span><span style="text-align:right;word-break:break-all;">${escapeHtml(
                    formatFieldValue(value)
                )}</span></div>`
        )
        .join('');
    return `<div style="display:flex;flex-direction:column;gap:4px;font-size:12px;">${rows}</div>`;
};

export type FeaturesGeoJson = FeatureCollection<Geometry, Record<string, unknown>>;

type FeaturesMapProps = {
    center: [number, number];
    theme: Theme;
    features: FeaturesGeoJson;
};

const FeaturesMap = ({ center, theme, features }: FeaturesMapProps) => {
    const tiles = TILE_LAYERS[theme];
    const color = ICON_COLORS[theme];

    return (
        <MapContainer center={center} zoom={11} style={{ height: '500px', width: '100%' }}>
            <TileLayer url={tiles.url} attribution={tiles.attribution} />
            <Marker position={center} icon={featureIcon('#2563eb')}>
                <Popup>Search center</Popup>
            </Marker>
            <GeoJSON
                key={JSON.stringify(features)}
                data={features}
                pointToLayer={(_feature, latlng) => L.marker(latlng, { icon: featureIcon(color) })}
                onEachFeature={(feature, layer) => {
                    if (feature.properties) {
                        layer.bindPopup(popupHtml(feature.properties));
                    }
                }}
            />
        </MapContainer>
    );
};

export default FeaturesMap;
