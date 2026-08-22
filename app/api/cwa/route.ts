import { NextRequest, NextResponse } from 'next/server';

const VALID_HAZARDS = ['ts', 'turb', 'ice', 'ifr', 'pcpn', 'unk'];

export async function GET(request: NextRequest) {
    const hazard = request.nextUrl.searchParams.get('hazard');
    const params = new URLSearchParams();
    if (hazard && VALID_HAZARDS.includes(hazard)) {
        params.set('hazard', hazard);
    }

    try {
        const response = await fetch(`https://aviationweather.gov/api/data/cwa?${params.toString()}`, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
                Accept: 'application/json, text/plain',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Weather service returned ${response.status}.` },
                { status: 502 }
            );
        }

        // "format" was never confirmed to be a valid param for this endpoint
        // (unlike airport/navaid/fix, which document one) — parse
        // defensively instead of assuming the response is JSON.
        const raw = await response.text();
        try {
            const parsed = JSON.parse(raw);
            return NextResponse.json(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
            return NextResponse.json(raw.trim() ? [{ text: raw }] : []);
        }
    } catch {
        return NextResponse.json({ error: 'Failed to reach the weather service.' }, { status: 502 });
    }
}
