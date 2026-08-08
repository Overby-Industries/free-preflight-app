export type WBStation = {
    id: string;
    name: string;
    arm: number;
};

export type EnvelopePoint = {
    weight: number;
    cg: number;
};

export type AircraftProfile = {
    id: string;
    name: string;
    emptyWeight: number;
    emptyWeightArm: number;
    maxGrossWeight: number;
    stations: WBStation[];
    envelope: EnvelopePoint[];
};

export type WBResult = {
    totalWeight: number;
    totalMoment: number;
    cg: number;
    withinMaxGross: boolean;
    withinEnvelope: boolean;
};

const isInsideEnvelope = (cg: number, weight: number, envelope: EnvelopePoint[]): boolean => {
    if (envelope.length < 3) return false;
    let inside = false;
    for (let i = 0, j = envelope.length - 1; i < envelope.length; j = i++) {
        const xi = envelope[i].cg;
        const yi = envelope[i].weight;
        const xj = envelope[j].cg;
        const yj = envelope[j].weight;
        const intersect =
            yi > weight !== yj > weight &&
            cg < ((xj - xi) * (weight - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
};

export const calculateWB = (
    profile: AircraftProfile,
    stationWeights: Record<string, number>
): WBResult => {
    let totalWeight = profile.emptyWeight;
    let totalMoment = profile.emptyWeight * profile.emptyWeightArm;

    for (const station of profile.stations) {
        const weight = stationWeights[station.id] ?? 0;
        totalWeight += weight;
        totalMoment += weight * station.arm;
    }

    const cg = totalWeight > 0 ? totalMoment / totalWeight : 0;
    const withinMaxGross = totalWeight <= profile.maxGrossWeight;
    const withinEnvelope = isInsideEnvelope(cg, totalWeight, profile.envelope);

    return { totalWeight, totalMoment, cg, withinMaxGross, withinEnvelope };
};

export const createId = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createExampleProfile = (): AircraftProfile => ({
    id: 'example',
    name: 'Example Aircraft (replace with your own POH data)',
    emptyWeight: 1500,
    emptyWeightArm: 40,
    maxGrossWeight: 2400,
    stations: [
        { id: 'front-seats', name: 'Front Seats', arm: 37 },
        { id: 'rear-seats', name: 'Rear Seats', arm: 73 },
        { id: 'fuel', name: 'Fuel', arm: 48 },
        { id: 'baggage', name: 'Baggage', arm: 95 },
    ],
    envelope: [
        { weight: 1500, cg: 35 },
        { weight: 1500, cg: 47 },
        { weight: 2400, cg: 47 },
        { weight: 2400, cg: 40 },
    ],
});

export const createBlankProfile = (): AircraftProfile => ({
    id: createId(),
    name: '',
    emptyWeight: 0,
    emptyWeightArm: 0,
    maxGrossWeight: 0,
    stations: [],
    envelope: [],
});
