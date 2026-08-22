import React from 'react';
import Link from 'next/link';
import { DocumentTextIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import GetMetar from '@/app/components/get-metar';
import GetPirep from '@/app/components/get-pirep';
import GetAirSigmet from '@/app/components/get-airsigmet';
import GetWindsAloft from '@/app/components/get-windsaloft';

const MORE_SECTIONS = [
    {
        name: 'Products & Alerts',
        href: '/ui/dashboard/weather/products',
        icon: DocumentTextIcon,
        desc: 'CWA, MIS, TFM convective forecast, area forecast discussion, and NWS active alerts.',
    },
    {
        name: 'Reference Data',
        href: '/ui/dashboard/weather/reference',
        icon: BookOpenIcon,
        desc: 'Airport/station info, NAVAID, fix, and obstacles near an airport.',
    },
];

const Weather = () => {
    return (
        <section className="flex flex-col w-full items-start pt-6 gap-4">
            <div>
                <span className="eyebrow">Briefing</span>
                <h2 className="font-serif text-2xl text-[var(--color-text)]">Weather</h2>
            </div>
            <div className="flex flex-col w-full items-start divide-y divide-[var(--color-rule)]">
                <GetMetar />
                <GetPirep />
                <GetAirSigmet />
                <GetWindsAloft />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {MORE_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.href}
                            href={section.href}
                            className="panel flex flex-col gap-3 transition-colors hover:border-[var(--color-accent)]"
                        >
                            <Icon className="w-6 text-[var(--color-accent)]" />
                            <span className="font-sans text-sm font-bold uppercase tracking-widest text-[var(--color-text)]">
                                {section.name}
                            </span>
                            <span className="font-mono text-xs text-[var(--color-text-accent)]">
                                {section.desc}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default Weather;
