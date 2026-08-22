'use client';

import React from 'react';
import { MapContainer, TileLayer, WMSTileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry } from 'geojson';
import type { Theme } from '@/app/context/theme-context';

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

// Iowa Environmental Mesonet CONUS composite reflectivity mosaic — public XYZ
// tiles, no key required.
const RADAR_TILE_URL = 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png';

// NOAA nowCOAST GOES-East/West + global mosaic composite imagery (GeoColor-
// style). The exact WMS sublayer name/index isn't verifiable from this
// environment (GetCapabilities is blocked here) — "0" is nowCOAST's usual
// default/top sublayer for this service. If satellite tiles come back
// blank, this is the first thing to check against the service's
// GetCapabilities response.
const SATELLITE_WMS_URL = 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_time/MapServer/WMSServer';
const SATELLITE_WMS_LAYER = '0';

const ALERT_SEVERITY_COLOR: Record<string, string> = {
    Extreme: '#a21caf',
    Severe: '#dc2626',
    Moderate: '#ca8a04',
    Minor: '#2563eb',
};

export type AlertsGeoJson = FeatureCollection<
    Geometry,
    { event?: string; severity?: string; headline?: string }
>;

type RadarSatelliteMapProps = {
    center: [number, number];
    zoom: number;
    theme: Theme;
    showRadar: boolean;
    showSatellite: boolean;
    showAlerts: boolean;
    radarOpacity: number;
    satelliteOpacity: number;
    alerts: AlertsGeoJson | null;
};

const RadarSatelliteMap = ({
    center,
    zoom,
    theme,
    showRadar,
    showSatellite,
    showAlerts,
    radarOpacity,
    satelliteOpacity,
    alerts,
}: RadarSatelliteMapProps) => {
    const tiles = TILE_LAYERS[theme];

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
            <TileLayer url={tiles.url} attribution={tiles.attribution} />
            {showSatellite && (
                <WMSTileLayer
                    url={SATELLITE_WMS_URL}
                    params={{
                        layers: SATELLITE_WMS_LAYER,
                        format: 'image/png',
                        transparent: true,
                    }}
                    opacity={satelliteOpacity}
                    attribution="NOAA/NESDIS/nowCOAST"
                />
            )}
            {showRadar && (
                <TileLayer
                    url={RADAR_TILE_URL}
                    opacity={radarOpacity}
                    attribution="NEXRAD &copy; Iowa Environmental Mesonet"
                />
            )}
            {showAlerts && alerts && (
                <GeoJSON
                    data={alerts}
                    style={(feature) => ({
                        color: ALERT_SEVERITY_COLOR[feature?.properties?.severity ?? ''] ?? '#e0554a',
                        weight: 1.5,
                        fillOpacity: 0.15,
                    })}
                />
            )}
        </MapContainer>
    );
};

export default RadarSatelliteMap;
