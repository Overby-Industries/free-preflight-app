import { NextRequest, NextResponse } from 'next/server';

const VALID_HAZARDS = ['conv', 'turb', 'ice', 'ifr'];

export async function GET(request: NextRequest) {
    const hazard = request.nextUrl.searchParams.get('hazard');
    const params = new URLSearchParams({ format: 'json' });
    if (hazard && VALID_HAZARDS.includes(hazard)) {
        params.set('hazard', hazard);
    }

    try {
        const response = await fetch(
            `https://aviationweather.gov/api/data/airsigmet?${params.toString()}`,
            { cache: 'no-store' }
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
