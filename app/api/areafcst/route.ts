import { NextRequest, NextResponse } from 'next/server';

const VALID_REGIONS = [
    'aknorth',
    'akcentral',
    'akaleutian',
    'aksouth',
    'aksouthwest',
    'aksoutheast',
    'akpanhandle',
];

export async function GET(request: NextRequest) {
    const region = request.nextUrl.searchParams.get('region');

    if (!region || !VALID_REGIONS.includes(region)) {
        return NextResponse.json(
            { error: `"region" must be one of: ${VALID_REGIONS.join(', ')}.` },
            { status: 400 }
        );
    }

    try {
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
