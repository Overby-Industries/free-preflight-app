import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const lat = request.nextUrl.searchParams.get('lat');
    const lon = request.nextUrl.searchParams.get('lon');
    const radiusParam = request.nextUrl.searchParams.get('radius');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing "lat"/"lon" query params.' }, { status: 400 });
    }

    const radius = Math.min(Math.max(Number(radiusParam) || 10, 1), 50);

    try {
        const response = await fetch(
            `https://aviationweather.gov/api/data/obstacle?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&radius=${radius}&format=json`,
            {
                cache: 'no-store',
                headers: {
                    'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
                    Accept: 'application/json',
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
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to reach the weather service.' }, { status: 502 });
    }
}
