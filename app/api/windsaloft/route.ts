import { NextRequest, NextResponse } from 'next/server';

const VALID_LEVELS = ['low', 'high'];

export async function GET(request: NextRequest) {
    const levelParam = request.nextUrl.searchParams.get('level');
    const level = VALID_LEVELS.includes(levelParam ?? '') ? levelParam : 'low';

    try {
        const response = await fetch(
            `https://aviationweather.gov/api/data/windtemp?region=us&level=${level}`,
            { cache: 'no-store' }
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
