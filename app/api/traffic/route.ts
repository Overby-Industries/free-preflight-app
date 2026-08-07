import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const lat = request.nextUrl.searchParams.get('lat');
    const lon = request.nextUrl.searchParams.get('lon');
    const radiusParam = request.nextUrl.searchParams.get('radius');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Missing "lat"/"lon" query params.' }, { status: 400 });
    }

    const radius = Math.min(Math.max(Number(radiusParam) || 30, 1), 250);

    try {
        const response = await fetch(
            `https://api.adsb.lol/v2/point/${encodeURIComponent(lat)}/${encodeURIComponent(lon)}/${radius}`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: `Traffic service returned ${response.status}.` },
                { status: 502 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to reach the traffic service.' }, { status: 502 });
    }
}
