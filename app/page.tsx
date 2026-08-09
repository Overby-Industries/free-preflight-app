import Link from 'next/link';
import Nav from '@/app/components/nav';

const FEATURES = [
    { name: 'Weather briefing', desc: 'METAR, TAF, PIREP, AIRMET/SIGMET, and winds aloft.' },
    { name: 'Live traffic', desc: 'Nearby air traffic plotted on a live map.' },
    { name: 'Weight & balance', desc: 'Per-aircraft loading with a plotted CG envelope.' },
    { name: 'Flight Service', desc: 'The numbers you need to file, open, or close a flight plan.' },
];

const LandingPage = () => {
    return (
        <main className="grid grid-cols-1 min-h-screen w-full p-4 gap-10">
            <Nav />
            <section className="flex flex-col items-start gap-8 max-w-2xl">
                <div>
                    <span className="eyebrow">Free &middot; No Account &middot; No API Keys</span>
                    <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] leading-tight">
                        Fly prepared, <em className="italic text-[var(--color-accent)]">every time</em>.
                    </h2>
                </div>
                <p className="font-mono text-sm text-[var(--color-text-accent)] leading-relaxed">
                    FreeFlight is a free, lightweight pre-flight electronic flight bag &mdash; weather,
                    traffic, and weight &amp; balance in one place, installable straight from your browser.
                </p>
                <ul className="flex flex-col gap-3 w-full">
                    {FEATURES.map((feature) => (
                        <li key={feature.name} className="flex items-start gap-3">
                            <span className="diamond mt-1.5" />
                            <span className="font-mono text-sm text-[var(--color-text)]">
                                <span className="font-bold">{feature.name}</span>
                                <span className="text-[var(--color-text-accent)]"> &mdash; {feature.desc}</span>
                            </span>
                        </li>
                    ))}
                </ul>
                <Link href="/ui/dashboard" className="btn btn-primary">
                    Open Flight Bag
                </Link>
            </section>
        </main>
    );
};

export default LandingPage;
