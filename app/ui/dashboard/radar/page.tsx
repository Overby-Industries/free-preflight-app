import React from 'react';
import GetRadar from '@/app/components/get-radar';

const Radar = () => {
    return (
        <section className="flex flex-col w-full items-start pt-6">
            <span className="eyebrow">Situational Awareness</span>
            <h2 className="font-serif text-2xl text-[var(--color-text)] pb-2">Radar &amp; Satellite</h2>
            <div className="flex flex-col w-full items-start">
                <GetRadar />
            </div>
        </section>
    );
};

export default Radar;
