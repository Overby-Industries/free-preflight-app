import { NextRequest, NextResponse } from 'next/server';
import { radiusToBbox } from '@/app/lib/bbox';

export async function GET(request: NextRequest) {
    const lat = Number(request.nextUrl.searchParams.get('lat'));
    const lon = Number(request.nextUrl.searchParams.get('lon'));
    const radiusParam = request.nextUrl.searchParams.get('radius');

    // bbox is optional for this endpoint — omitting it returns the
    // nationwide feature set instead of one scoped around a point.
    const params = new URLSearchParams({ format: 'geojson' });
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
        const radius = Math.min(Math.max(Number(radiusParam) || 10, 1), 50);
        params.set('bbox', radiusToBbox(lat, lon, radius));
    }

    try {
        const response = await fetch(`https://aviationweather.gov/api/data/feature?${params.toString()}`, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
                Accept: 'application/geo+json, application/json',
            },
        });

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
