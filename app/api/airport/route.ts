import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const ids = request.nextUrl.searchParams.get('ids')?.trim().toUpperCase();

    if (!ids) {
        return NextResponse.json({ error: 'Missing "ids" (ICAO code) query param.' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://aviationweather.gov/api/data/airport?ids=${encodeURIComponent(ids)}&format=json`,
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

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ error: `No airport/station info found for "${ids}".` }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to reach the weather service.' }, { status: 502 });
    }
}
