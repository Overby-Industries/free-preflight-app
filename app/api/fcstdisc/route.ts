import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const region = request.nextUrl.searchParams.get('region')?.trim().toLowerCase();
    const params = new URLSearchParams({ format: 'raw' });
    if (region) {
        params.set('region', region);
    }

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
