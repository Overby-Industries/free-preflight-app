import { NextRequest, NextResponse } from 'next/server';
import { radiusToBbox } from '@/app/lib/bbox';

// Contiguous US, roughly — used when no specific point is given. The
// endpoint's bbox param is schema-optional, but omitting it entirely
// returned zero results in practice (confirmed live), while a real bbox
// against this same API family (obstacle) reliably returns data — so
// "nationwide" is implemented as "a large box" rather than "no box".
const CONUS_BBOX = '24,-125,50,-66';

export async function GET(request: NextRequest) {
    const lat = Number(request.nextUrl.searchParams.get('lat'));
    const lon = Number(request.nextUrl.searchParams.get('lon'));
    const radiusParam = request.nextUrl.searchParams.get('radius');

    const bbox =
        Number.isFinite(lat) && Number.isFinite(lon)
            ? radiusToBbox(lat, lon, Math.min(Math.max(Number(radiusParam) || 10, 1), 50))
            : CONUS_BBOX;

    try {
        const response = await fetch(
            `https://aviationweather.gov/api/data/feature?bbox=${encodeURIComponent(bbox)}&format=geojson`,
            {
                cache: 'no-store',
                headers: {
                    'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
                    Accept: 'application/geo+json, application/json',
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: `Weather service returned ${response.status}.` },
                { status: 502 }
            );
        }

        const data = await response.json();
        // Normalize to a standard FeatureCollection regardless of whether
        // the response is already one or a bare array of Features.
        const geojson = Array.isArray(data) ? { type: 'FeatureCollection', features: data } : data;
        return NextResponse.json(geojson);
    } catch {
        return NextResponse.json({ error: 'Failed to reach the weather service.' }, { status: 502 });
    }
}
