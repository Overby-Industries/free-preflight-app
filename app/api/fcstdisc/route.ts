import { NextRequest, NextResponse } from 'next/server';

const fetchDiscussion = (params: URLSearchParams) =>
    fetch(`https://aviationweather.gov/api/data/fcstdisc?${params.toString()}`, {
        cache: 'no-store',
        headers: {
            'User-Agent': 'FreeFlight-EFB (+https://github.com/Overby-Industries/free-preflight-app)',
            Accept: 'text/plain, application/json',
        },
    });

export async function GET(request: NextRequest) {
    const cwa = request.nextUrl.searchParams.get('cwa')?.trim().toUpperCase();

    if (!cwa) {
        return NextResponse.json({ error: 'Missing "cwa" (CWSU identifier) query param.' }, { status: 400 });
    }

    try {
        // "type" was never confirmed to be a valid/required param for this
        // endpoint — try with it first, and if the request is rejected,
        // retry with just "cwa" in case "type" itself is what's wrong.
        let response = await fetchDiscussion(new URLSearchParams({ cwa, type: 'afd' }));
        if (!response.ok) {
            response = await fetchDiscussion(new URLSearchParams({ cwa }));
        }

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
