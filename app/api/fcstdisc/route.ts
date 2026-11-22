import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const rawCwa = request.nextUrl.searchParams.get('cwa')?.trim().toLowerCase();
    // The endpoint's only documented example uses the 4-character,
    // K-prefixed station form ("keax", not the bare 3-letter WFO id "eax") —
    // normalize so either form entered by the user works.
    const cwa = rawCwa && rawCwa.length === 3 ? `k${rawCwa}` : rawCwa;
    const params = new URLSearchParams({ type: 'afd' });
    if (cwa) {
        params.set('cwa', cwa);
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
