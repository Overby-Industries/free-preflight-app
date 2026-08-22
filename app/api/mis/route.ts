import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://aviationweather.gov/api/data/mis', {
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

        // Not confirmed whether this endpoint honors a "format" query param
        // the way others do, so parse defensively instead of assuming JSON.
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
