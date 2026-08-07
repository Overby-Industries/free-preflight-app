import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const icao = request.nextUrl.searchParams.get('ids')?.trim().toUpperCase();

    if (!icao) {
        return NextResponse.json({ error: 'Missing "ids" (ICAO code) query param.' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(icao)}&format=json&taf=true&hours=1`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: `Weather service returned ${response.status}.` },
                { status: 502 }
            );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ error: `No METAR found for "${icao}".` }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Failed to reach the weather service.' }, { status: 502 });
    }
}
