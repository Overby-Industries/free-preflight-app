import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const lat = request.nextUrl.searchParams.get('lat');
    const lon = request.nextUrl.searchParams.get('lon');
    const area = request.nextUrl.searchParams.get('area')?.trim().toUpperCase();

    if (!area && (!lat || !lon)) {
        return NextResponse.json(
            { error: 'Provide either "area" (two-letter state code) or "lat"/"lon".' },
            { status: 400 }
        );
    }

    const params = new URLSearchParams();
    if (area) {
        params.set('area', area);
    } else if (lat && lon) {
        params.set('point', `${lat},${lon}`);
    }

    try {
        const response = await fetch(`https://api.weather.gov/alerts/active?${params.toString()}`, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
                Accept: 'application/geo+json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Alerts service returned ${response.status}.` },
                { status: 502 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to reach the alerts service.' }, { status: 502 });
    }
}
