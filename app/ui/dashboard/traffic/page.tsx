import React from 'react';
import GetTraffic from '@/app/components/get-traffic';

const Traffic = () => {
    return (
        <section className="flex flex-col w-full items-start pt-6">
            <span className="eyebrow">Situational Awareness</span>
            <h2 className="font-serif text-2xl text-[var(--color-text)] pb-2">Traffic</h2>
            <div className="flex flex-col w-full items-start">
                <GetTraffic />
            </div>
        </section>
    );
}

export default Traffic;
