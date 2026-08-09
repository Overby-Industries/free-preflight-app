'use client';

import React from 'react';
import { EnvelopePoint } from './wb-types';

type WBEnvelopeChartProps = {
    envelope: EnvelopePoint[];
    point: { cg: number; weight: number };
    withinEnvelope: boolean;
};

const WIDTH = 320;
const HEIGHT = 220;
const PADDING = 32;

const WBEnvelopeChart = ({ envelope, point, withinEnvelope }: WBEnvelopeChartProps) => {
    if (envelope.length < 3) {
        return (
            <p className="text-sm opacity-70">
                Add at least 3 envelope points to this aircraft to see the CG chart.
            </p>
        );
    }

    const cgValues = [...envelope.map((p) => p.cg), point.cg];
    const weightValues = [...envelope.map((p) => p.weight), point.weight];
    const cgMin = Math.min(...cgValues);
    const cgMax = Math.max(...cgValues);
    const weightMin = Math.min(...weightValues);
    const weightMax = Math.max(...weightValues);

    const cgRange = cgMax - cgMin || 1;
    const weightRange = weightMax - weightMin || 1;

    const toX = (cg: number) => PADDING + ((cg - cgMin) / cgRange) * (WIDTH - PADDING * 2);
    const toY = (weight: number) =>
        HEIGHT - PADDING - ((weight - weightMin) / weightRange) * (HEIGHT - PADDING * 2);

    const polygonPoints = envelope.map((p) => `${toX(p.cg)},${toY(p.weight)}`).join(' ');

    return (
        <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full max-w-md bg-[var(--color-bg)] border border-[var(--color-rule)]"
        >
            <polygon
                points={polygonPoints}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={2}
            />
            <circle
                cx={toX(point.cg)}
                cy={toY(point.weight)}
                r={6}
                fill={withinEnvelope ? '#22c55e' : 'var(--color-warn)'}
                stroke="white"
                strokeWidth={1.5}
            />
            <text x={PADDING} y={HEIGHT - 8} fontSize={10} fill="var(--color-text)">
                CG {cgMin.toFixed(1)}–{cgMax.toFixed(1)} in
            </text>
            <text
                x={WIDTH - PADDING}
                y={14}
                fontSize={10}
                fill="var(--color-text)"
                textAnchor="end"
            >
                {weightMin.toFixed(0)}–{weightMax.toFixed(0)} lb
            </text>
        </svg>
    );
};

export default WBEnvelopeChart;
