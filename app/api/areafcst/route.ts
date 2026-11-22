import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const region = request.nextUrl.searchParams.get('region')?.trim().toLowerCase();

    if (!region) {
        return NextResponse.json({ error: 'Missing "region" query param.' }, { status: 400 });
    }

    try {
        // Region codes for this endpoint aren't reliably confirmed (sources
        // disagree — some show 7 Alaska sub-regions, others show a single
        // "alaska"/"hawaii" value) — pass whatever the caller provides
        // straight through and let the upstream response be the source of
        // truth instead of rejecting values our own guess might have missed.
        const response = await fetch(
            `https://aviationweather.gov/api/data/areafcst?region=${encodeURIComponent(region)}`,
            {
                cache: 'no-store',
                headers: {
                    'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
                    Accept: 'text/plain, application/json',
                },
            }
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
