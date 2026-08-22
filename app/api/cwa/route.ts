import { NextRequest, NextResponse } from 'next/server';

const VALID_HAZARDS = ['ts', 'turb', 'ice', 'ifr', 'pcpn', 'unk'];

export async function GET(request: NextRequest) {
    const hazard = request.nextUrl.searchParams.get('hazard');
    const params = new URLSearchParams({ format: 'json' });
    if (hazard && VALID_HAZARDS.includes(hazard)) {
        params.set('hazard', hazard);
    }

    try {
        const response = await fetch(`https://aviationweather.gov/api/data/cwa?${params.toString()}`, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
                Accept: 'application/json',
            },
        });

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
