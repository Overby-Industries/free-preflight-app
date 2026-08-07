import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const icao = request.nextUrl.searchParams.get('id')?.trim().toUpperCase();

    if (!icao) {
        return NextResponse.json({ error: 'Missing "id" (ICAO code) query param.' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://aviationweather.gov/api/data/pirep?id=${encodeURIComponent(icao)}&format=raw&age=1&distance=500&level=3000&inten=lgt`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: `Weather service returned ${response.status}.` },
                { status: 502 }
            );
        }

        const text = await response.text();
        return NextResponse.json({ text });
    } catch {
        return NextResponse.json({ error: 'Failed to reach the weather service.' }, { status: 502 });
    }
}
