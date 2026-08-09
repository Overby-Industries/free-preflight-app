import Link from 'next/link';
import { MapIcon, RocketLaunchIcon, ScaleIcon, SunIcon } from '@heroicons/react/24/outline';

const SECTIONS = [
    {
        name: 'Weather',
        href: '/ui/dashboard/weather',
        icon: SunIcon,
        desc: 'METAR, TAF, PIREP, AIRMET/SIGMET, and winds aloft.',
    },
    {
        name: 'Traffic',
        href: '/ui/dashboard/traffic',
        icon: MapIcon,
        desc: 'Live nearby air traffic on a map.',
    },
    {
        name: 'Weight & Balance',
        href: '/ui/dashboard/weight-balance',
        icon: ScaleIcon,
        desc: 'Per-aircraft loading and CG envelope.',
    },
    {
        name: 'Pre-Flight',
        href: '/ui/dashboard/pre-flight',
        icon: RocketLaunchIcon,
        desc: 'Flight Service contacts and briefing numbers.',
    },
];

const Dashboard = () => {
    return (
        <section className="flex flex-col w-full gap-6 pt-6">
            <div>
                <span className="eyebrow">Dashboard</span>
                <h2 className="font-serif text-2xl text-[var(--color-text)]">Where to next?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SECTIONS.map((section) => {
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

export default Dashboard;
