import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const cwa = request.nextUrl.searchParams.get('cwa')?.trim().toUpperCase();

    if (!cwa) {
        return NextResponse.json({ error: 'Missing "cwa" (CWSU identifier) query param.' }, { status: 400 });
    }

    const params = new URLSearchParams({ cwa, type: 'afd' });

    try {
        const response = await fetch(`https://aviationweather.gov/api/data/fcstdisc?${params.toString()}`, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
                Accept: 'text/plain, application/json',
            },
        });

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
